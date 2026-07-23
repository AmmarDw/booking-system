# Implementation Plan — Booking & Appointment Management System

> **Coding-level plan.** Directs Claude with requirements → acceptance criteria in build order. **Run Claude in plan mode** before executing each milestone. The 6-day narrative plan lives in `PROJECT_REPORT.md` §13; domain rules in `CLAUDE.md` §B; requirements (FR/NFR) in `PROJECT_REPORT.md` §4; ERD in §7 + `diagrams/erd.drawio`; design prompts/screens in §6.

## How to use
1. Pick the next unchecked milestone. 2. Ask Claude to **enter plan mode** for it. 3. Approve, build, test against the milestone's acceptance criteria. 4. Use **context7** for current library docs (Spring Boot 4, Next.js 14, jjwt, google-api-services-calendar). 5. Commit at each milestone checkpoint.
Each task is tagged **[You]** (manual) or **[Claude]** (coded). Design reaches the repo via **DesignSync** (`/design-sync`).

---

## Architecture Decisions (read before M1)

### Backend — feature-based packaging under `com.ammar.bookingsystem`
```
config/        SecurityConfig, CorsConfig, WebConfig, GlobalExceptionHandler (@RestControllerAdvice), AppSettingsCache
security/      JwtService, JwtAuthenticationFilter, AppUserDetailsService, CurrentUser helper
user/          User(entity), Role(enum), UserRepository, UserService, UserController(admin), dto/
service/       Service(entity), ServiceRepository, ServiceService, ServiceController, dto/    (services domain)
availability/  AvailabilitySlot(entity), SlotStatus(enum), AvailabilitySlotRepository, AvailabilityService, AvailabilityController, BulkGenerateRequest
booking/       Booking(entity), BookingStatus(enum), BookingRepository, BookingService, BookingController, dto/
google/        GoogleAccountConnection(entity), GoogleOAuthController, GoogleCalendarService, TokenCipher
settings/      AppSettings(entity), AppSettingsRepository, SettingsService, SettingsController
email/         EmailService (Gmail SMTP)
auth/          AuthController (register/login/me), dto (RegisterRequest, LoginRequest, AuthResponse)
common/        base dto, ApiError
```
Layering per feature: `entity → repository → service → controller`, DTOs at the boundary (manual mapping — no MapStruct for MVP).

### Auth — stateless JWT (Bearer)
- Deps to add (M2): `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` (runtime). Verify current version via context7.
- `SecurityConfig`: stateless session policy, `BCryptPasswordEncoder`, register `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`, `@EnableMethodSecurity`.
- `JwtService`: sign/verify HS256 with secret from env `JWT_SECRET`; claims = subject(email) + role; expiry (e.g. 24h).
- Endpoints: `POST /api/auth/register` → creates **CONSUMER only** (ignore any role in body, FR-16) → returns token; `POST /api/auth/login` → `{token, role, email}`; `GET /api/auth/me` → current user.
- Role rules via `@PreAuthorize("hasRole('ADMIN')")` etc. (FR-12).

### API conventions
- All endpoints under `/api/**`. **Public:** `/api/auth/**`, `GET /api/services`, `GET /api/services/{id}`, `GET /api/services/{id}/availability?date=…` (browse). **Secured (role):** everything else.
- `GlobalExceptionHandler` → consistent JSON `ApiError { timestamp, status, error, message, path }`; validation errors → 400 with field details.
- Secrets/config already env-driven (`.env` via spring-dotenv). Add `JWT_SECRET`, `APP_CORS_ORIGINS` to `.env`/`.env.example` at M2.

### CORS
- `CorsConfig`: allow `${APP_CORS_ORIGINS:http://localhost:3000}`, methods GET/POST/PUT/PATCH/DELETE, headers incl. `Authorization`. (No credentials needed — token is in the header, not a cookie.)

