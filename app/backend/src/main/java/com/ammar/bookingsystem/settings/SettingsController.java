package com.ammar.bookingsystem.settings;

import com.ammar.bookingsystem.config.AppSettingsCache;
import com.ammar.bookingsystem.settings.dto.BookingWindowResponse;
import com.ammar.bookingsystem.settings.dto.UpdateBookingWindowRequest;
import jakarta.validation.Valid;
import java.time.LocalDate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// GET is public (FR-15 needs the horizon to render the calendar before login); PUT is admin-only (FR-14).
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final AppSettingsCache appSettingsCache;
    private final AppSettingsRepository appSettingsRepository;

    public SettingsController(AppSettingsCache appSettingsCache, AppSettingsRepository appSettingsRepository) {
        this.appSettingsCache = appSettingsCache;
        this.appSettingsRepository = appSettingsRepository;
    }

    @GetMapping("/booking-window")
    public BookingWindowResponse bookingWindow() {
        int horizonMonths = appSettingsCache.getMaxHorizonMonths();
        int advanceLimitMonths = appSettingsCache.getAdvanceLimitMonths();
        LocalDate today = LocalDate.now();
        return new BookingWindowResponse(
                horizonMonths,
                today,
                today.plusMonths(horizonMonths),
                advanceLimitMonths,
                today.plusMonths(advanceLimitMonths));
    }

    @PutMapping("/booking-window")
    @PreAuthorize("hasRole('ADMIN')")
    public BookingWindowResponse updateBookingWindow(@Valid @RequestBody UpdateBookingWindowRequest request) {
        AppSettings settings = appSettingsRepository.findById((short) 1).orElseThrow();
        settings.setMaxBookingHorizonMonths(request.maxHorizonMonths());
        appSettingsRepository.save(settings);
        appSettingsCache.refresh();
        return bookingWindow();
    }
}
