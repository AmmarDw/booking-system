package com.ammar.bookingsystem.availability.dto;

import java.time.LocalDate;

// Per-day available/total counts for the month calendar view (FR-9, CLAUDE.md §B.4).
public record DayAvailabilityCount(LocalDate date, long available, long total) {}
