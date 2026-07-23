-- Demo providers + availability (bootcamp rule: demo data only). Real provider onboarding is
-- admin-managed (M5, FR-16) — this exists purely so M4's booking flow is testable before M5 ships.
-- Password for both is "password123" (hash extracted from a real registration through the app's
-- own BCryptPasswordEncoder, so it's guaranteed compatible).

INSERT INTO users (email, password_hash, full_name, role) VALUES
    ('demo.provider@bookit.test', '$2a$10$x896xNqYjymBIOcY3d0tS.CwKvf84B1GoCtc/RJNrlPfsSlKUeUHe', 'Dr. Demo Provider', 'PROVIDER'),
    ('demo.provider2@bookit.test', '$2a$10$JSglvAUPZxzkhEi6nU0UC.dPbGvD/rThV7QlPJ4POmoNSChob6LvS', 'Dr. Second Provider', 'PROVIDER');

-- Provider 1 offers General Consultation + Physiotherapy Session; provider 2 offers General
-- Consultation too (so a shared date shows both providers stacked — FR-3).
INSERT INTO user_services (user_id, service_id)
SELECT u.id, s.id FROM users u, services s
WHERE u.email = 'demo.provider@bookit.test' AND s.name IN ('General Consultation', 'Physiotherapy Session');

INSERT INTO user_services (user_id, service_id)
SELECT u.id, s.id FROM users u, services s
WHERE u.email = 'demo.provider2@bookit.test' AND s.name = 'General Consultation';

-- Provider 1 slots — varied counts across the next week to exercise every pressure level
-- (high >=4, medium =3, low 1-2, none =0; CLAUDE.md §B.4). today+4 is deliberately empty.
INSERT INTO availability_slots (provider_user_id, slot_date, start_time, end_time, status)
SELECT u.id, CURRENT_DATE + 1, t.start_time, t.start_time + INTERVAL '30 minutes', 'AVAILABLE'
FROM users u, (VALUES (TIME '09:00'), (TIME '10:00'), (TIME '11:00'), (TIME '13:00'), (TIME '14:00')) AS t(start_time)
WHERE u.email = 'demo.provider@bookit.test';

INSERT INTO availability_slots (provider_user_id, slot_date, start_time, end_time, status)
SELECT u.id, CURRENT_DATE + 2, t.start_time, t.start_time + INTERVAL '30 minutes', 'AVAILABLE'
FROM users u, (VALUES (TIME '09:30'), (TIME '11:00'), (TIME '15:00')) AS t(start_time)
WHERE u.email = 'demo.provider@bookit.test';

INSERT INTO availability_slots (provider_user_id, slot_date, start_time, end_time, status)
SELECT u.id, CURRENT_DATE + 3, t.start_time, t.start_time + INTERVAL '30 minutes', 'AVAILABLE'
FROM users u, (VALUES (TIME '10:00'), (TIME '16:00')) AS t(start_time)
WHERE u.email = 'demo.provider@bookit.test';

INSERT INTO availability_slots (provider_user_id, slot_date, start_time, end_time, status)
SELECT u.id, CURRENT_DATE + 5, t.start_time, t.start_time + INTERVAL '30 minutes', 'AVAILABLE'
FROM users u, (VALUES (TIME '09:00'), (TIME '10:00'), (TIME '11:00'), (TIME '12:00')) AS t(start_time)
WHERE u.email = 'demo.provider@bookit.test';

INSERT INTO availability_slots (provider_user_id, slot_date, start_time, end_time, status)
SELECT u.id, CURRENT_DATE + 6, t.start_time, t.start_time + INTERVAL '30 minutes', 'AVAILABLE'
FROM users u, (VALUES (TIME '14:00')) AS t(start_time)
WHERE u.email = 'demo.provider@bookit.test';

-- Provider 2 slots — overlaps provider 1 on today+1 so that date shows two stacked providers.
INSERT INTO availability_slots (provider_user_id, slot_date, start_time, end_time, status)
SELECT u.id, CURRENT_DATE + 1, t.start_time, t.start_time + INTERVAL '30 minutes', 'AVAILABLE'
FROM users u, (VALUES (TIME '09:30'), (TIME '13:30')) AS t(start_time)
WHERE u.email = 'demo.provider2@bookit.test';

INSERT INTO availability_slots (provider_user_id, slot_date, start_time, end_time, status)
SELECT u.id, CURRENT_DATE + 3, t.start_time, t.start_time + INTERVAL '30 minutes', 'AVAILABLE'
FROM users u, (VALUES (TIME '09:00')) AS t(start_time)
WHERE u.email = 'demo.provider2@bookit.test';
