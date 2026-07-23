package com.ammar.bookingsystem.availability.dto;

import com.ammar.bookingsystem.availability.AvailabilitySlot;
import java.time.LocalTime;

public record SlotInfo(Long id, LocalTime startTime, LocalTime endTime, String status) {

    public static SlotInfo from(AvailabilitySlot slot) {
        return new SlotInfo(slot.getId(), slot.getStartTime(), slot.getEndTime(), slot.getStatus().name());
    }
}
