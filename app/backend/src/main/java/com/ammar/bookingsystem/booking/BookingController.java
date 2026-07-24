package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.booking.dto.AppointmentSummary;
import com.ammar.bookingsystem.booking.dto.BookingResponse;
import com.ammar.bookingsystem.booking.dto.CreateBookingRequest;
import com.ammar.bookingsystem.security.CurrentUser;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
}
