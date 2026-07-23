package com.ammar.bookingsystem.booking.dto;

import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest(@NotNull Long slotId, @NotNull Long serviceId) {}
