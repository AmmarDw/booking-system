-- FR-13: providers aren't bookable until they connect Google or set a fallback Meet link. The
-- demo providers seeded in V4 predate that gate; give them a fallback link so the M4 booking flow
-- keeps working without requiring a real Google OAuth connection for the demo/bootcamp environment.
INSERT INTO google_account_connections (user_id, fallback_meet_url)
SELECT id, 'https://meet.google.com/demo-fallback-link'
FROM users
WHERE email IN ('demo.provider@bookit.test', 'demo.provider2@bookit.test');
