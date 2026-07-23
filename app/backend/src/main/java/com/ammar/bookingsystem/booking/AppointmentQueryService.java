package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.booking.dto.AppointmentSummary;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

// Appointments list: providers see only their own, admins see all and may filter by provider,
// consumers see only their own bookings (FR-10/FR-11 + the consumer "my appointments" view).
// Fetches all bookings and filters in-memory — fine at bootcamp/demo scale; would need a proper
// query (Specification/JPQL) before any real production volume.
@Component
public class AppointmentQueryService {

    private final BookingRepository bookingRepository;
    private final MeetingLinkRepository meetingLinkRepository;

    public AppointmentQueryService(BookingRepository bookingRepository, MeetingLinkRepository meetingLinkRepository) {
        this.bookingRepository = bookingRepository;
        this.meetingLinkRepository = meetingLinkRepository;
    }

    public List<AppointmentSummary> list(User caller, Long serviceIdFilter, String statusFilter, Long providerIdFilter) {
        Long scopedProviderId = null;
        Long scopedConsumerId = null;
        if (caller.getRole() == Role.PROVIDER) {
            scopedProviderId = caller.getId();
        } else if (caller.getRole() == Role.ADMIN) {
            scopedProviderId = providerIdFilter; // null = all providers
        } else if (caller.getRole() == Role.CONSUMER) {
            scopedConsumerId = caller.getId();
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to view appointments");
        }

        Long finalScopedProviderId = scopedProviderId;
        Long finalScopedConsumerId = scopedConsumerId;
        return bookingRepository.findAll().stream()
                .filter(b -> finalScopedProviderId == null
                        || b.getSlot().getProviderUser().getId().equals(finalScopedProviderId))
                .filter(b -> finalScopedConsumerId == null
                        || b.getConsumerUser().getId().equals(finalScopedConsumerId))
                .filter(b -> serviceIdFilter == null || b.getService().getId().equals(serviceIdFilter))
                .filter(b -> statusFilter == null || b.getStatus().name().equalsIgnoreCase(statusFilter))
                .map(this::toSummary)
                .sorted((a, c) -> {
                    int byDate = a.date().compareTo(c.date());
                    return byDate != 0 ? byDate : a.startTime().compareTo(c.startTime());
                })
                .toList();
    }

    private AppointmentSummary toSummary(Booking booking) {
        String meetingLink = meetingLinkRepository.findByBookingId(booking.getId()).map(MeetingLink::getUrl).orElse(null);
        return new AppointmentSummary(
                booking.getId(),
                booking.getService().getName(),
                displayName(booking.getConsumerUser()),
                displayName(booking.getSlot().getProviderUser()),
                booking.getSlot().getProviderUser().getId(),
                booking.getSlot().getSlotDate(),
                booking.getSlot().getStartTime(),
                booking.getSlot().getEndTime(),
                booking.getStatus().name(),
                meetingLink);
    }

    private static String displayName(User user) {
        return user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getEmail();
    }
}
