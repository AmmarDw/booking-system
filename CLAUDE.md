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
- Tools available: context7 (MCP), Claude Design, GitHub (MCP), chrome-devtools (MCP), draw.io (skill), sequential-thinking, **Vercel MCP** (`https://mcp.vercel.com` — deploy management + logs; connect before deploying), **Supabase MCP** (`https://mcp.supabase.com/mcp` — OAuth, no PAT; *curriculum default stack only*, not used by the booking build itself).
- **Rule — register new tools:** whenever a new tool/MCP/skill is introduced or used in the project, add it **both here** (this "Tools available" list) **and** to the curriculum's **Section 17 «الأدوات المستخدمة»** table (and its booking «ما كتبه المدرب» collapsible if it's booking-specific). Keep the two in sync so no tool is missed on review.
- Timeline: build is compressed (~2 real days) though docs narrate the official 6 days.

### A.5 Building the Arabic curriculum (`project-package/bootcamp_roadmap_and_curriculum.md`)
- **Ground every section in the sources, not memory.** Before writing or updating **any** section of the curriculum file, **re-read the booking-system part of `conversation_history.md` together with `PROJECT_REPORT.md`** (and `implementation_plan.md` where relevant) and extract the *real* content — decisions, the order they happened in, the steps taken, and the gotchas. Do **not** write from memory. This matters most for **Section 14 (التنفيذ)**: the real build had heavy back-and-forth (M0–M6) that must be **systematized** into a general, product-agnostic workflow telling trainees *what to do*, with booking specifics only inside collapsible «ما كتبه المدرب» blocks.
- **Never name internal/graded docs inside the curriculum.** `PROJECT_REPORT.md`, `implementation_plan.md`, `research_plan.md` etc. are **extraction sources only** — they are not handed to trainees, so never reference them by name inside the curriculum file (or the Arabic handover files). Cite our real work generically instead.
- **Trainer examples show product-building only.** When mining `conversation_history.md` for a «ما كتبه المدرب» / «الحوار الحقيقي» block, exclude anything about building *this bootcamp*: choosing the project from the brochure, the training agenda, the report/curriculum file structure, or tooling for authoring. That logic is already delivered inside the trainee's package, so repeating it teaches nothing and blurs what the task is asking. Excluding the `D`-numbered prompts is necessary but **not sufficient** — build-era prompts mix product and process in the same message, so excerpt at the *clause* level, not the prompt level. Also drop excerpts that are specific to the trainer's heavier stack (Spring Boot metadata, backend/frontend split, monorepo layout) when the trainee's default stack would never hit them. **When unsure whether an excerpt qualifies, ask.**
- **Keep the trainee register.** Follow the collaboration principle (trainee gives free-form info → Claude formats/decides the technical parts → trainee reviews); use simple, slightly-local-leaning Arabic (avoid heavy فصحى); define each non-obvious term once; and don't introduce deep-technical vocabulary trainees aren't expected to know (e.g. no "class diagram"; keep PK/FK/keys as *Claude's* job, not something the trainee must specify).
- **Generic default stack for the curriculum's product-agnostic content** (decided with the user): **full-stack Next.js (TS) in one `app/` folder — no frontend/backend split — + Supabase (Postgres + built-in auth, no Docker/local install) + deploy to Vercel; Claude scaffolds everything, the trainee only creates accounts/keys.** Full definition in `project-package/.claude/rules/bootcamp-mvp-process.md` §4 (and the `deploying` skill for Vercel). The booking project's heavier *real* stack (Spring Boot + separate Next.js + native Postgres + Docker/Render) is the trainer's example only — keep it inside «ما كتبه المدرب» collapsibles, never in the generic steps.
- **Trainee package architecture (`project-package/`) — four surfaces, each answering one question.** Never let two of them cover the same ground:
  - `CLAUDE.md` — *who am I, where are we, what do I read next*: assistant identity, the Day-1 bootstrap, standing rules, progress ledger. Always loaded.
  - `.claude/rules/*.md` — *how do I behave, always*. **Loaded in full on every message**, so keep them short; `i18n-directionality.md` is `paths:`-scoped so it only fires on UI files.
  - `.claude/skills/<name>/SKILL.md` — *how do I execute this section*. Only the `description` sits in context; the body loads on demand. **New per-section playbooks go here, never into `rules/`** — that is what keeps the trainee's per-message cost flat.
  - `bootcamp_roadmap_and_curriculum.md` + `PRODUCT.md` — the only two files the **trainee** reads. The roadmap must stay identical for every trainee (it is the deck's source); the trainee's own answers go in `PRODUCT.md`.
  - **Deliberate redundancy:** template prompts live in both the skill *and* the trainee-facing material — belt and braces. Do not "deduplicate" them.
- **Trainee never reads/writes code; testing is Claude's job.** Generic steps must never tell the trainee to read/review code or run tests themselves — the trainee reviews by *using the UI* + reading Claude's plain report; Claude writes+runs test cases and browser-tests (chrome-devtools) automatically on every build and reports non-technically. Plans open with a plain-language "what we'll build now" summary before any technical detail.

### A.6 The deck is the curriculum — standards for every slide (`project-package/slides/day-NN.html`)

Decided in review, **2026-09-12**. These are standing rules: apply them to any slide work without asking for confirmation.

**A.6.1 The deck is the only thing trainees read.**
Trainees do **not** open `bootcamp_roadmap_and_curriculum.md` or the `.docx` — they follow the slides and nothing else. So every piece of trainee-facing content must be *on a slide*, complete, with no "see section N of the guide" dependency. The `.md`/`.docx` are now **authoring sources and trainer references only**; nothing may live there that a trainee needs.

**A.6.2 Completing a slide must not multiply slides.**
Making a slide self-contained means growing the content *inside its existing frame* — richer cards, a real example, a flow line — not splitting it into ١/٢ + ٢/٢. The deck's slide count is a budget: adding one is a deliberate, requested change, never a side effect of filling content in. (This does not forbid slides the user explicitly asks for.)

**A.6.3 Tone: plain, spoken-leaning Arabic — never compressed, and never heavily dialectal.**
Two edges, not one. The first failure mode is the one we shipped: telegraphic phrases where each word is meant to carry a paragraph, which read as obfuscated rather than concise. Write the way you would say it out loud; short sentences; no rhetorical compression; no clever em-dash constructions standing in for an explanation.
The second is the opposite edge. Lean **closer to colloquial than to فصحى** — but stay inside **المحكية البيضاء**: spoken words any Arabic reader parses, not Gulf-only ones. يقدّم / يعمل / ينفّذ not يسوّي; ايش not وش; يحتاج / يبي not يبغى; «كل ما احتجت» not «وقت ما التبس». Colloquial *connectives* stay (اللي، عشان، بس، مو) — they are what keeps the register spoken; it is the dialect *verbs* that shut a non-Gulf reader out.

**A.6.4 Pitch to the real trainee level.**
Assume the trainee has *heard* words like backend, frontend, server, hosting — and does **not** know how any of them work. For every such term give only: **what it is · what it does · when you'd use it.** Stop there. Depth beyond that is Claude's job, not the trainee's, and putting it on a slide costs comprehension without buying anything.

**A.6.5 Concrete examples, never vague ones.**
"مثلًا لو عندك متجر وتبغى تعرف كم طلب وصلك اليوم" beats "مثال على استعلام البيانات". If an example cannot be made concrete, it is not yet understood well enough to teach.

**A.6.6 Show the flow before the work.**
Never drop trainees into a sequence of steps without first telling them, plainly, what the sequence is for and what order it runs in — e.g. before §7.10: "بنسوي الحين خطوات تجهيز نظّفت الجهاز للمشروع، وهي بالترتيب: …". **Be neutral about the medium:** some of these framings belong on a slide, others are just something the trainer says. Decide per case and say which you chose; do not reflexively add a slide for every one.

**A.6.7 Vocabulary — fixed choices.**
- **مشروع, not منتج.** «مشاريع رقمية» not «منتجات رقمية»; «مشروعك» not «منتجك». Applies everywhere in trainee-facing text.
- **The colloquial «what» is «ايش», not «وايش».** The و is a separate conjunction: keep it only where the sentence genuinely joins something (a list, two clauses), and never at the start of a title, a task row, or a clause after an em-dash or colon.
- **Do not call anything «دليل».** The deck *is* the curriculum, so there is no separate guide to refer to. Say «الدورة» / «القسم N» / «الحزمة» instead.
- **Never say «الطرفية».** It reads as odd/stilted. Say **«سطر الأوامر»** for the general concept, or **«موجّه الأوامر»** for an actual window the trainee opens/closes (open it, close it, a new one). If you need to distinguish it from a specific program (e.g. the editor's integrated console vs. the OS shell), use the **English term directly** — `Terminal` or `PowerShell` (as `.tok-lat`), not an Arabic calque. Applies to every trainee-facing file (the deck, the curriculum) and to `.claude/skills/`/`.claude/rules/` prose — the user has manually corrected this term out of the deck before; do not reintroduce it.

**A.6.7.1 Address ONE trainee, always in the singular.**
Every trainee builds **their own project, alone**. There is no group work, no pair work, and no «نحن» that includes Claude — Claude is a tool the trainee operates, not the other half of a team. So trainee-facing text never uses a second-person plural or dual: no «تشتغلون»، «وصلتم»، «توصلون»، «أنتم»، «سوا»، «معًا» *when the other party is Claude*. Say what the trainee does and name Claude separately: «في كل مهمّة عليك شغل، وعلى Claude شغل» — not «تشتغلون سوا». The one place a plural is correct is the **trainer** and the trainees in a live session («ننجزها معًا الآن» in §7.10), because that really is a room working through something together.

**A.6.8 Day structure — tasks first, goals last.**
Every day opens with **that day's tasks** (its §6.N block) so trainees know the plan before any content. **«أهداف اليوم» comes at the end of that block**, after the tasks are on the table — not before them. Day 1 is the only exception to "tasks first": it opens with the cover slide and the project-package brief, *then* the tasks.

**A.6.9 Task checkboxes are live.**
Task rows in a §6.N block ship **unchecked** and are **clickable** — trainees tick them off as they finish. State persists per deck in `localStorage`. Never pre-check them in the markup.

**A.6.10 Working method.**
Slides are revised **gradually, a few at a time**. When asked to fix a slide, fix *that* slide against A.6.1–A.6.9 and leave the rest alone; then say which slides most need the same treatment next.

**A.6.11 Examples first — and calibrate the dose to the topic's weight.**
Examples always beat abstraction, but *how much* of a section rides on its example is a judgement,
not a constant. Two doses:
- **Clarifying example — the default, most content.** The trainee can already follow the sentence;
  the example only makes it concrete. It lives *inside* the explanation: one line, one card, a real
  number. Do not spend a slide on it.
- **Gateway example — rare, and deliberate.** The concept is heavy, abstract or technical relative
  to the trainee's level, and the sentence defining it means nothing to someone who has not watched
  the thing happen. Here the example *is* the road in: open on a concrete situation the trainee
  already lives, walk it as a sequence of actions (A.6.6), **never name the concept while the story
  runs**, and only in the closing line reveal that what they just watched is what the term means.
  The next slide then explains the concept by pointing back at that same example, part by part.

**How to pick:** if the trainee could understand the definition on its own, it is clarifying. If the
definition would land as noise until they have seen it happen, it is a gateway — and then it is
worth a whole slide. §7.5 (MCP) is the worked case: slide 24 is the Gmail story with MCP unnamed
until its last line; slide 25 names the parts by reflecting them back onto it.

Over-dosing a light topic is a real cost — it burns slides and reading time and buys nothing. Weigh
each topic on its own; most do not clear the bar.

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
- **A provider can book other providers' services as a consumer, but never their own availability.** Enforced twice: their own entry is filtered out of the day-view provider list client-side, and `BookingService` rejects it server-side (400) before it ever reaches the DB — the client-side filter alone is not trusted.

### B.3 Pages
- **Landing page** (public): system info + a user-journey section matching our journey. MVP-appropriate — **no social-proof section**. Sections (from research R3): Hero → How-it-works/journey → Services preview → (optional) FAQ → Footer.
- **Booking page** (public browse): list of services. Browsing is open; **booking prompts sign-in/sign-up**, then **redirects back** to the booking page/flow the user was on.
- **Calendar/slot selection** (auth required): **dedicated page** (e.g. `/book/[serviceId]`), not a modal (research R4 — multi-step flow + shareable URL + clean auth-redirect).
- **Dashboard** (provider + admin — **same UI**): calendar view (month/week/day) + list toggle; appointment cards (service, consumer, time, status); filters by service/status, **admin-only** filter by **provider**. Providers see only their own data **plus any bookings they made themselves as a consumer** (merged in, since a provider can book elsewhere — see B.2); admins already see everything, consumer-side bookings included. Where the row's consumer is the viewer, the name is bolded/colored with a trailing **"(You)"** so it doesn't read as a real patient. **Bulk availability generator** (weekdays × date range × time ranges) available to **both providers (own slots) and admins (any provider)**. Separate Services-management view. (research R2)
- **My Appointments** (`/appointments`) — **consumer-only**, not shown/reachable for providers/admins (nav link hidden, direct navigation redirects to `/dashboard`). The signed-in consumer's own bookings (`GET /api/bookings?mine=true`, self-scoped server-side, never trust the client), and their redirect target right after booking. Providers/admins have no separate "my bookings" page at all — their own consumer-side bookings surface only via the "(You)" merge into `/dashboard` (above); they land back on `/dashboard` after booking instead. Every appointment row across **both** appointment tables (this page, and the provider/admin dashboard) is clickable and opens a shared details modal (service, date, time, consumer, provider, status, and the **meeting link**) — the meeting link isn't otherwise shown in the table row itself.
- **Loading overlay:** the "Book appointment" button triggers a synchronous Google Calendar + email round-trip server-side, which is slow enough to feel broken without feedback. A full-page blurred overlay (`LoadingOverlay`, content stays visible underneath — never disappears) covers the wait; on success the user is redirected (consumers → `/appointments`, providers/admins → `/dashboard`) with the confirmation toast carried across via query params (cleared from the URL immediately after so a refresh doesn't re-show it).

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

### B.5.1 Booking status lifecycle (`BookingStatus`)
- Five statuses. **`CONFIRMED`** (initial) → one of the terminal states. **`CANCELLED`** (consumer, only >24h before start; frees the slot back to `AVAILABLE`). **`COMPLETED`** (provider/admin, only after the slot's **end** time). **`NO_SHOW`** (any party, only after end; leaves the slot `BOOKED`). **`VACANT`** is **never persisted** — it's a synthesized dashboard-only label for open (`AVAILABLE`) slots; the DB `CHECK` constraint (V7) deliberately excludes it, so it can't be written even though it's a Java enum value.
- Transitions go through `PATCH /api/bookings/{id}/status` → `BookingService.updateStatus`, which enforces role (consumer can cancel/no-show their own; provider/admin can complete/no-show), time gates, and "only from CONFIRMED" (terminal states are final → 409). The frontend `AppointmentDetailsModal` shows the role-appropriate buttons and **shadows** the disallowed ones with an explanatory note — the server is the real gate.

### B.5.2 Shared dashboard (`/dashboard`, provider + admin)
- One big filter system applies to **every** section: **Service / Status / Provider (admin-only)** multi-selects + a **date-range** picker (start defaults to today). Backed by `GET /api/bookings/{feed,stats,chart}` (comma-separated `serviceIds`/`statuses`/`providerIds` + `from`/`to`).
- **Stat cards** (4) are **date-range-driven** (no fixed today/this-week/30d windows) and narrowed by service+provider — **not** the status filter (each card has an intrinsic status meaning; a no-show rate needs completed+no_show regardless).
- **"Bookings over time"** chart + the **Calendar** share a **Month/Week/Day** granularity toggle (chart buckets by it; calendar shows that window, anchored at the range start). Calendar **month = a real 42-cell (6×7) calendar-aligned grid**. Both chart and calendar/list honor all shared filters.
- **`feed`** returns real bookings **plus** synthesized `VACANT` entries for open slots (negative id `=-slotId`, null consumer). Vacant entries are excluded when a specific service is filtered and only appear when `VACANT` is among the selected statuses. Provider scope includes their own bookings-as-consumer (marked "(You)"), same as before.

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
