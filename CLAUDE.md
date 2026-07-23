# CLAUDE.md — Booking & Appointment Management System

Project memory for Claude. Read this before working. It has two parts: **(A)** how we run this bootcamp project & its docs, and **(B)** the booking system's domain logic.

---

## A. Project & Documentation Conventions

### A.1 Context protocol
- `conversation_history.md` is the **single source of truth**. All prompts and full responses live there; the chat stays a minimal pointer. Read it before responding. Reformat raw prompts into clean Markdown (no content removed) and write structured `## § N — Response to Prompt #M` sections ending with `---` + an empty next-prompt header.
- When the user says **"no need to write to conversation_history.md"**, answer in chat directly. Otherwise keep chat minimal and put the substance in `conversation_history.md` and referenced docs.

### A.2 Rules in force
- Global: `C:\Users\ammar\.claude\rules\requirements-standards.md` (EARS, flat IDs, Gherkin acceptance criteria).
- Global: `C:\Users\ammar\.claude\rules\i18n-directionality.md` (RTL/LTR + logical properties — *created in Phase 0*).
- Local: `.claude/rules/bootcamp-mvp-process.md` (generic 6-day trainee guide).

### A.3 Documentation stance
- **Audience = beginner–intermediate** bootcamp trainees. Keep docs lightweight and clear. The user's capstone report is a *style reference only* — do **not** approach capstone depth/technicality.
- `PROJECT_REPORT.md` is the single graded report. Per section: brief instructions → template → short generic example → **our actual booking-system data**.
- `implementation_plan.md` = granular coding plan (requirements → acceptance criteria). `research_plan.md` = research spikes. Cross-reference files by full path where created/updated.
- **Most-requested doc section: the Tools Used table** — keep it current.
- Docs in **English**; Arabic translation deferred (mention only in `conversation_history.md`).

### A.4 Working style
- **Repository:** `https://github.com/AmmarDw/booking-system.git` — monorepo (`app/backend` Spring Boot, `app/frontend` Next.js; docs at project root).
- **Plan mode before any coding task.** Review, then execute.
- Use the **context7 MCP** for up-to-date library/framework docs whenever writing code.
- Tools available: context7 (MCP), Claude Design, GitHub (MCP), chrome-devtools (MCP), draw.io (skill), sequential-thinking.
- Timeline: build is compressed (~2 real days) though docs narrate the official 6 days.

---

## B. Booking System Domain Logic

### B.1 Users / roles — **one `User` entity + a `role` field** (no separate Provider entity)
- `CONSUMER` — browses services, books appointments.
- `PROVIDER` — offers one or more services (via `UserService` N:M); owns personal availability (`AvailabilitySlot`s bound to the user). **Self-manages** own availability, including **bulk generation**. Built from the start (not deferred).
- `ADMIN` — full permissions: manage services, all users, all appointments; **bulk-generate availability for any provider**.

### B.2 Core rule: appointments are bound to **provider availability**
- An `AvailabilitySlot` belongs to a **provider (a `User` with role PROVIDER)**, not to a service.
- A provider can offer **multiple services**; booking a provider's slot for one service marks it **reserved across all that provider's services**.
- Consumer booking view: after choosing a service + date, appointments are shown as **stacked provider dropdowns** (each provider = a dropdown; expanding shows that provider's slots for the date; multiple can be open to compare). *(User's chosen option 2 — provider-preferred times.)*

### B.3 Pages
- **Landing page** (public): system info + a user-journey section matching our journey. MVP-appropriate — **no social-proof section**. Sections (from research R3): Hero → How-it-works/journey → Services preview → (optional) FAQ → Footer.
- **Booking page** (public browse): list of services. Browsing is open; **booking prompts sign-in/sign-up**, then **redirects back** to the booking page/flow the user was on.
- **Calendar/slot selection** (auth required): **dedicated page** (e.g. `/book/[serviceId]`), not a modal (research R4 — multi-step flow + shareable URL + clean auth-redirect).
- **Dashboard** (provider + admin — **same UI**): calendar view (month/week/day) + list toggle; appointment cards (service, consumer, time, status); filters by service/status, **admin-only** filter by **provider**. Providers see only their own data; admins see all. **Bulk availability generator** (weekdays × date range × time ranges) available to **both providers (own slots) and admins (any provider)**. Separate Services-management view. (research R2)
- **My Appointments** (consumer, `/appointments`): consumers' own read-only appointments view — no filters, just their bookings scoped server-side (never trust the client). Every appointment row across **all three** appointment tables (this page, and the provider/admin dashboard) is clickable and opens a shared details modal (service, date, time, consumer, provider, status, and the **meeting link**) — the meeting link isn't otherwise shown in the table row itself.

