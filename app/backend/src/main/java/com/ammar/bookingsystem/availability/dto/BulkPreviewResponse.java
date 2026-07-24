package com.ammar.bookingsystem.availability.dto;

import java.time.LocalDate;
import java.util.List;

// Dry-run of a bulk-generate request (Phase 3 generator preview). affectedDates are dates that
// would get at least one NEW slot; conflictDates are dates where at least one requested slot
// already exists (same date+start-time) and would be skipped. conflictBookedCount counts how many
// of those existing conflicts are already BOOKED (can never be touched — surfaced separately in
// the UI so "skipped" doesn't read as "will be overwritten").
public record BulkPreviewResponse(
        int totalSlots,
        List<LocalDate> affectedDates,
        List<LocalDate> conflictDates,
        int conflictSlotCount,
        int conflictBookedCount) {}