### Frontend — Next.js 14 App Router (`app/frontend`)
- `src/lib/api.ts` — fetch wrapper: base `NEXT_PUBLIC_API_URL`, injects `Authorization: Bearer` from the token store, throws typed errors.
- `src/lib/auth.tsx` — token store (memory + `localStorage` hydrate) + `AuthProvider`/`useAuth`; role helpers; redirect-back support (FR-2 — preserve `?redirect=`).
- `src/components/ds/*` — design-system components (from DesignSync). Tailwind consumes the design tokens.
- i18n baseline per `C:\Users\ammar\.claude\rules\i18n-directionality.md` (server-rendered `dir`/`lang`, logical properties). Full Arabic dictionary deferred; structure ready.
- Route groups: public (`/`, `/sign-in`, `/sign-up`, `/book`, `/book/[serviceId]`) and `/dashboard/*` (guarded by role).

---

## Manual steps (you do these)

| # | Step | Status |
|---|------|--------|
| U1 | Backend generated at start.spring.io (Spring Boot 4.1.0, Java 21) + Google libs in `pom.xml` | ✅ |
| U2 | GitHub repo `booking-system` (private, monorepo `app/backend`+`app/frontend`) — first push pending at M0 | ⏳ push |
| U3 | PostgreSQL: native PG16 on `localhost:5432`, DB `booking_system`, user `bookingadmin` | ✅ |
| U4 | Google Cloud: project, Calendar API, OAuth consent (External, `calendar.events`, test users), Web OAuth client, redirect `http://localhost:8080/api/google/oauth2/callback` | ✅ |
| U5 | Gmail app password (SMTP) | ✅ |
| U6 | Secrets in `app/backend/.env` (DB, Google id/secret, Gmail) — git-ignored; `JWT_SECRET`/`APP_CORS_ORIGINS` added at M2 | ✅ (JWT pending) |
| U7 | Claude Design **BookIt Design System** project + DesignSync authorized | ✅ |

> **IntelliJ run gotcha:** set the run config **Working directory = `app/backend`** so spring-dotenv finds `.env` (else `DB_PASSWORD` empty → SCRAM + dialect errors).

---

## Build order

### M0 — Environment & scaffold (Day 3)
- [x] Backend wired to Postgres (env datasource) + Flyway (`flyway-core` + `flyway-database-postgresql`), `ddl-auto: validate`.
- [x] Boots cleanly (Flyway runs `V1`/`V2`; Spring Security default active).
- [x] **[Claude]** Frontend scaffold: `create-next-app` (Next.js 16, App Router, TS, Tailwind v4, ESLint, `src/`) in `app/frontend`; added Framer Motion, Embla, Lucide; `.env.local`(`NEXT_PUBLIC_API_URL=http://localhost:8080`) + `.env.local.example`; `lib/api.ts` + `lib/auth.tsx` stubs; layout renders `dir`/`lang` + wraps `AuthProvider`. `npm run build` passes.
- [x] **[Claude]** DesignSync pull: tokens + 11 components (importable `@/components/ds`) + 4 reference screens (`ds/screens-reference/`, reference-only — use Claude Design sandbox globals) into `app/frontend/src/components/ds/`; tokens wired into `globals.css`; DS README added.
- [ ] **[You→Claude]** Root `.gitignore`; **first commit + push** to the repo (U2). *(Next thing to do when execution resumes.)*
- *Acceptance:* backend boots + connects to Postgres ✅; `npm run build` passes ✅; DS components import cleanly ✅.

> **Next.js version:** create-next-app installed **Next 16 / React 19 / Tailwind v4** (not the "14" the docs first assumed). `app/frontend/AGENTS.md` warns this Next.js differs from training data — **check `node_modules/next/dist/docs/` before writing page code.**

