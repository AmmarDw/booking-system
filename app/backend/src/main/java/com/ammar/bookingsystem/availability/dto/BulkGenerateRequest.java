package com.ammar.bookingsystem.availability.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

// providerId is required for an admin caller (target any provider) and ignored/forced to self for
// a provider caller (FR-7 — a provider can only ever generate for themselves).
public record BulkGenerateRequest(
        Long providerId,
        @NotEmpty List<DayOfWeek> weekdays,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotEmpty List<SlotTimeRange> timeRanges) {}
