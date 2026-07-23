package com.ammar.bookingsystem.config;

import com.ammar.bookingsystem.settings.AppSettings;
import com.ammar.bookingsystem.settings.AppSettingsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// Caches the single-row AppSettings in memory (FR-14/FR-15, CLAUDE.md §B.4.1) so every booking
// request doesn't hit the DB just to read the horizon. Seeded from the DB row (itself seeded from
// application.yaml's booking.max-horizon-months by V2). refresh() is called by the admin
// settings-update endpoint (M5) so a change applies immediately without a restart.
@Component
public class AppSettingsCache {

    private static final short SETTINGS_ROW_ID = 1;

    private final AppSettingsRepository repository;
    private final int defaultHorizonMonths;
    private volatile int maxHorizonMonths;

    public AppSettingsCache(
            AppSettingsRepository repository, @Value("${booking.max-horizon-months}") int defaultHorizonMonths) {
        this.repository = repository;
        this.defaultHorizonMonths = defaultHorizonMonths;
        refresh();
    }

    public int getMaxHorizonMonths() {
        return maxHorizonMonths;
    }

    public void refresh() {
        this.maxHorizonMonths = repository
                .findById(SETTINGS_ROW_ID)
                .map(AppSettings::getMaxBookingHorizonMonths)
                .orElse(defaultHorizonMonths);
    }
}
