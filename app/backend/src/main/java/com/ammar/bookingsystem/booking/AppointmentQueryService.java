package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.availability.AvailabilitySlot;
import com.ammar.bookingsystem.availability.AvailabilitySlotRepository;
import com.ammar.bookingsystem.availability.SlotStatus;
import com.ammar.bookingsystem.booking.dto.AppointmentSummary;
import com.ammar.bookingsystem.booking.dto.ChartResponse;
import com.ammar.bookingsystem.booking.dto.DashboardStats;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import com.ammar.bookingsystem.user.UserRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Stream;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

// Appointments list + dashboard analytics (FR-10/FR-11). Fetches all bookings/slots and filters
// in-memory — fine at bootcamp/demo scale; would need a proper query (Specification/JPQL) before
// any real production volume.
@Component
public class AppointmentQueryService {

    private final BookingRepository bookingRepository;
    private final MeetingLinkRepository meetingLinkRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final UserRepository userRepository;

    public AppointmentQueryService(
            BookingRepository bookingRepository,
            MeetingLinkRepository meetingLinkRepository,
            AvailabilitySlotRepository availabilitySlotRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.meetingLinkRepository = meetingLinkRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.userRepository = userRepository;
    }

    // ---- legacy single-value list (kept for the consumer "My Appointments" path) ----

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

    // ---- dashboard (multi-value filters + date range) ----

    /**
     * Real bookings (in scope + filters) PLUS synthesized VACANT entries for open slots. Powers the
     * dashboard calendar + list. Provider role → own provider slots (and their own consumer
     * bookings, marked via consumerId); admin → all (or the providerIds filter). Vacant entries are
     * excluded when a specific service is filtered (an open slot isn't tied to a service) and only
     * included when VACANT is among the selected statuses.
     */
    public List<AppointmentSummary> feed(
            User caller,
            LocalDate from,
            LocalDate to,
            List<Long> serviceIds,
            List<BookingStatus> statuses,
            List<Long> providerIds) {
        List<Long> scope = scopedProviderIds(caller, providerIds);

        List<AppointmentSummary> out = new ArrayList<>();

        bookingRepository.findAll().stream()
                .filter(b -> inScope(b, caller, scope))
                .filter(b -> withinRange(b.getSlot().getSlotDate(), from, to))
                .filter(b -> serviceIds.isEmpty() || serviceIds.contains(b.getService().getId()))
                .filter(b -> statuses.isEmpty() || statuses.contains(b.getStatus()))
                .map(this::toSummary)
                .forEach(out::add);

        boolean includeVacant = statuses.isEmpty() || statuses.contains(BookingStatus.VACANT);
        boolean serviceFilterActive = !serviceIds.isEmpty();
        if (includeVacant && !serviceFilterActive && !scope.isEmpty()) {
            for (AvailabilitySlot slot : availabilitySlotRepository.findByProviderUserIdInAndSlotDateBetween(scope, from, to)) {
                if (slot.getStatus() == SlotStatus.AVAILABLE) {
                    out.add(vacantSummary(slot));
                }
            }
        }

        out.sort((a, c) -> {
            int byDate = a.date().compareTo(c.date());
            return byDate != 0 ? byDate : a.startTime().compareTo(c.startTime());
        });
        return out;
    }

    public DashboardStats stats(
            User caller, LocalDate from, LocalDate to, List<Long> serviceIds, List<Long> providerIds) {
        List<Long> scope = scopedProviderIds(caller, providerIds);
        // Service + provider + date-range narrow the cards; the status filter deliberately does NOT
        // (each card has an intrinsic status meaning).
        List<Booking> scoped = bookingRepository.findAll().stream()
                .filter(b -> inScope(b, caller, scope))
                .filter(b -> serviceIds.isEmpty() || serviceIds.contains(b.getService().getId()))
                .toList();

        long onStart = scoped.stream()
                .filter(b -> b.getSlot().getSlotDate().equals(from))
                .count();
        long confirmed = scoped.stream()
                .filter(b -> withinRange(b.getSlot().getSlotDate(), from, to))
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .count();
        long cancelled = scoped.stream()
                .filter(b -> withinRange(b.getSlot().getSlotDate(), from, to))
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                .count();
        long completed = scoped.stream()
                .filter(b -> withinRange(b.getSlot().getSlotDate(), from, to))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
        long noShow = scoped.stream()
                .filter(b -> withinRange(b.getSlot().getSlotDate(), from, to))
                .filter(b -> b.getStatus() == BookingStatus.NO_SHOW)
                .count();
        int noShowRate = (completed + noShow) > 0 ? (int) Math.round(noShow * 100.0 / (completed + noShow)) : 0;

        return new DashboardStats(onStart, confirmed, cancelled, noShowRate);
    }

