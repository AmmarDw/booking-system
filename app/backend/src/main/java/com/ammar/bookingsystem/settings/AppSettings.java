package com.ammar.bookingsystem.settings;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Single-row settings table (FR-14/FR-15) — id is always 1, seeded by V2__seed_app_settings.sql.
// No @GeneratedValue: this is a natural/fixed key, not an auto-incrementing one.
@Entity
@Table(name = "app_settings")
public class AppSettings {

    @Id
    private Short id;

    @Column(name = "max_booking_horizon_months", nullable = false)
    private Integer maxBookingHorizonMonths;

    protected AppSettings() {
        // JPA
    }

    public Short getId() {
        return id;
    }

    public Integer getMaxBookingHorizonMonths() {
        return maxBookingHorizonMonths;
    }

    public void setMaxBookingHorizonMonths(Integer maxBookingHorizonMonths) {
        this.maxBookingHorizonMonths = maxBookingHorizonMonths;
    }
}
