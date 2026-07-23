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
    private final double providerAdvanceMultiplier;
    private volatile int maxHorizonMonths;

    public AppSettingsCache(
            AppSettingsRepository repository,
            @Value("${booking.max-horizon-months}") int defaultHorizonMonths,
            @Value("${booking.provider-advance-multiplier}") double providerAdvanceMultiplier) {
        this.repository = repository;
        this.defaultHorizonMonths = defaultHorizonMonths;
        this.providerAdvanceMultiplier = providerAdvanceMultiplier;
        refresh();
    }

    public int getMaxHorizonMonths() {
        return maxHorizonMonths;
    }

    // How far ahead providers/admins may pre-load availability (CLAUDE.md §B.4.1) — derived, not
    // stored, and not admin-facing (the multiplier is yaml-only).
    public int getAdvanceLimitMonths() {
        return (int) Math.ceil(maxHorizonMonths * providerAdvanceMultiplier);
    }

    public void refresh() {
        this.maxHorizonMonths = repository
                .findById(SETTINGS_ROW_ID)
                .map(AppSettings::getMaxBookingHorizonMonths)
                .orElse(defaultHorizonMonths);
    }
}
