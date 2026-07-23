package com.ammar.bookingsystem.settings.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateBookingWindowRequest(@NotNull @Min(1) @Max(24) Integer maxHorizonMonths) {}
