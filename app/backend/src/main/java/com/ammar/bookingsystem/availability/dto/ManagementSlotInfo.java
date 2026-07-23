package com.ammar.bookingsystem.availability.dto;

import com.ammar.bookingsystem.availability.AvailabilitySlot;
import java.time.LocalDate;
import java.time.LocalTime;

public record ManagementSlotInfo(Long id, LocalDate date, LocalTime startTime, LocalTime endTime, String status) {

    public static ManagementSlotInfo from(AvailabilitySlot slot) {
        return new ManagementSlotInfo(
                slot.getId(), slot.getSlotDate(), slot.getStartTime(), slot.getEndTime(), slot.getStatus().name());
    }
}
