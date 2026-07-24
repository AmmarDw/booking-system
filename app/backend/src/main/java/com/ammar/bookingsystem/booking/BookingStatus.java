package com.ammar.bookingsystem.booking;

public enum BookingStatus {
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    NO_SHOW,
    // VACANT is never persisted to the bookings table — no Booking row ever represents an empty
    // slot. It exists only so the dashboard feed can label synthesized "open slot" DTO entries.
    // (The DB CHECK constraint deliberately excludes it; see V7 migration.)
    VACANT
}
