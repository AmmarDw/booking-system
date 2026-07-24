-- Extend the booking status lifecycle (Phase 4): add COMPLETED and NO_SHOW alongside the existing
-- CONFIRMED/CANCELLED. VACANT is intentionally NOT allowed here — it never represents a real
-- bookings row (it's a dashboard-only synthesized label for empty slots), so persisting it must
-- remain impossible at the DB level.
ALTER TABLE bookings DROP CONSTRAINT bookings_status_check;
ALTER TABLE bookings
    ADD CONSTRAINT bookings_status_check
    CHECK (status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'));