### M1 — Data model: JPA entities (Day 3)
- [x] Schema via Flyway: `V1__init_schema.sql` + `V2__seed_app_settings.sql` (all 8 tables; ERD §7 / `diagrams/erd.drawio`).
- [x] **[Claude]** Entities + enums + repositories, one per table, **matching `V1` exactly** (`validate` fails on drift):
  - `User` (`id, email(unique), passwordHash, fullName, role, createdAt`) + `Role{CONSUMER,PROVIDER,ADMIN}`; `Service` (`id, name, description, durationMinutes`); provider↔service `@ManyToMany` via `user_services`; `AvailabilitySlot` (`id, providerUser(FK), slotDate, startTime, endTime, status`) + `SlotStatus{AVAILABLE,BOOKED}`; `Booking` (`id, consumerUser(FK), slot(FK), service(FK), status, createdAt`) + `BookingStatus{CONFIRMED,CANCELLED}`; `MeetingLink` (`id, booking(FK,unique), url, provider`); `GoogleAccountConnection` (`id, user(FK,unique), googleEmail, refreshTokenEnc, scope, connectedAt, fallbackMeetUrl`); `AppSettings` (`id, maxBookingHorizonMonths`).
  - `@Enumerated(EnumType.STRING)`; map DB snake_case (`@Column`/naming strategy) to camelCase fields.
  - Spring Data repositories per entity + the derived queries M4/M5 need (e.g. slots by provider+date; bookings by filters).
  - **Note:** entity named `Service` (matches domain/ERD) shares a name with `@org.springframework.stereotype.Service` — the future `ServiceService` business class (M3) must fully-qualify that annotation.
- *Acceptance:* app boots with `validate` passing (entities match schema) ✅ — `Started BookingSystemApplication` with no schema errors, Flyway created all 9 tables (8 + `flyway_schema_history`) on a fresh DB.

> **Real Spring Boot 4 breaking change found & fixed:** `flyway-core` + `flyway-database-postgresql` alone do **NOT** trigger Flyway anymore — Boot 4 moved `FlywayAutoConfiguration` into its own module, **`spring-boot-flyway`**, only pulled in via **`spring-boot-starter-flyway`** (confirmed via context7 against the Spring Boot `v4.1.0` source). Without it, Flyway silently never ran — the DB stayed empty with zero errors until M1 added entities and `ddl-auto: validate` finally surfaced "missing table" errors. `pom.xml` fixed: swapped bare `flyway-core` for `spring-boot-starter-flyway` (keeping `flyway-database-postgresql` explicit, since it's `optional` inside that module).

### M2 — Auth + security (Day 3) ✅ done, browser-tested
- [x] **[Claude]** Added `jjwt-api/impl/jackson` (0.13.0, verified via context7); `JWT_SECRET` (generated), `APP_CORS_ORIGINS` → `.env`/`.env.example`/`application.yaml`.
- [x] **[Claude]** `SecurityConfig` (stateless, BCrypt encoder, JWT filter, method security, hand-written JSON 401/403 entry points) + `CorsConfig` + `AppUserDetailsService`/`UserPrincipal` + `JwtService`/`JwtAuthenticationFilter` + `GlobalExceptionHandler` (+`ApiError`).
- [x] **[Claude]** `AuthController`: `register` (→ CONSUMER only, FR-16 — `RegisterRequest` has no role field at all), `login`, `me`; DTOs + validation.
- [x] **[Claude]** Frontend: `/sign-in`, `/sign-up` pages (DS `Card`/`Input`/`Button`), `lib/api` + `lib/auth` (login/register/me + localStorage token), redirect-back via `?redirect=` (FR-2).
- *Acceptance:* ✅ all verified live (curl + chrome-devtools browser test): register→login→me round-trips a Bearer token; a body-crafted `role:"ADMIN"` on register still yields CONSUMER (FR-16); `/me` without/invalid token → 401; unmapped route → 404; sign-up → sign-in with `?redirect=/book` → lands on `/book` after login (FR-2).

> **Three real bugs found & fixed while building M2** (all confirmed via live testing, not just code review):
> 1. **jjwt 0.13.0 API drift:** context7's own snippet showed `Jwts.parserBuilder()`, which doesn't exist in this version — IDE caught it immediately; fixed to `Jwts.parser()...parseSignedClaims()`.
> 2. **Jackson 3 relocation (Spring Boot 4):** `com.fasterxml.jackson.databind.ObjectMapper` → `NoClassDefFoundError` at runtime because this stack's Jackson is `tools.jackson.*` (seen transitively via Flyway's own Jackson dependency). Fixed by not depending on Jackson at all in `SecurityConfig`'s hand-rolled 401/403 JSON writer — simpler and avoids the version question entirely.
> 3. **Own logic bug:** `.requestMatchers("/api/auth/**").permitAll()` accidentally also permitted `/api/auth/me`, so anonymous requests reached the controller instead of getting a clean 401 (surfaced as an opaque 500 from `CurrentUser.get()`, which is also why a bare `@ExceptionHandler(Exception.class)` with no logging is dangerous — added `log.error(...)` there so this class of bug can never hide silently again). Fixed the matcher to name `/register` and `/login` explicitly.