    public ChartResponse chart(
            User caller,
            LocalDate from,
            LocalDate to,
            String granularity,
            List<Long> serviceIds,
            List<BookingStatus> statuses,
            List<Long> providerIds) {
        List<Long> scope = scopedProviderIds(caller, providerIds);
        List<Booking> scoped = bookingRepository.findAll().stream()
                .filter(b -> inScope(b, caller, scope))
                .filter(b -> withinRange(b.getSlot().getSlotDate(), from, to))
                .filter(b -> serviceIds.isEmpty() || serviceIds.contains(b.getService().getId()))
                .filter(b -> statuses.isEmpty() || statuses.contains(b.getStatus()))
                .toList();

        List<ChartResponse.Bucket> buckets = new ArrayList<>();
        String g = granularity == null ? "day" : granularity.toLowerCase(Locale.ROOT);
        if ("month".equals(g)) {
            LocalDate cursor = from.withDayOfMonth(1);
            LocalDate end = to.withDayOfMonth(1);
            while (!cursor.isAfter(end)) {
                LocalDate bucketStart = cursor;
                long count = scoped.stream()
                        .filter(b -> {
                            LocalDate d = b.getSlot().getSlotDate();
                            return d.getYear() == bucketStart.getYear() && d.getMonthValue() == bucketStart.getMonthValue();
                        })
                        .count();
                buckets.add(new ChartResponse.Bucket(
                        cursor.getMonth().getDisplayName(TextStyle.SHORT, Locale.US) + " " + (cursor.getYear() % 100),
                        cursor,
                        count));
                cursor = cursor.plusMonths(1);
            }
        } else if ("week".equals(g)) {
            LocalDate cursor = from.with(DayOfWeek.MONDAY);
            while (!cursor.isAfter(to)) {
                LocalDate weekStart = cursor;
                LocalDate weekEnd = cursor.plusDays(6);
                long count = scoped.stream()
                        .filter(b -> !b.getSlot().getSlotDate().isBefore(weekStart)
                                && !b.getSlot().getSlotDate().isAfter(weekEnd))
                        .count();
                buckets.add(new ChartResponse.Bucket(
                        "W" + cursor.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR), cursor, count));
                cursor = cursor.plusWeeks(1);
            }
        } else {
            LocalDate cursor = from;
            while (!cursor.isAfter(to)) {
                LocalDate day = cursor;
                long count = scoped.stream()
                        .filter(b -> b.getSlot().getSlotDate().equals(day))
                        .count();
                buckets.add(new ChartResponse.Bucket(
                        cursor.getMonthValue() + "/" + cursor.getDayOfMonth(), cursor, count));
                cursor = cursor.plusDays(1);
            }
        }
        return new ChartResponse(buckets);
    }

    // ---- helpers ----

    private List<Long> scopedProviderIds(User caller, List<Long> providerIdsFilter) {
        if (caller.getRole() == Role.PROVIDER) {
            return List.of(caller.getId());
        }
        if (caller.getRole() == Role.ADMIN) {
            if (providerIdsFilter != null && !providerIdsFilter.isEmpty()) {
                return providerIdsFilter;
            }
            return userRepository.findByRole(Role.PROVIDER).stream().map(User::getId).toList();
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to view the dashboard");
    }

    // A provider sees bookings where they're the provider OR where they're the consumer (their own
    // "(You)" bookings); an admin's scope is expressed purely through the provider-id list.
    private boolean inScope(Booking b, User caller, List<Long> scope) {
        boolean providerMatch = scope.contains(b.getSlot().getProviderUser().getId());
        if (caller.getRole() == Role.PROVIDER) {
            return providerMatch || b.getConsumerUser().getId().equals(caller.getId());
        }
        return providerMatch;
    }

    private static boolean withinRange(LocalDate d, LocalDate from, LocalDate to) {
        return !d.isBefore(from) && !d.isAfter(to);
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

    // Synthesized "open slot" entry. Negative id (=-slotId) so it never collides with a real
    // positive booking id; null consumer fields; status VACANT (never a persisted booking state).
    private AppointmentSummary vacantSummary(AvailabilitySlot slot) {
        return new AppointmentSummary(
                -slot.getId(),
                null,
                null,
                null,
                displayName(slot.getProviderUser()),
                slot.getProviderUser().getId(),
                slot.getSlotDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                BookingStatus.VACANT.name(),
                null);
    }

    private static String displayName(User user) {
        return user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getEmail();
    }
}
