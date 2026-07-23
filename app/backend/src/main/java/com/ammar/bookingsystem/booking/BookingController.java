package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.booking.dto.BookingResponse;
import com.ammar.bookingsystem.booking.dto.CreateBookingRequest;
import com.ammar.bookingsystem.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Requires authentication — falls under SecurityConfig's default .anyRequest().authenticated()
// (not permitted publicly), which is the real enforcement of FR-2/FR-12 for booking creation.
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request) {
        Long consumerId = CurrentUser.get().getId();
        BookingResponse response = bookingService.createBooking(consumerId, request);
        return ResponseEntity.ok(response);
    }
}
