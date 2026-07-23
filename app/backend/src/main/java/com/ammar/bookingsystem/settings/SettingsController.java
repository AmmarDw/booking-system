package com.ammar.bookingsystem.settings;

import com.ammar.bookingsystem.config.AppSettingsCache;
import com.ammar.bookingsystem.settings.dto.BookingWindowResponse;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Public (FR-15 needs the horizon to render the calendar before login). Admin PUT arrives in M5.
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final AppSettingsCache appSettingsCache;

    public SettingsController(AppSettingsCache appSettingsCache) {
        this.appSettingsCache = appSettingsCache;
    }

    @GetMapping("/booking-window")
    public BookingWindowResponse bookingWindow() {
        int horizonMonths = appSettingsCache.getMaxHorizonMonths();
        LocalDate today = LocalDate.now();
        return new BookingWindowResponse(horizonMonths, today, today.plusMonths(horizonMonths));
    }
}
