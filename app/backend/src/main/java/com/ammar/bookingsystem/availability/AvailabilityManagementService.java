package com.ammar.bookingsystem.availability;

import com.ammar.bookingsystem.availability.dto.BulkGenerateRequest;
import com.ammar.bookingsystem.availability.dto.BulkGenerateResponse;
import com.ammar.bookingsystem.availability.dto.ManagementSlotInfo;
import com.ammar.bookingsystem.availability.dto.SlotTimeRange;
import com.ammar.bookingsystem.config.AppSettingsCache;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import com.ammar.bookingsystem.user.UserRepository;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    @Transactional
    public BulkGenerateResponse bulkGenerate(User caller, BulkGenerateRequest request) {
        User provider = resolveTargetProvider(caller, request.providerId());

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

        Set<DateTimeKey> existing = new HashSet<>();
        for (AvailabilitySlot slot : availabilitySlotRepository.findByProviderUserIdAndSlotDateBetween(
                provider.getId(), request.startDate(), request.endDate())) {
            existing.add(new DateTimeKey(slot.getSlotDate(), slot.getStartTime()));
        }

        Set<java.time.DayOfWeek> weekdays = new HashSet<>(request.weekdays());
        int created = 0;
        int skipped = 0;
        for (LocalDate date = request.startDate(); !date.isAfter(request.endDate()); date = date.plusDays(1)) {
            if (!weekdays.contains(date.getDayOfWeek())) continue;
            for (SlotTimeRange range : request.timeRanges()) {
                if (range.endTime().isBefore(range.startTime()) || range.endTime().equals(range.startTime())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each time range's end must be after its start");
                }
                DateTimeKey key = new DateTimeKey(date, range.startTime());
                if (existing.contains(key)) {
                    skipped++;
                    continue;
                }
                availabilitySlotRepository.save(new AvailabilitySlot(provider, date, range.startTime(), range.endTime()));
                existing.add(key);
                created++;
            }
        }
        return new BulkGenerateResponse(created, skipped);
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