### M3 — Service browsing + landing (Day 4) ✅ done, browser-tested
- [x] **[Claude]** Backend: `GET /api/services`, `GET /api/services/{id}` (public, 404 on missing id); admin CRUD deferred to M5. Seeded 4 demo services (`V3__seed_demo_services.sql` — bootcamp rule: demo data only).
- [x] **[Claude]** Frontend: landing `/` (Hero → How-it-works → live Services preview (top 3, server-fetched, `force-dynamic` so it never bakes stale data at build time) → FAQ `Accordion` → Footer, no social proof); `/book` list (client component, all 4 services, `Card` + `Button`); "Book" gates on auth via `useAuth()` → `/sign-in?redirect=/book/{id}` when logged out, else `/book/{id}` directly (M4 builds that target page).
- *Acceptance:* ✅ browser-verified (chrome-devtools): landing renders live service data + interactive FAQ; `/book` lists all 4 services; **logged-out "Book" click confirmed redirecting to `/sign-in?redirect=/book/3`** (FR-1 + FR-2 both pass end-to-end, not just via curl).

> **Real bug found & fixed:** `Accordion.jsx` (design-system component) calls `React.useState` internally but had no `"use client"` directive. Rendering it from the landing page's Server Component tree threw `useState is not a function` at build time — Server Components can't use hooks. Fixed by adding `"use client"` to `Accordion.jsx` itself (the correct architectural fix: it's inherently an interactive component, not a page-level workaround). Checked the rest of the design-system components — none of the others use hooks internally, so this was isolated to `Accordion`.

### M4 — Core booking journey (Day 4) — dedicated page `/book/[serviceId]` ✅ done, browser-tested
- [x] **[Claude]** Backend: `GET /api/services/{id}/availability/month?yearMonth=` (per-day available/total, `availability/AvailabilityService`) + `GET /api/services/{id}/availability/day?date=` (providers grouped, only those with ≥1 slot that day). `GET /api/settings/booking-window` (public) exposes the horizon so the frontend can bound navigation. `config/AppSettingsCache` caches `AppSettings.maxBookingHorizonMonths` in memory.
- [x] **[Claude]** Backend: `POST /api/bookings` (`booking/BookingService`, `@Transactional`) — `SELECT ... FOR UPDATE` locks the slot (`findByIdForUpdate`), validates `AVAILABLE` + within `[today, today+horizon]` + provider actually offers the service, then sets `BOOKED` and creates the `Booking`. Reserves across the provider's other services since the slot belongs to the provider, not the service (FR-4).
- [x] **[Claude]** Seeded 2 demo providers + a week of varied-pressure availability (`V4__seed_demo_provider_and_slots.sql`) — needed because M5 (the real way to create providers) doesn't exist yet; bcrypt hashes extracted from real registrations through the app's own encoder, not hand-computed.
- [x] **[Claude]** Frontend `/book/[serviceId]`: calendar grid with `available/total` badges + pressure colors (extended `CalendarDayCell` with an optional `total` prop for this — a deliberate, backward-compatible design-system extension, documented); shadow only 0-available/out-of-window days; month-dropdown navigation bounded to `[today, today+horizon]` (a simpler stand-in for the spec'd year-picker + 12-month-grid — same functional guarantee, noted as a scope simplification); stacked provider `Accordion`; disabled→primary "Book appointment" button; success toast using the exact §B.5 text pattern, auto-refreshes month/day views after booking.
- *Acceptance:* ✅ verified via curl (double-book same slot → 409, even under a different service — proves the reservation is provider-wide not service-specific per FR-4; unauthenticated → 401; bad service → 404) **and** a full browser walkthrough (chrome-devtools): signed in → `/book/1` → selected a day → selected a slot → booked → toast showed the exact required text → month view live-updated `3/3→2/3` → day view showed the slot as `(booked)`.

### M5 — Dashboard + management (Day 4) — shared UI (provider + admin)
- [ ] **[Claude]** Backend: appointments list with filters (service/status; **admin** provider filter) (FR-10/11); availability CRUD + **bulk generate** (weekdays × date range × time ranges, range bound to advance limit `ceil(horizon×1.5)`, chosen weekdays only) (FR-7); services CRUD + provider assignment (FR-8); **users CRUD + create-provider/promote** (FR-8/FR-16); `GET/PUT /api/settings` for `maxBookingHorizonMonths` (refresh cache) (FR-14). All role-guarded (FR-12); providers scoped to own data.
- [ ] **[Claude]** Frontend: `/dashboard` (calendar+list, filters, admin provider filter — from `BookingsScreen`), `/dashboard/availability` (bulk generator), `/dashboard/services`, `/dashboard/users`, plus the provider Connect-Google entry (screen built in M6).
- *Acceptance:* FR-7/8/10/11/12/14/16 pass; provider can't see others' data; non-admins blocked from admin actions.

### M6 — Integrations (Day 5)
- [ ] **[Claude]** `spring.mail` config (Gmail **465 → `mail.smtp.ssl.enable=true`**, creds from `EMAIL_*`); `EmailService` sends confirmation (service, date, time, meeting link) (FR-5).
- [ ] **[Claude]** Google onboarding (FR-13): `GET /api/google/oauth2/authorize` (redirect to consent) + `GET /api/google/oauth2/callback` (exchange code, store **encrypted** refresh token via `TokenCipher` using `TOKEN_ENCRYPTION_KEY`); disconnect; fallback paste-a-link; provider not bookable until connected or fallback set. `/dashboard/connect-google` screen (states: not-connected/connected/banner).
- [ ] **[Claude]** Meet link on booking (FR-6): use the **provider's** token → Calendar `events.insert` (`conferenceDataVersion=1`, `conferenceData.createRequest`, `hangoutsMeet`, `attendees=[consumer,provider]`, `sendUpdates=all`) → store `hangoutLink` in `MeetingLink`. Booking still succeeds + email sent without link if this fails (NFR-4). Use context7 for `google-api-services-calendar`.
- *Acceptance:* provider connects once; booking creates the event on their calendar, both invited, working Meet link in the email; SCRAM/keys not committed (NFR-3).

### M7 — Testing, security, perf (Day 5)
- [ ] **[Claude/You]** Manual happy + error paths (chrome-devtools MCP); security review (try consumer→admin routes/actions, provider→others' data — confirm blocked, FR-12); calendar month render < 2s (NFR-1); UX polish.

### M8 — Deploy (Day 6)
- [ ] **[You→Claude]** Frontend → Vercel; backend + Postgres → a production host; set prod env vars, `APP_CORS_ORIGINS`, and add the prod Google redirect URI. Live URL; short user guide; future-development plan.

---

## Testing strategy
- Backend: a few focused `@SpringBootTest`/slice tests for the security guard (FR-16), booking transaction (FR-4), and window validation (FR-15). Manual API checks via REST client for the rest.
- Frontend: manual + chrome-devtools MCP for the core journeys; rely on TypeScript + the design system for consistency.

## Commit checkpoints
Commit at the end of each milestone (`M0: scaffold`, `M1: entities`, …). Push to `booking-system` (U2). Never commit `.env` (NFR-3).
