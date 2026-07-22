-- Core schema per PROJECT_REPORT.md §7 (ERD). One `users` table with a role column — no separate provider entity.

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255),
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('CONSUMER', 'PROVIDER', 'ADMIN')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE services (
    id                BIGSERIAL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    description       TEXT,
    duration_minutes  INT NOT NULL CHECK (duration_minutes > 0)
);

-- Which services a provider (users.role = PROVIDER) offers (N:M).
CREATE TABLE user_services (
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, service_id)
);

-- Bound to the provider, not to a service (booking one service reserves it across all that provider's services).
CREATE TABLE availability_slots (
    id                BIGSERIAL PRIMARY KEY,
    provider_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_date         DATE NOT NULL,
    start_time        TIME NOT NULL,
    end_time          TIME NOT NULL,
    status            VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BOOKED')),
    CONSTRAINT uq_provider_slot UNIQUE (provider_user_id, slot_date, start_time),
    CONSTRAINT chk_slot_time_order CHECK (end_time > start_time)
);

CREATE TABLE bookings (
    id                BIGSERIAL PRIMARY KEY,
    consumer_user_id  BIGINT NOT NULL REFERENCES users(id),
    slot_id           BIGINT NOT NULL REFERENCES availability_slots(id),
    service_id        BIGINT NOT NULL REFERENCES services(id),
    status            VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE meeting_links (
    id          BIGSERIAL PRIMARY KEY,
    booking_id  BIGINT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    url         VARCHAR(500) NOT NULL,
    provider    VARCHAR(50) NOT NULL DEFAULT 'GOOGLE_MEET'
);

-- Per-provider Google OAuth connection powering Meet-link creation (FR-13).
CREATE TABLE google_account_connections (
    id                 BIGSERIAL PRIMARY KEY,
    user_id            BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    google_email       VARCHAR(255),
    refresh_token_enc  TEXT,
    scope              VARCHAR(255),
    connected_at       TIMESTAMPTZ,
    fallback_meet_url  VARCHAR(500)
);

-- Single-row settings table (FR-14/FR-15). Default seeded in V2 from application.yaml's booking.max-horizon-months.
CREATE TABLE app_settings (
    id                          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    max_booking_horizon_months  INT NOT NULL DEFAULT 6 CHECK (max_booking_horizon_months > 0)
);
