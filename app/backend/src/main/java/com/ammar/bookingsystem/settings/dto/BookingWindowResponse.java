package com.ammar.bookingsystem.settings.dto;

import java.time.LocalDate;

public record BookingWindowResponse(
        int maxHorizonMonths,
        LocalDate today,
        LocalDate maxBookableDate,
        int advanceLimitMonths,
        LocalDate maxAdvanceDate) {}
