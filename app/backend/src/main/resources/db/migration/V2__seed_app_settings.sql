-- Seed the single AppSettings row. Value mirrors application.yaml's booking.max-horizon-months default.
INSERT INTO app_settings (id, max_booking_horizon_months) VALUES (1, 6);