### B.4 Calendar coloring (pressure visualization)
Each day shows **available / total** appointments; color/opacity conveys pressure, derived from the site palette (don't disrupt it):
- **High** = **≥ 4** available → low pressure (green family / lighter).
- **Medium** = **3** available → mid pressure (yellow family).
- **Low** = **1–2** available → about to run out (warm/alert).
- **No available slots** → shadowed "no bookings" style. **Weekends are not special:** a Fri/Sat with provider slots renders normally by its pressure; a weekday with no slots is shadowed. Shadowing is driven purely by slot availability (a provider may choose to work weekends).
Within a selected day, **all** slots render, but **booked slots are styled distinctly (shadowed)** from available ones.
Each day box also shows the **available-out-of-total** appointment count (e.g. `3/8`).

### B.4.1 Booking window & calendar navigation (admin-configurable)
- An **admin sets the max booking horizon** — a duration, default **6 months**. Consumers cannot book a date beyond `today + horizon`, and **past dates are non-selectable and non-navigable**.
- Calendar navigation adapts to the window:
  - **Year picker** lists only the years the window spans — the current year, plus next year **only if** the horizon crosses into it (so 1–2 years max).
  - **Month grid (12 months)** disables/shadows months **before the current month** and months **beyond the horizon**; no navigation into past years.
  - Past days and days beyond the horizon render shadowed (like the "no bookings" style) and are not clickable.
- Enforced in **two places**: the booking calendar UI *and* server-side booking validation. **Storage:** the **default** lives in `application.yaml` (`booking.max-horizon-months: 6`, bound via `@ConfigurationProperties`); the admin's **live value** persists in a **single-row `AppSettings` table** (seeded from the default, cached in memory, refreshed on update) so it survives restarts and applies immediately — no generic key/value table.
- **Two windows:**
  - *Consumers* book within `[today, today + horizon]`; the booking calendar navigation is limited to it.
  - *Providers/admins* may **pre-load availability further ahead**, up to an **advance limit = `ceil(horizon × booking.provider-advance-multiplier)`** (multiplier default **1.5**, yaml-only/not admin-facing → 9 months when horizon = 6). Past dates are never allowed.
  - Server-side validation enforces the **horizon** on consumer booking and the **advance limit** on slot generation. As the window is rolling, pre-loaded slots become bookable as time advances.

### B.5 Booking confirmation UX
- After selecting a slot, the **"Book appointment"** button becomes enabled & colored (disabled-looking before selection).
- On booking: a **success toast** appears in the page corner, auto-dismisses after ~30s, with an **"x"** to close early. Text pattern: `you have successfully booked '<service>' service on '<date>' at '<time>', a confirmation email have been sent`.

### B.6 Integrations
- **Email:** confirmation via **Gmail SMTP** + Gmail app password. Contents: service name, date, time, meeting link. Sent to **both** parties on every booking — the consumer confirmation, plus a separate provider notification (also names the consumer) so the provider knows a new appointment landed on their calendar without having to check the dashboard.
- **Google Meet:** generate meeting links via **Google Calendar API** (`events.insert`, `conferenceDataVersion=1`, `conferenceData.createRequest`, `hangoutsMeet`) under **OAuth2** — feasible on a **free Gmail** (Workspace only needed for Admin SDK path). **Per-provider connection from the start:** each provider connects their own Google account once (scopes `calendar.events` **and** `userinfo.email` — the latter added beyond the original spec so `/dashboard/connect-google` can show which Google account is connected; refresh token stored encrypted). On booking, the event is created on the **provider's** calendar with `attendees=[consumer, provider]` + `sendUpdates=all` → provider is host, invited guests join directly (no manual admit while waiting room off). Custom UI preserved (link is a returned string). Provider not bookable until connected; **fallback** = provider pastes a persistent personal Meet link. **Implemented in M6.** See `GoogleAccountConnection` entity. (research R1)

### B.7 Security (RBAC)
- Spring Security filter chain + method-level authorization; enforce role checks throughout. Baseline pattern: `common_blueprints.md` §1 (RBAC).
- Security review: attempt unauthorized page/action access and confirm it is blocked.

### B.8 Tech stack
- **Backend:** Spring Boot 4.1.0 (Initializr default; docs originally said "3" — see § history), Spring Security, Spring Data JPA, **Flyway** for schema migrations under `app/backend/src/main/resources/db/migration/`, JVM 21. `spring.jpa.hibernate.ddl-auto: validate` — Flyway owns the schema, Hibernate only validates entities match it.
  - **Flyway dependency gotcha (Spring Boot 4):** `FlywayAutoConfiguration` moved into its own module — a bare `flyway-core` + `flyway-database-postgresql` does **NOT** trigger it (fails silently: no error, but Flyway never runs and the DB stays empty). Use **`org.springframework.boot:spring-boot-starter-flyway`** + `org.flywaydb:flyway-database-postgresql` (the latter is `optional` inside the starter, so keep it explicit).
  - Entity package/class named `Service` (`com.ammar.bookingsystem.service.Service`) intentionally matches the domain/ERD. **Convention: business-logic beans use `@Component`, never `@Service`** — any class importing the `Service` entity (regardless of the importing class's own package) can't also import `org.springframework.stereotype.Service` under its simple name, so `@Component` sidesteps the clash everywhere uniformly instead of fully-qualifying case by case.
  - **Jackson 3 relocation (Spring Boot 4):** this stack's Jackson is `tools.jackson.*`, not the classic `com.fasterxml.jackson.*` — importing `com.fasterxml.jackson.databind.ObjectMapper` compiles fine but throws `NoClassDefFoundError` at runtime. Spring MVC's own JSON (de)serialization is unaffected (Boot's autoconfig targets whatever Jackson is actually on the classpath); this only bites if you manually import Jackson yourself. Prefer avoiding a direct Jackson dependency in low-level beans (e.g. security filters) when the payload is simple enough to build by hand.
  - **Auth = JWT Bearer** (`security/` package: `JwtService`, `JwtAuthenticationFilter`, `AppUserDetailsService`, `UserPrincipal`, `CurrentUser`). `SecurityConfig` needs explicit `.exceptionHandling(...)` entry points — without them, an unauthenticated/forbidden request has no `AuthenticationEntryPoint` and surfaces as an opaque 500 instead of 401/403. `/api/auth/register` + `/api/auth/login` are the only public auth routes — never permitAll the whole `/api/auth/**`, since `/me` must require authentication.
  - **`@PreAuthorize` denials need their own `@ExceptionHandler(AccessDeniedException.class)`** in `GlobalExceptionHandler` — that `AccessDeniedException` is thrown *inside* the MVC handler invocation (method-security AOP), so unlike an unauthenticated request it never reaches `SecurityConfig`'s filter-level `accessDeniedHandler`; without the dedicated handler it falls into the blanket `Exception.class` catch-all as an opaque 500 instead of 403.
  - **`void`-returning `@DeleteMapping` methods return `200` + empty body, not `204`.** Always return `ResponseEntity.noContent().build()` explicitly for deletes — an empty-but-200 response breaks naive frontend clients that call `res.json()` unconditionally on success.
  - **Hibernate first-level cache + inverse-side `@ManyToMany` collections:** mutating the owning side (e.g. `User.services`) and then re-fetching the *inverse* side's owner (`Service`) **in the same persistence context** returns the same already-loaded instance with a stale, previously-materialized lazy collection — it does not silently refresh. Build the response from data you already know is correct instead of re-querying when this pattern applies.
  - **Google OAuth callback params must be optional.** Google's own "user clicked Cancel on the consent screen" redirect sends `error=access_denied` with **no `code` param at all** — declaring `code`/`state` as required `@RequestParam`s turns the single most common non-happy-path into an uncaught `MissingServletRequestParameterException` (raw 500 in the browser) instead of a graceful redirect back to the app. Make them `required = false` and check for a Google-supplied `error` param before ever calling into the token exchange.
  - **OAuth `state` as a signed JWT:** since Google's callback is a plain browser redirect carrying no `Authorization` header, the initiating provider's user id travels in a short-lived (10 min), purpose-tagged signed token (`JwtService#generateOAuthState`/`parseOAuthState`) reusing the existing JWT signing key — the only way to know "which provider" a public callback endpoint is for.
  - **`spring.mail` nested properties need bracket-quoted YAML keys:** `mail.smtp.ssl.enable` etc. under `spring.mail.properties` must be written as `"[mail.smtp.ssl.enable]": true`, not nested YAML maps. Gmail SMTP on port 465 is **implicit SSL**, not STARTTLS — `ssl.enable`, not `starttls.enable`, is what actually matters there.
- **Database:** PostgreSQL. **Local dev uses a native Windows PostgreSQL 16 service** (already running on port 5432 from a prior install), not a docker container — decided when U3 hit a port conflict with an existing docker-less local Postgres. DB `booking_system`, user `bookingadmin` (owns the DB → owns `public` schema on PG15+, so Hibernate can create tables without extra grants). Credentials via env vars (`DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`), loaded in dev from `app/backend/.env` (git-ignored) via **spring-dotenv** (`springboot4-dotenv`) — real env vars still take precedence, so this stays safe in production. `.env.example` (committed) holds **placeholders only**, never real values. Production deploy still targets a managed/containerized Postgres.
- **Frontend:** Next.js 16 (App Router; create-next-app default — docs originally said "14"), React 19, TypeScript, Tailwind CSS v4. Scaffolded in `app/frontend` (`src/` layout). Design system (from Claude Design via DesignSync) lives in `src/components/ds/` (importable `@/components/ds`; reference screens in `ds/screens-reference/` are visual references only). Note `app/frontend/AGENTS.md`: this Next.js has breaking changes vs training data — check `node_modules/next/dist/docs/` before writing page code.
  - **DS component client-boundary gotcha:** `Accordion.jsx` uses `React.useState` internally but ships without `"use client"` — rendering it from a Server Component (e.g. the landing page) throws `useState is not a function` at build time. Fixed at the component (`Accordion.jsx` now has `"use client"`). If a newly-pulled DS component uses hooks internally, check for this before using it in a Server Component page.
  - Public pages that fetch DB-backed data (e.g. `/` services preview) should set `export const dynamic = "force-dynamic"` — otherwise Next statically bakes the fetch result in at build time and it goes stale.
  - **Avoid native `<input type="number"/"date"/"time">` for anything visible.** Chromium renders these using the OS locale — on a machine set to Arabic this showed Arabic-Indic digits ("٣٠") and Arabic day/month/hour labels in the native picker, not just a cosmetic quirk given this project's RTL/Arabic i18n plans. Use `type="text"` with a placeholder (`YYYY-MM-DD`, `HH:MM`) and simple regex validation instead — the `value`/change events stay plain strings either way.
  - `lib/api.ts`'s `api()` helper checks response text before `JSON.parse` regardless of status code (not just `204`) — a `200` with an empty body (e.g. from a `void` controller method) would otherwise throw on `res.json()`.
  - **Locale gotcha:** `toLocaleDateString(undefined, ...)` uses the browser/OS locale, not English — caught this rendering Arabic month names on a test machine with an Arabic locale. Always pass an explicit locale (`"en-US"`) for date formatting until real i18n is wired up.
- **UI libs:** Framer Motion, Embla Carousel, Lucide React.
- **Deploy:** Vercel (frontend) + production env for backend/DB.
