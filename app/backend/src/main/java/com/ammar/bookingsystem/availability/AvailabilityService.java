package com.ammar.bookingsystem.availability;

import com.ammar.bookingsystem.availability.dto.DayAvailabilityCount;
import com.ammar.bookingsystem.availability.dto.ProviderDaySlots;
import com.ammar.bookingsystem.availability.dto.SlotInfo;
import com.ammar.bookingsystem.service.Service;
import com.ammar.bookingsystem.service.ServiceRepository;
import com.ammar.bookingsystem.user.User;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AvailabilityService {

    private final ServiceRepository serviceRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;

    public AvailabilityService(ServiceRepository serviceRepository, AvailabilitySlotRepository availabilitySlotRepository) {
        this.serviceRepository = serviceRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
    }

    public List<DayAvailabilityCount> monthAvailability(Long serviceId, YearMonth yearMonth) {
        List<Long> providerIds = providerIdsFor(serviceId);
        if (providerIds.isEmpty()) return List.of();

        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        List<AvailabilitySlot> slots =
                availabilitySlotRepository.findByProviderUserIdInAndSlotDateBetween(providerIds, start, end);

        Map<LocalDate, List<AvailabilitySlot>> byDate =
                slots.stream().collect(Collectors.groupingBy(AvailabilitySlot::getSlotDate));

        return byDate.entrySet().stream()
                .map(entry -> {
                    long total = entry.getValue().size();
                    long available = entry.getValue().stream()
                            .filter(s -> s.getStatus() == SlotStatus.AVAILABLE)
                            .count();
                    return new DayAvailabilityCount(entry.getKey(), available, total);
                })
                .sorted(Comparator.comparing(DayAvailabilityCount::date))
                .toList();
    }

    public List<ProviderDaySlots> dayAvailability(Long serviceId, LocalDate date) {
        List<Long> providerIds = providerIdsFor(serviceId);
        if (providerIds.isEmpty()) return List.of();

        List<AvailabilitySlot> slots = availabilitySlotRepository.findByProviderUserIdInAndSlotDate(providerIds, date);
        Map<User, List<AvailabilitySlot>> byProvider =
                slots.stream().collect(Collectors.groupingBy(AvailabilitySlot::getProviderUser));

        return byProvider.entrySet().stream()
                .map(entry -> new ProviderDaySlots(
                        entry.getKey().getId(),
                        displayName(entry.getKey()),
                        entry.getValue().stream()
                                .sorted(Comparator.comparing(AvailabilitySlot::getStartTime))
                                .map(SlotInfo::from)
                                .toList()))
                .sorted(Comparator.comparing(ProviderDaySlots::providerName))
                .toList();
    }

    private List<Long> providerIdsFor(Long serviceId) {
        Service service = serviceRepository
                .findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        return service.getProviders().stream().map(User::getId).toList();
    }

    private static String displayName(User user) {
        return user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getEmail();
    }
}
