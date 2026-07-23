-- Demo services (bootcamp golden rule: demo data only, never real/sensitive data).
-- Provider assignment (user_services) happens later via the admin Services-management screen (M5).
INSERT INTO services (name, description, duration_minutes) VALUES
    ('General Consultation', 'A general appointment to discuss your needs and next steps.', 30),
    ('Dental Checkup', 'Routine dental examination and cleaning.', 30),
    ('Physiotherapy Session', 'One-on-one physiotherapy and rehabilitation session.', 45),
    ('Dermatology Consultation', 'Skin assessment and consultation with a dermatologist.', 20);
