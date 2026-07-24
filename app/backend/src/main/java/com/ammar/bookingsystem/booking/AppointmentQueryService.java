package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.booking.dto.AppointmentSummary;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

// Appointments list: providers see their own (as the provider) PLUS any bookings they made
// themselves as a consumer elsewhere — merged into one dashboard view, distinguished client-side
// via consumerId (FR-10/FR-11). Admins see all (already includes their own consumer-side bookings,
// since nothing is excluded for them). `listOwnAsConsumer` powers the separate "My Appointments"
// page, open to every role, always scoped to bookings the caller made as a consumer regardless of
// their primary role. Fetches all bookings and filters in-memory — fine at bootcamp/demo scale;
// would need a proper query (Specification/JPQL) before any real production volume.
@Component
public class AppointmentQueryService {

    private final BookingRepository bookingRepository;
    private final MeetingLinkRepository meetingLinkRepository;

    public AppointmentQueryService(BookingRepository bookingRepository, MeetingLinkRepository meetingLinkRepository) {
        this.bookingRepository = bookingRepository;
        this.meetingLinkRepository = meetingLinkRepository;
    }

    public List<AppointmentSummary> list(User caller, Long serviceIdFilter, String statusFilter, Long providerIdFilter) {
        if (caller.getRole() == Role.PROVIDER) {
            Long providerId = caller.getId();
            return filterMapSort(
                    bookingRepository.findAll().stream()
                            .filter(b -> b.getSlot().getProviderUser().getId().equals(providerId)
                                    || b.getConsumerUser().getId().equals(providerId)),
                    serviceIdFilter,
                    statusFilter);
        } else if (caller.getRole() == Role.ADMIN) {
            return filterMapSort(
                    bookingRepository.findAll().stream()
                            .filter(b -> providerIdFilter == null
                                    || b.getSlot().getProviderUser().getId().equals(providerIdFilter)),
                    serviceIdFilter,
                    statusFilter);
        } else if (caller.getRole() == Role.CONSUMER) {
            return listOwnAsConsumer(caller, serviceIdFilter, statusFilter);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to view appointments");
    }

    /** Bookings the caller made as a consumer, regardless of their primary role — the "My Appointments" page. */
    public List<AppointmentSummary> listOwnAsConsumer(User caller, Long serviceIdFilter, String statusFilter) {
        Long consumerId = caller.getId();
        return filterMapSort(
                bookingRepository.findAll().stream().filter(b -> b.getConsumerUser().getId().equals(consumerId)),
                serviceIdFilter,
                statusFilter);
    }

    private List<AppointmentSummary> filterMapSort(Stream<Booking> stream, Long serviceIdFilter, String statusFilter) {
        return stream
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
                booking.getConsumerUser().getId(),
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
