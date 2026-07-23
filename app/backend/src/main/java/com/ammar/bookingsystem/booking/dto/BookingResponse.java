package com.ammar.bookingsystem.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingResponse(
        Long id,
        String serviceName,
        String providerName,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String status) {}
