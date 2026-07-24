package com.ammar.bookingsystem.availability;

import com.ammar.bookingsystem.availability.dto.BulkGenerateRequest;
import com.ammar.bookingsystem.availability.dto.BulkGenerateResponse;
import com.ammar.bookingsystem.availability.dto.BulkPreviewResponse;
import com.ammar.bookingsystem.availability.dto.ManagementSlotInfo;
import com.ammar.bookingsystem.availability.dto.SlotTimeRange;
import com.ammar.bookingsystem.config.AppSettingsCache;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import com.ammar.bookingsystem.user.UserRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Bulk generation + management of a provider's own availability (FR-7). A provider may only ever
// target themselves; an admin may target any provider (CLAUDE.md §B.3).
@Component
public class AvailabilityManagementService {

    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final UserRepository userRepository;
    private final AppSettingsCache appSettingsCache;

    public AvailabilityManagementService(
            AvailabilitySlotRepository availabilitySlotRepository,
            UserRepository userRepository,
            AppSettingsCache appSettingsCache) {
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.userRepository = userRepository;
        this.appSettingsCache = appSettingsCache;
    }

    // Dry-run: what would bulkGenerate do, without writing anything. Powers the live preview.
    public BulkPreviewResponse preview(User caller, BulkGenerateRequest request) {
        User provider = resolveTargetProvider(caller, request.providerId());
        validateWindow(request);

        Map<DateTimeKey, SlotStatus> existing = existingByKey(provider.getId(), request.startDate(), request.endDate());
        Set<DayOfWeek> weekdays = new HashSet<>(request.weekdays());

        int totalSlots = 0;
        int conflictSlotCount = 0;
        int conflictBookedCount = 0;
        Set<LocalDate> affected = new TreeSet<>();
        Set<LocalDate> conflicts = new TreeSet<>();

        for (LocalDate date = request.startDate(); !date.isAfter(request.endDate()); date = date.plusDays(1)) {
            if (!weekdays.contains(date.getDayOfWeek())) continue;
            for (SlotTimeRange range : effectiveRanges(request, date.getDayOfWeek())) {
                DateTimeKey key = new DateTimeKey(date, range.startTime());
                SlotStatus existingStatus = existing.get(key);
                if (existingStatus != null) {
                    conflictSlotCount++;
                    conflicts.add(date);
                    if (existingStatus == SlotStatus.BOOKED) conflictBookedCount++;
                } else {
                    totalSlots++;
                    affected.add(date);
                }
            }
        }
        return new BulkPreviewResponse(
                totalSlots, new ArrayList<>(affected), new ArrayList<>(conflicts), conflictSlotCount, conflictBookedCount);
    }

    @Transactional
    public BulkGenerateResponse bulkGenerate(User caller, BulkGenerateRequest request) {
        User provider = resolveTargetProvider(caller, request.providerId());
        validateWindow(request);

        Map<DateTimeKey, SlotStatus> existing = existingByKey(provider.getId(), request.startDate(), request.endDate());
        Set<DayOfWeek> weekdays = new HashSet<>(request.weekdays());

        int created = 0;
        int skipped = 0;
        for (LocalDate date = request.startDate(); !date.isAfter(request.endDate()); date = date.plusDays(1)) {
            if (!weekdays.contains(date.getDayOfWeek())) continue;
            for (SlotTimeRange range : effectiveRanges(request, date.getDayOfWeek())) {
                DateTimeKey key = new DateTimeKey(date, range.startTime());
                if (existing.containsKey(key)) {
                    // Non-destructive: an existing slot (available OR booked) is never overwritten.
                    skipped++;
                    continue;
                }
                availabilitySlotRepository.save(new AvailabilitySlot(provider, date, range.startTime(), range.endTime()));
                existing.put(key, SlotStatus.AVAILABLE);
                created++;
            }
        }
        return new BulkGenerateResponse(created, skipped);
    }

    private void validateWindow(BulkGenerateRequest request) {
        if (request.startDate().isAfter(request.endDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date must be before end date");
        }
        LocalDate today = LocalDate.now();
        LocalDate maxAdvance = today.plusMonths(appSettingsCache.getAdvanceLimitMonths());
        if (request.startDate().isBefore(today)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date cannot be in the past");
        }
        if (request.endDate().isAfter(maxAdvance)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "End date is beyond the advance limit (" + maxAdvance + ")");
        }
    }

    private List<SlotTimeRange> effectiveRanges(BulkGenerateRequest request, DayOfWeek weekday) {
        List<SlotTimeRange> ranges = request.rangesFor(weekday);
        for (SlotTimeRange range : ranges) {
            if (!range.endTime().isAfter(range.startTime())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each time range's end must be after its start");
            }
        }
        return ranges;
    }

    private Map<DateTimeKey, SlotStatus> existingByKey(Long providerId, LocalDate from, LocalDate to) {
        Map<DateTimeKey, SlotStatus> existing = new HashMap<>();
        for (AvailabilitySlot slot : availabilitySlotRepository.findByProviderUserIdAndSlotDateBetween(providerId, from, to)) {
            existing.put(new DateTimeKey(slot.getSlotDate(), slot.getStartTime()), slot.getStatus());
        }
        return existing;
    }

    public List<ManagementSlotInfo> listSlots(User caller, Long providerId, LocalDate from, LocalDate to) {
        User provider = resolveTargetProvider(caller, providerId);
        return availabilitySlotRepository.findByProviderUserIdAndSlotDateBetween(provider.getId(), from, to).stream()
                .map(ManagementSlotInfo::from)
                .toList();
    }

    @Transactional
    public void deleteSlot(User caller, Long slotId) {
        AvailabilitySlot slot = availabilitySlotRepository
                .findById(slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));
        boolean isOwner = slot.getProviderUser().getId().equals(caller.getId());
        if (caller.getRole() != Role.ADMIN && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own availability");
        }
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete a slot that's already booked");
        }
        availabilitySlotRepository.delete(slot);
    }

    // A provider may only ever target themselves; an admin must supply a valid providerId.
    private User resolveTargetProvider(User caller, Long requestedProviderId) {
        if (caller.getRole() == Role.ADMIN) {
            if (requestedProviderId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "providerId is required for admins");
            }
            User provider = userRepository
                    .findById(requestedProviderId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found"));
            if (provider.getRole() != Role.PROVIDER) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That user is not a provider");
            }
            return provider;
        }
        if (caller.getRole() == Role.PROVIDER) {
            if (requestedProviderId != null && !requestedProviderId.equals(caller.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Providers may only manage their own availability");
            }
            return caller;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only providers or admins may manage availability");
    }

    private record DateTimeKey(LocalDate date, java.time.LocalTime time) {}
}
