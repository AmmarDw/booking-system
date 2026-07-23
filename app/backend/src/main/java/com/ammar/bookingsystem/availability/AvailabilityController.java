package com.ammar.bookingsystem.availability;

import com.ammar.bookingsystem.availability.dto.DayAvailabilityCount;
import com.ammar.bookingsystem.availability.dto.ProviderDaySlots;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Public read-only browse (architecture doc: "GET /api/services/{id}/availability... public").
// Actual booking validation (horizon enforcement) happens server-side in BookingService — these
// GETs return real data regardless of the window; the frontend uses /api/settings/booking-window
// to decide what's shadowed/disabled.
@RestController
@RequestMapping("/api/services/{serviceId}/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/month")
    public List<DayAvailabilityCount> month(
            @PathVariable Long serviceId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
        return availabilityService.monthAvailability(serviceId, yearMonth);
    }

    @GetMapping("/day")
    public List<ProviderDaySlots> day(
            @PathVariable Long serviceId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return availabilityService.dayAvailability(serviceId, date);
    }
}
