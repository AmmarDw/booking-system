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

### M5 — Dashboard + management (Day 4) — shared UI (provider + admin) ✅ done, browser-tested
- [x] **[Claude]** Backend: `GET /api/bookings` appointments list with filters (service/status; **admin** provider filter, `AppointmentQueryService`) (FR-10/11); `AvailabilityManagementController`/`Service` — bulk generate (weekdays × date range × time ranges, bound to advance limit `ceil(horizon×1.5)` via `AppSettingsCache.getAdvanceLimitMonths()`, chosen weekdays only, idempotent re-run skips existing) + list + delete (own only, or admin any; blocks deleting a `BOOKED` slot) (FR-7); `ServiceController` CRUD + `PUT /{id}/providers` provider assignment (FR-8); `UserController` CRUD + create-provider/promote via role change (FR-8/FR-16, self-delete blocked, delete-with-dependencies → 409); `GET/PUT /api/settings/booking-window` (PUT admin-only, refreshes `AppSettingsCache`) (FR-14). All role-guarded via `@PreAuthorize` (FR-12); providers scoped to own data everywhere.
- [x] **[Claude]** Seeded a demo admin (`V5__seed_demo_admin.sql`) — bootstrapping requirement, since only an admin can create/promote users and none existed yet.
- [x] **[Claude]** Frontend: `NavBar` (new, app-level — needed since nothing linked to the new dashboard pages) with role-aware links; `/dashboard` layout (RBAC gate + sub-nav, admin-only tabs hidden for providers) + `/dashboard` (appointments + filters), `/dashboard/availability` (bulk generator + slot list/delete), `/dashboard/services` (admin CRUD + provider-assignment checklist), `/dashboard/users` (admin CRUD + promote, search/role filter). Provider Connect-Google entry deferred to M6 (page doesn't exist yet).
- *Acceptance:* ✅ verified via curl (full RBAC matrix: 403s, ownership guards, advance-limit math, idempotent bulk-generate, delete guards) **and** a full browser walkthrough (chrome-devtools) as both admin and provider: promote a consumer to provider, assign a provider to a service, bulk-generate + delete availability, admin sees all appointments + provider filter, provider's dashboard nav/data correctly reduced to their own.

> **Four real bugs found & fixed this milestone** (all via live testing):
> 1. **`@PreAuthorize` denials → 500, not 403.** Method-security `AccessDeniedException` is thrown *inside* the MVC handler invocation, so — unlike an unauthenticated request — it never reaches `SecurityConfig`'s filter-level `accessDeniedHandler`; it fell into the blanket `@ExceptionHandler(Exception.class)` instead. Fixed with a dedicated `@ExceptionHandler(AccessDeniedException.class)` → 403.
> 2. **Stale entity from Hibernate's first-level cache.** `Service.getProviders()` is the *inverse* side of the `@ManyToMany` (owned by `User.services`); after updating the owning side and re-fetching the `Service` by ID in the same persistence context, Hibernate returned the *same already-loaded instance* with its lazily-materialized (now stale) `providers` collection — the PUT response showed empty providers even though the DB was correct. Fixed by building the response from the already-known new set instead of re-querying.
> 3. **Native locale-dependent inputs.** `<input type="number">` rendered Arabic-Indic digits ("٣٠" instead of "30") and `<input type="date"/"time">` rendered Arabic day/month/hour labels on this test machine's OS locale. Fixed by converting all of them to plain `type="text"` with format placeholders + regex validation — deliberately, since this project has explicit RTL/Arabic i18n plans and native-picker locale dependence is a real risk, not just cosmetic.
> 4. **`void`-returning `@DeleteMapping` → 200 + empty body, not 204.** The frontend's `api()` helper only special-cased `204` before calling `res.json()`, which throws on an empty body — a successful delete surfaced as a UI error. Fixed both ends: backend delete endpoints now consistently return `ResponseEntity.noContent()` (204), and `api()` now checks response text before parsing JSON regardless of status, so this class of bug can't recur with a future endpoint.

### M6 — Integrations (Day 5) ✅ done, browser-tested (up to the manual Google-consent boundary)
- [x] **[Claude]** `spring.mail` config (Gmail **465 → `mail.smtp.ssl.enable=true`**, creds from `EMAIL_*`); `EmailService` sends confirmation (service, date, time, meeting link) (FR-5). Never throws — logs and swallows so a mail failure can't break a successful booking.
- [x] **[Claude]** Google onboarding (FR-13): `GET /api/google/oauth2/authorize` (`@PreAuthorize("hasRole('PROVIDER')")`, builds the consent URL with a signed, purpose-tagged, 10-minute `state` JWT carrying the provider's id — needed because Google's callback is a plain browser redirect with no `Authorization` header) + `GET /api/google/oauth2/callback` (public in `SecurityConfig`; exchanges the code, stores the refresh token **encrypted** via `TokenCipher`/AES-256-GCM using `TOKEN_ENCRYPTION_KEY`, fetches the connected email); `DELETE /connection` disconnect; `PUT /fallback-link` paste-a-link; `GET /connection` status. Provider not bookable until connected **or** fallback set (enforced in `BookingService`, not just the UI). `/dashboard/connect-google` screen (not-connected / connected / a dashboard-wide banner for providers with neither), plus a role-gated "Connect Google" nav entry.
- [x] **[Claude]** Meet link on booking (FR-6): `GoogleCalendarService.createMeetingEvent` uses the **provider's** decrypted refresh token → Calendar `events.insert` (`conferenceDataVersion=1`, `conferenceData.createRequest`, `hangoutsMeet`, `attendees=[consumer,provider]`, `sendUpdates=all`) → returns the `hangoutLink`, stored in `MeetingLink`. Falls back to the provider's pasted link if not connected; booking still succeeds + email still sends without a link if generation fails either way (NFR-4 graceful degradation — `GoogleCalendarService`/`EmailService` never throw). Verified via context7 for `google-api-services-calendar`/`google-oauth-client` shapes.
- [x] **[Claude]** `V6__seed_demo_provider_fallback_links.sql` — gives the two M4 demo providers a fallback Meet link so the new "not bookable" gate doesn't regress the already-verified M4 booking flow for them.
- *Acceptance:* ✅ verified via curl end-to-end up to the point a real human must click "Allow" on Google's own consent screen (that step was deliberately left manual — it requires the user's real Google identity): authorize URL shape + signed state; callback error paths (invalid/garbage state → graceful redirect, not 500); the not-bookable gate (400 with no connection/fallback, succeeds once a fallback is set); a full booking against a fallback-link provider persisted a `MeetingLink` row and sent a real confirmation email via the real Gmail credentials in `.env` (no error logged). Browser-verified (chrome-devtools) the `/dashboard/connect-google` page in all three states and confirmed "Connect Google Calendar" redirects to a correctly-formed real Google consent screen.

