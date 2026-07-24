package com.ammar.bookingsystem.availability.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

// providerId is required for an admin caller (target any provider) and ignored/forced to self for
// a provider caller (FR-7 — a provider can only ever generate for themselves).
// perWeekdayTimeRanges is optional: when present and non-empty for a given weekday, it overrides
// the shared `timeRanges` for that weekday only ("customize time ranges per weekday" mode).
public record BulkGenerateRequest(
        Long providerId,
        @NotEmpty List<DayOfWeek> weekdays,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotEmpty List<SlotTimeRange> timeRanges,
        Map<DayOfWeek, List<SlotTimeRange>> perWeekdayTimeRanges) {

    // Effective ranges for a given weekday: the per-weekday override if provided (and non-empty),
    // otherwise the shared list.
    public List<SlotTimeRange> rangesFor(DayOfWeek weekday) {
        if (perWeekdayTimeRanges != null) {
            List<SlotTimeRange> override = perWeekdayTimeRanges.get(weekday);
            if (override != null && !override.isEmpty()) {
                return override;
            }
        }
        return timeRanges;
    }
}
