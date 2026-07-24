package com.ammar.bookingsystem.booking.dto;

import com.ammar.bookingsystem.booking.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateBookingStatusRequest(@NotNull BookingStatus status) {}
