package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.booking.dto.AppointmentSummary;
import com.ammar.bookingsystem.booking.dto.BookingResponse;
import com.ammar.bookingsystem.booking.dto.ChartResponse;
import com.ammar.bookingsystem.booking.dto.CreateBookingRequest;
import com.ammar.bookingsystem.booking.dto.DashboardStats;
import com.ammar.bookingsystem.booking.dto.UpdateBookingStatusRequest;
import com.ammar.bookingsystem.security.CurrentUser;
import com.ammar.bookingsystem.security.UserPrincipal;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// POST requires authentication — falls under SecurityConfig's default .anyRequest().authenticated()
// (not permitted publicly), which is the real enforcement of FR-2/FR-12 for booking creation.
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final AppointmentQueryService appointmentQueryService;

    public BookingController(BookingService bookingService, AppointmentQueryService appointmentQueryService) {
        this.bookingService = bookingService;
        this.appointmentQueryService = appointmentQueryService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request) {
        Long consumerId = CurrentUser.get().getId();
        BookingResponse response = bookingService.createBooking(consumerId, request);
        return ResponseEntity.ok(response);
    }

    // Appointments list (FR-10/FR-11) — providers/admins get the dashboard view (a provider's own
    // bookings-as-a-consumer are merged in too); `mine=true` instead always returns bookings the
    // caller made as a consumer regardless of role — the "My Appointments" page. Scoping is
    // enforced in AppointmentQueryService either way, never trust the client.
    @GetMapping
    @PreAuthorize("hasAnyRole('CONSUMER','PROVIDER','ADMIN')")
    public List<AppointmentSummary> list(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long providerId,
            @RequestParam(required = false, defaultValue = "false") boolean mine) {
        var caller = CurrentUser.get().getUser();
        if (mine) {
            return appointmentQueryService.listOwnAsConsumer(caller, serviceId, status);
        }
        return appointmentQueryService.list(caller, serviceId, status, providerId);
    }

    // Status transitions (Phase 4) — open to any authenticated role; the service enforces the real
    // per-role, ownership, and time-gate rules (a consumer can cancel/no-show their own booking, a
    // provider/admin can complete/no-show).
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('CONSUMER','PROVIDER','ADMIN')")
    public BookingResponse updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateBookingStatusRequest request) {
        UserPrincipal caller = CurrentUser.get();
        return bookingService.updateStatus(id, caller.getId(), caller.getUser().getRole(), request.status());
    }

    // ---- dashboard (Phase 6): multi-value comma-separated filters + a date range ----

    // Calendar + list feed: real bookings plus synthesized VACANT open-slot entries.
    @GetMapping("/feed")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public List<AppointmentSummary> feed(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String serviceIds,
            @RequestParam(required = false) String statuses,
            @RequestParam(required = false) String providerIds) {
        return appointmentQueryService.feed(
                CurrentUser.get().getUser(), from, to, parseLongs(serviceIds), parseStatuses(statuses), parseLongs(providerIds));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public DashboardStats stats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String serviceIds,
            @RequestParam(required = false) String providerIds) {
        return appointmentQueryService.stats(
                CurrentUser.get().getUser(), from, to, parseLongs(serviceIds), parseLongs(providerIds));
    }

    @GetMapping("/chart")
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    public ChartResponse chart(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false, defaultValue = "day") String granularity,
            @RequestParam(required = false) String serviceIds,
            @RequestParam(required = false) String statuses,
            @RequestParam(required = false) String providerIds) {
        return appointmentQueryService.chart(
                CurrentUser.get().getUser(),
                from,
                to,
                granularity,
                parseLongs(serviceIds),
                parseStatuses(statuses),
                parseLongs(providerIds));
    }

    private static List<Long> parseLongs(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return java.util.Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::valueOf)
                .toList();
    }

    private static List<BookingStatus> parseStatuses(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return java.util.Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> BookingStatus.valueOf(s.toUpperCase(java.util.Locale.ROOT)))
                .toList();
    }
}
