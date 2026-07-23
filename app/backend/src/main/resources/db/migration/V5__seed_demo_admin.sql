-- Demo admin (bootcamp rule: demo data only). Bootstrapping need: public registration always
-- creates CONSUMER (FR-16), and only an admin can promote/create PROVIDER or ADMIN users — so at
-- least one admin must exist before the admin Users screen can be used at all. Password is
-- "password123", hash extracted from a real registration through the app's own encoder.
INSERT INTO users (email, password_hash, full_name, role) VALUES
    ('admin@bookit.test', '$2a$10$OSzFrhjuUwDRRpNAgpIp8OY4Zl9UIu4rTNkRt61Gd8aU3gHe.INNK', 'Admin', 'ADMIN');
