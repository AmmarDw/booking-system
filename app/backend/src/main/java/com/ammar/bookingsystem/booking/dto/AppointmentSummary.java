package com.ammar.bookingsystem.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentSummary(
        Long id,
        String serviceName,
        String consumerName,
        String providerName,
        Long providerId,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String status) {}
