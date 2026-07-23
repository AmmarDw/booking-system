package com.ammar.bookingsystem.service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateServiceRequest(
        @NotBlank String name, String description, @NotNull @Min(1) Integer durationMinutes) {}