> **Real bug found & fixed:** the callback controller declared `code`/`state` as required `@RequestParam`s. Google's *most common* non-happy-path — the provider clicking "Cancel" on the consent screen — redirects back with `error=access_denied` and **no `code` param at all**, which threw `MissingServletRequestParameterException` uncaught → a raw 500 JSON error page in the browser instead of a graceful bounce back to the dashboard. Fixed by making `code`/`state` optional and checking for a Google-supplied `error` param first, redirecting to `?error=consent_denied` before ever calling into the token exchange.

### M6.1 — Post-M6 enhancement: provider notification email, consumer appointments view, appointment details modal ✅ done, browser-tested
- [x] **[Claude]** Backend: `EmailService.sendProviderBookingNotification` — a second confirmation email (consumer name, service, date, time, meeting link) sent to the **provider** on every booking, alongside the existing consumer confirmation (FR-5 extension). Never throws, same NFR-4 pattern.
- [x] **[Claude]** Backend: `AppointmentSummary` gained a `meetingLink` field; `AppointmentQueryService` gained a **consumer** scope (own bookings only, `providerId`/other filters can't escape it) alongside the existing provider/admin scoping; `GET /api/bookings` opened to `CONSUMER` role (still fully scoped server-side).
- [x] **[Claude]** Frontend: new consumer-only `/appointments` ("My Appointments") page, gated to `CONSUMER` (redirects providers/admins to `/dashboard`), plus a nav entry visible only to consumers. Design-system `Table` extended with an optional `onRowClick` and `Modal` with an optional `hideActions` (both backward-compatible, same pattern as earlier DS extensions) so a new shared `AppointmentDetailsModal` component — used by both the consumer appointments page and the existing provider/admin dashboard table — can show full appointment details (service, date, time, consumer, provider, status, and critically the **meeting link**) on row click.
- *Acceptance:* ✅ curl-verified consumer scoping (own bookings only, filter params can't leak others') and the provider notification email sending with no error logged. Browser-verified (chrome-devtools): consumer sees only their own 3 bookings at `/appointments` with a working nav link; clicking a row on both the consumer page and the provider dashboard opens the same details modal with a clickable meeting link; a provider hitting `/appointments` directly is redirected to `/dashboard`.

### M6.2 — Post-M6 fixes: post-booking redirect, richer emails, loading overlay, self-booking prevention ✅ done, browser-tested
- [x] **[Claude]** Backend: both booking emails enriched — the consumer confirmation now names the provider (name + email), the provider notification now includes the consumer's email (name already existed).
- [x] **[Claude]** Backend: a provider can no longer book their own availability. Blocked in `BookingService.createBooking` (`slot.providerUser.id == consumerUserId` → 400) *before* touching the DB — not just filtered client-side — plus the equivalent frontend filter (a provider's own entry never appears in the day-view provider list at `/book/[serviceId]`). Providers/admins **can** still book other providers' services as a consumer.
- [x] **[Claude]** Backend: `AuthResponse` (register/login/me) now includes the user's `id`, needed client-side to detect "is this row's consumer me". `AppointmentSummary` gained `consumerId`. A provider's own dashboard (`GET /api/bookings`) now merges in any bookings *they* made as a consumer elsewhere, alongside their normal provider-scoped rows (admin's dashboard already saw everything, no query change needed there) — chosen over keeping those bookings solely on `/appointments`, since mixing them into the dashboard is what makes a "(You)" marker meaningful (every row on `/appointments` is already self, so it'd be redundant there). `GET /api/bookings?mine=true` is a new explicit path (any role) that always returns just the caller's own bookings-as-consumer, powering `/appointments`.
- [x] **[Claude]** Frontend: booking now redirects to `/appointments` (all roles) instead of showing an in-place toast — the confirmation toast (same §B.5 text) travels across the redirect via query params, then the URL is cleared via `router.replace` so a refresh doesn't re-show it. New `LoadingOverlay` component (full-page blur + spinner, content stays visible underneath, never disappears) shown for the duration of the booking request — covers the real latency of the synchronous Google Calendar + email round-trip server-side. Dashboard's consumer column bolds+colors the name and appends "(You)" when `consumerId` matches the signed-in user. "My Appointments" nav link now shows for every role, not just consumers.
- *Acceptance:* ✅ curl-verified self-booking rejection (400) and that booking another provider's service as a provider still succeeds and appears in both the merged dashboard (marked via `consumerId`) and `?mine=true`. Browser-verified (chrome-devtools, network-throttled to actually see it): the loading overlay renders mid-request; a provider booking their own service's day view shows zero options ("No appointments for this date"); a provider's dashboard shows "Dr. Demo Provider (You)" in bold teal on their own cross-provider booking; both a provider and a plain consumer land on `/appointments` with the correct confirmation toast after booking, which clears from the URL on refresh.

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
