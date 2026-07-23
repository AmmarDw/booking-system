package com.ammar.bookingsystem.availability.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public record SlotTimeRange(@NotNull LocalTime startTime, @NotNull LocalTime endTime) {}
