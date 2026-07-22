# Project Report — Booking & Appointment Management System

> **How to read this report.** It doubles as a **bootcamp template** and a **worked example**. Each section is structured as:
> **① Purpose** (what goes here) → **② Template** (fill-in structure) → **③ Example** (a short generic sample) → **④ Our Project** (this booking system's actual data).
> Requirements follow `requirements-standards.md` (EARS syntax, flat IDs, Gherkin acceptance criteria). Trainees: replace the ④ blocks with your own product's data.

---

## Table of Contents

1. [Introduction to the MVP](#1-introduction-to-the-mvp)
2. [Users / Stakeholders](#2-users--stakeholders)
3. [MVP Scope](#3-mvp-scope)
4. [System Requirements (SRS)](#4-system-requirements-srs)
5. [User Journey](#5-user-journey)
6. [Design](#6-design)
7. [Data Model (ERD)](#7-data-model-erd)
8. [Implementation](#8-implementation)
9. [Testing & Security Review](#9-testing--security-review)
10. [Deployment](#10-deployment)
11. [User Guide](#11-user-guide)
12. [Tools Used](#12-tools-used)
13. [Appendix: 6-Day Process Plan](#13-appendix-6-day-process-plan)

---

## 1. Introduction to the MVP

**① Purpose.** One short section covering the problem, the purpose, and the objectives of the MVP. Keep it brief — a paragraph plus a short objectives list.

**② Template.**
> **Problem:** [what pain exists today].
> **Purpose:** [what the MVP does about it].
> **Objectives:** [3–5 bullet outcomes].

**③ Example.**
> **Problem:** Small clinics track appointments on paper and double-book. **Purpose:** A simple web app to book and manage appointments. **Objectives:** reduce no-shows, remove double-booking, send reminders.

**④ Our Project.**
- **Problem:** Service providers (consultants, clinics, tutors) and their clients lack a simple shared way to see real availability and book a specific time with a specific provider; bookings and confirmations are handled manually.
- **Purpose:** A booking & appointment management system where consumers browse services, pick a date and an available provider slot, book it, and receive an email confirmation with a Google Meet link; admins and providers manage services and availability.
- **Objectives:** (1) let consumers self-serve bookings against real provider availability; (2) prevent double-booking by binding slots to providers across services; (3) give admins easy bulk availability management; (4) confirm each booking by email with a meeting link.

---

## 2. Users / Stakeholders

**① Purpose.** List the user types (roles) and what each needs from the system.

**② Template.** `| Role | Description | Key needs |`

**③ Example.** `| Customer | Books services | Find a time, confirm booking |`

**④ Our Project.** Roles are a `role` field on a **single `User` entity** (there is no separate Provider entity).

| Role | Description | Key needs |
|------|-------------|-----------|
| Consumer | Public user who books appointments | Browse services, see real availability, book a provider's slot, get confirmation |
| Provider | A `User` (role=PROVIDER) offering one or more services with personal availability | **Self-manage** own time slots (incl. **bulk generation**); bookings on one service block their other services; a dashboard of own appointments |
| Admin | Operator with full control | Manage services, users, and all appointments; **bulk-generate availability for any provider**; same dashboard as providers **plus a provider filter**; view all bookings |

---

## 3. MVP Scope

**① Purpose.** State exactly what ships in the MVP and, separately, genuine beyond-MVP ideas (Future Development Plan — a Day-6 deliverable). Bootcamp rule: 3–5 core feature areas.

**② Template.** In-scope list · Out-of-scope list · Future Development bullets.

**③ Example.** In: booking + admin view + email. Out: payments. Future: SMS reminders.

**④ Our Project.**
- **In scope (all shipping):**
  1. Public landing + service browsing.
  2. Consumer booking flow (colored-pressure calendar → provider dropdowns → book → success toast) on a dedicated booking page.
  3. Auth (sign up / sign in) with redirect-back-to-booking.
  4. Provider availability model (slots bound to providers, shared across their services).
  5. **Shared dashboard** (provider + admin, same UI): view/manage appointments; **bulk availability generator** usable by **providers (own slots) and admins (any provider)**; admin adds a **provider filter** and manages services/users.
  6. Email confirmation (Gmail SMTP) + **Google Meet** link (implemented last).
- **Out of scope (MVP):** payments/billing, ratings/reviews, multi-tenant orgs.
- **Future Development Plan (Day 6):** _to be populated_ (e.g., SMS reminders, provider analytics, two-way calendar sync, drag-to-reschedule, **audit/activity logging**).

---

## 4. System Requirements (SRS)

**① Purpose.** The functional (FR-#) and non-functional (NFR-#) requirements. Each FR uses EARS syntax, carries a **user story**, and **Gherkin acceptance criteria**. A **Requirements Priority Matrix** flags main features and priority scores.

**② Template.**
> **FR-#** — *(EARS)* `WHEN … the system shall …`
> *User story:* As a [role], I want [feature], so that [benefit].
> *Acceptance:* Given … When … Then …

**③ Example.**
> **FR-1** — WHEN a customer selects an available slot and confirms, the system shall create a booking.
> *Acceptance:* Given an available slot, When the customer confirms, Then a booking is stored and a confirmation is shown.

**④ Our Project — Requirements Priority Matrix.** *(Main? = core feature; Priority out of 10.)*

| ID | Requirement (EARS) | Main? | Priority /10 |
|----|--------------------|:-----:|:-----:|
| FR-1 | The system shall display a public list of services without requiring authentication. | ✓ | 8 |
| FR-2 | IF an unauthenticated user attempts to book, THEN the system shall prompt sign-in/sign-up and redirect back to the booking flow after authentication. | ✓ | 9 |
| FR-3 | WHEN a consumer selects a service and a date, the system shall display that date's appointments grouped by provider as stacked dropdowns. | ✓ | 10 |
| FR-4 | WHEN a consumer books a provider's slot, the system shall mark that slot reserved across all services that provider offers. | ✓ | 10 |
| FR-5 | WHEN a booking succeeds, the system shall send a confirmation email (service, date, time, meeting link) via Gmail SMTP. | ✓ | 8 |
| FR-6 | WHEN a booking is confirmed, the system shall create a calendar event on the **provider's** Google calendar (both parties invited) and attach the generated Google Meet link to the booking. | | 6 |
| FR-7 | The system shall let a **provider** (own slots) or an **admin** (any provider) bulk-generate availability by selecting weekdays, a date range (within the provider advance limit), and time ranges — creating slots only on the chosen weekdays (weekends are allowed if chosen). | ✓ | 9 |
| FR-8 | The system shall let an admin view, create, modify, and delete services, users, and appointments. | ✓ | 9 |
| FR-9 | WHILE viewing the calendar, the system shall show each day's **available-out-of-total** appointment count and color each day by availability pressure (High ≥4, Medium =3, Low =1–2), shadowing days with **no available slots**. | | 7 |
| FR-10 | The system shall provide a dashboard where a provider manages **their own** appointments and availability, and an admin manages **all** of them. | ✓ | 9 |
| FR-11 | WHILE an admin views the dashboard, the system shall provide a **provider filter** to scope appointments/availability to a chosen provider. | | 7 |
| FR-12 | IF a user requests a page or action their role does not permit, THEN the system shall deny access. | ✓ | 9 |
| FR-13 | The system shall let a provider connect their own Google account (OAuth2) so bookings create Meet links on their calendar; a provider is not bookable until connected (or a fallback link is set). | | 6 |
| FR-14 | The system shall let an admin configure the **maximum booking horizon** (a duration, default 6 months) within which consumers may book. | | 6 |
| FR-15 | WHILE a consumer views the booking calendar, the system shall make **past dates** and dates **beyond the configured horizon** non-selectable and non-navigable — the year picker lists only the 1–2 years the window spans, and the month grid shadows/disables months before the current month or beyond the horizon. | ✓ | 7 |
| FR-16 | WHEN a user self-registers, the system shall assign the **CONSUMER** role; only an **admin** may grant the PROVIDER or ADMIN role (create a provider, or promote a consumer). | ✓ | 8 |

**User stories + Gherkin acceptance criteria (per FR):**

- **FR-1** — *As a visitor, I want to browse services without an account, so that I can decide before signing up.*
  `Given I am not signed in, When I open the booking page, Then I see the list of services and can browse without being asked to log in.`
- **FR-2** — *As a visitor, I want to be sent to sign-in only when I try to book and returned afterward, so that I don't lose my place.*
  `Given I am not signed in and viewing a service, When I click "Book", Then I am prompted to sign in/up; And after authenticating I am returned to that service's booking flow.`
- **FR-3** — *As a consumer, I want to see each provider's slots for the chosen date, so that I can compare providers.*
  `Given I selected a service and a date, When the page loads, Then each provider is a dropdown that, when expanded, lists that provider's slots for the date; And multiple dropdowns can be open at once.`
- **FR-4** — *As a consumer, I want a booked provider slot to be unavailable for that provider's other services, so that I never double-book a person.*
  `Given a provider offers services A and B and their 2:00 PM slot is open, When I book that slot for service A, Then the same 2:00 PM slot shows as booked (shadowed) under service B for that provider.`
- **FR-5** — *As a consumer, I want an email confirmation, so that I have a record of my booking.*
  `Given my booking succeeds, When the confirmation is processed, Then I receive an email containing the service name, date, time, and meeting link.`
- **FR-6** — *As a consumer, I want a video link, so that I can join the appointment online.*
  `Given a booking is confirmed, When the meeting link is generated, Then a Google Meet URL is stored on the booking and included in the confirmation email.`
- **FR-7** — *As a provider/admin, I want to generate many slots at once, so that I don't create them one by one.*
  `Given I choose weekdays, a date range within [today, today + advance limit (≈1.5× horizon)], and time ranges, When I submit the bulk generator, Then availability slots are created for every chosen weekday within the range at the specified times (only the weekdays I picked — weekends are NOT auto-skipped, a provider may work Fri/Sat); And a range starting in the past or exceeding the advance limit is clamped/rejected (a provider generates for themselves; an admin can target any provider).`
- **FR-8** — *As an admin, I want full CRUD over services/users/appointments, so that I can operate the system.*
  `Given I am an admin, When I create/edit/delete a service, user, or appointment, Then the change is persisted and reflected in listings.`
- **FR-9** — *As a consumer, I want the calendar to signal how busy each day is, so that I can pick a good day.*
  `Given a month is displayed, When a day has available slots Then it shows an "available/total" count; And When a day has ≥4 available Then it renders High/low-pressure; When =3 Then Medium; When 1–2 Then Low; When 0 available Then it renders the shadowed no-bookings style (regardless of weekday — weekends are not special).`
- **FR-10** — *As a provider, I want a dashboard of my own bookings; as an admin, of everyone's.*
  `Given I am a provider, When I open the dashboard, Then I see only my appointments/availability; Given I am an admin, When I open the dashboard, Then I see all providers' appointments/availability.`
- **FR-11** — *As an admin, I want to filter the dashboard by provider, so that I can focus on one person.*
  `Given I am an admin on the dashboard, When I select a provider in the filter, Then only that provider's appointments/availability are shown.`
- **FR-12** — *As the system owner, I want role checks enforced, so that users cannot exceed their permissions.*
  `Given I am signed in as a CONSUMER, When I request an admin page or call an admin action, Then the system denies access (redirect/403).`
- **FR-13** — *As a provider, I want to connect my Google account once, so that each booking's Meet link is hosted on my own calendar and my clients can join directly.*
  `Given I am a provider without a connected Google account, When I open my dashboard, Then I am prompted to "Connect Google Calendar"; And after granting consent my services become bookable; And a subsequent booking creates the event on my calendar with a Meet link and both parties invited.`
- **FR-14** — *As an admin, I want to set how far ahead people can book, so that I control the scheduling window.*
  `Given I am an admin, When I set the max booking horizon to N months, Then the setting persists and the booking calendar and server-side validation both use it.`
- **FR-15** — *As a consumer, I want the calendar to only offer valid dates, so that I can't pick a past or too-far date.*
  `Given the horizon is 6 months, When I open the booking calendar, Then past days are shadowed and non-clickable; And days beyond today+6 months are shadowed and non-clickable; And the year picker lists only the current year plus next year if the window crosses it; And the month grid disables months before the current month and months beyond the horizon.`
- **FR-16** — *As the platform owner, I want providers to be admin-vetted, so that not just anyone can offer services.*
  `Given a visitor completes the public sign-up form, When the account is created, Then its role is CONSUMER; And a self-registration request can never set PROVIDER/ADMIN; Given I am an admin on the Users screen, When I create a user as PROVIDER or change a consumer's role to PROVIDER, Then that user gains provider access and is prompted to connect Google.`

**Non-Functional Requirements.**

| ID | Requirement |
|----|-------------|
| NFR-1 (Performance) | The system shall render the booking calendar for a month within 2.0 s on a broadband connection. |
| NFR-2 (Security) | The system shall enforce role-based access via a Spring Security filter chain + method-level authorization, and store passwords hashed (BCrypt). |
| NFR-3 (Security) | The system shall keep all secrets (Gmail app password, Google OAuth client secret, DB credentials) in environment variables, never in the repository. |
| NFR-4 (Reliability) | IF meeting-link generation fails, THEN the system shall still complete the booking and send the email without the link, and log the failure. |
| NFR-5 (Usability / i18n) | The UI shall use logical CSS properties and render `dir`/`lang` server-side per the global i18n rule, so an Arabic (RTL) build mirrors without layout jumps. |
| NFR-6 (Portability) | The system shall run locally against a PostgreSQL instance (docker or native) with all connection details supplied through environment variables, never hardcoded. |

---

## 5. User Journey

**① Purpose.** A text description of the main journey (Day 1) that converts to an **activity diagram** (Day 2, draw.io skill). Write it in the JOURNEY/DECISION format from `.claude/rules/bootcamp-mvp-process.md` §2.

**② Template.** `JOURNEY / ACTOR / START / numbered steps / DECISION branches / END`.

**③ Example.** START → 1. Browse services → 2. Select service → 3. DECISION: logged in? …

**④ Our Project.** *(Text version drafted Day 1; diagram embedded Day 2.)*
```
JOURNEY: Book an appointment
ACTOR: Consumer
START
1. Open booking page and browse services
2. Select a service
3. DECISION: Authenticated?
   - IF no  -> go to step 4
   - IF yes -> go to step 5
4. Sign in / sign up, then return to the selected service
5. Pick a date on the calendar
6. Expand a provider dropdown and select an available slot
7. Click "Book appointment"
8. See success toast; receive confirmation email with Meet link
END
```

**Secondary journeys** (support the main one; also converted to diagrams Day 2 if useful):
```
JOURNEY: Manage my availability
ACTOR: Provider
START
1. Sign in and open the dashboard
2. DECISION: Add many slots or one?
   - IF many -> go to step 3
   - IF one  -> go to step 4
3. Open bulk generator; choose weekdays + date range + time ranges; submit
4. Add/edit/remove individual slots
5. Review own appointments in calendar/list view
END
```
```
JOURNEY: Operate the system
ACTOR: Admin
START
1. Sign in and open the dashboard (all providers)
2. Optionally select a provider in the provider filter
3. DECISION: What to manage?
   - IF availability -> bulk-generate/edit slots for the chosen provider
   - IF services     -> create/edit/delete services and provider-service offerings
   - IF appointments -> view/create/modify/delete any appointment
   - IF users        -> manage users and roles
END
```
**Consumer activity diagram:** [`diagrams/consumer_booking_activity.drawio`](diagrams/consumer_booking_activity.drawio) — swimlanes **Consumer** (blue) and **System** (green), decision in orange. Open/edit in draw.io. *(Provider/admin diagrams optional.)*

---

## 6. Design

**① Purpose.** Screens/pages, initial UI (Claude Design), landing-page sections, and the booking-calendar UX.

**② Template.** Screen list · wireframe/first-model links · key UX decisions.

**③ Example.** Screens: Home, Booking, Confirmation, Admin.

**④ Our Project.**

#### 6.1 Screen / Page Inventory

| Screen | Route | Auth | Notes |
|--------|-------|:----:|-------|
| Landing | `/` | public | Hero → How-it-works/journey → Services preview → (opt) FAQ → Footer (no social proof) |
| Auth | `/sign-in`, `/sign-up` | public | Redirect back to the booking flow after auth (FR-2) |
| Booking — services | `/book` | public browse | Service list; "Book" gates on auth |
| Booking — calendar | `/book/[serviceId]` | required | Pressure-colored calendar → stacked provider dropdowns → select slot → "Book appointment" → success toast (FR-3/4/9) |
| Dashboard (shared) | `/dashboard` | provider/admin | Calendar (month/week/day) + list toggle; filters by service/status; **admin-only** provider filter (FR-10/11) |
| Bulk availability | `/dashboard/availability` | provider/admin | Weekdays × date range × time ranges (FR-7) |
| Services management | `/dashboard/services` | admin | CRUD services + provider-service offerings (FR-8) |
| Users management | `/dashboard/users` | admin | CRUD users; **create providers / promote consumer→provider** (FR-8/FR-16) |
| Connect Google | `/dashboard/connect-google` | provider | OAuth onboarding; gates bookability (FR-13); provider reaches it after an admin grants the PROVIDER role |

#### 6.2 Design-System Tokens (teal primary; drives Claude Design + Tailwind)

- **Primary (teal):** `#0D9488` · hover `#0F766E` · tints `#CCFBF1` / `#F0FDFA`. **Neutrals:** slate `#0F172A … #F8FAFC`. **Semantic:** success `#16A34A`, warning `#D97706`, danger `#DC2626`, info = primary.
- **Availability-pressure palette** — kept distinct from teal and **reinforced by a numeric badge + opacity** (not color-only, so it stays readable and colorblind-safe):

  | Level | Rule | Text/accent | Day background |
  |-------|------|-------------|----------------|
  | High | ≥ 4 available | `#22C55E` | `#DCFCE7` |
  | Medium | = 3 available | `#F59E0B` | `#FEF3C7` |
  | Low | 1–2 available | `#F97316`→`#EF4444` | `#FFEDD5` |
  | None (0 available) | 0 available | `#94A3B8` @ reduced opacity | shadowed "no bookings" |
  | Booked slot | after date selected | same shadowed/desaturated treatment as None | — |

  *(Weekends are not a special case — a day is shadowed only when it has 0 available slots; providers may choose to work Fri/Sat.)*

- **Typography:** Inter (LTR) + an Arabic-friendly face (IBM Plex Sans Arabic / Cairo) via `next/font`. **Radius:** 8px default, 2xl for cards. **Spacing:** 4px base scale. **Shadows:** subtle, used for pressure/booked de-emphasis.
- **RTL/i18n:** logical properties only (`ps/pe/ms/me/text-start/text-end`), `dir`/`lang` rendered server-side per `C:\Users\ammar\.claude\rules\i18n-directionality.md`.

#### 6.3 Claude Design Workflow (Design-System-first + DesignSync)

We start by building a **Design System** project in Claude Design (tokens + core components), generate each screen from it, then pull the components into `app/frontend` via **DesignSync** (`/design-sync`, one component at a time). The generic step-by-step for trainees is in `.claude/rules/bootcamp-mvp-process.md` (Day 2). Paste the prompts below in order.

#### 6.4 Ready-to-Paste Claude Design Prompts

> Replace nothing — these already encode our tokens, pressure rules, RTL, and FRs. Run **A first**, then generate screens **B–J** from that system. **One prompt = one screen** (generate each in its own Claude Design generation).

**A — Design System setup**
```
Create a Design System for "BookIt", a booking & appointment web app (Next.js + Tailwind, RTL-ready Arabic/English).
Colors — Primary teal #0D9488 (hover #0F766E, tints #CCFBF1/#F0FDFA); neutrals slate #0F172A→#F8FAFC; success #16A34A, warning #D97706, danger #DC2626.
Availability-pressure scale (used on calendar days & slots), each shown with a number badge + opacity, kept visually distinct from the teal primary:
  High(≥4)= green #22C55E on #DCFCE7; Medium(3)= amber #F59E0B on #FEF3C7; Low(1–2)= warm #F97316→#EF4444 on #FFEDD5; None(0 available)= slate #94A3B8 reduced-opacity "shadowed"; Booked= same shadowed treatment. (Weekends are NOT special — shadow only when 0 available.)
Type: Inter (Latin) + IBM Plex Sans Arabic (Arabic). Radius 8px (cards 2xl), 4px spacing scale, subtle shadows.
Core components: Button (primary/secondary/ghost, disabled), Input, Select, Card, Badge, Toast, Modal, Calendar day cell (with the pressure states above), Accordion/Dropdown (for provider slot lists), Table, Tabs. Provide light + dark, and mirror correctly under RTL using logical properties.
```

**B — Landing** — `Design a landing page for BookIt using the design system: Hero (H1 + subtext + primary CTA "Book now"), How-it-works section mirroring: browse → pick date → choose provider slot → confirm, a Services preview grid, an optional FAQ, and a footer. MVP tone, no testimonials/social-proof. RTL-ready.`

**C — Auth** — `Design sign-in and sign-up screens using the design system (email + password, links between them, error states). Minimal, centered card. Sign-up has NO role choice — public registration always creates a Consumer (provider/admin roles are granted later by an admin), so do not add any "I'm a provider" option. After auth the app returns the user to the booking flow they came from.`

**D — Booking services** — `Design the /book services list: cards per service (name, short description, duration) with a "Book" button. Browsing is public; clicking Book on a logged-out user should visually indicate it will prompt sign-in.`

**E — Booking calendar** — `Design /book/[serviceId]: a month calendar.
Each day cell shows the COUNT OF AVAILABLE APPOINTMENTS OUT OF THE TOTAL for that day (e.g. "3/8"), and is colored by the availability-pressure palette: High(≥4 available), Medium(=3), Low(1–2), and None(0 available) shadowed "no bookings". Weekends are NOT special — a Fri/Sat with slots shows normally; shadow a day only when it has 0 available.
Booking window: an admin-set max horizon (default 6 months) limits how far ahead users can book. PAST days are shadowed and NOT selectable/navigable; days BEYOND today+horizon are shadowed and disabled. The calendar header lets the user open a YEAR picker that lists only the years the window spans (current year, plus next year only if the horizon crosses into it — so 1 or at most 2 years) and a MONTH picker (12-month grid) where months before the current month or beyond the horizon are shadowed/disabled and there is no navigation into past years.
Selecting a valid day reveals stacked provider dropdowns (accordions); expanding a provider lists their time slots for that day; booked slots appear shadowed/disabled; multiple providers can be open at once to compare. A "Book appointment" button is disabled until a slot is selected, then becomes primary-colored. On booking, show a corner success toast (auto-dismiss ~30s, with an X).`

**F — Shared dashboard** — `Design /dashboard shared by providers and admins: a calendar view (month/week/day toggle) + a list view toggle; appointment cards show service, consumer, time, status; filters by service and status. Add an admin-only "Provider" filter/selector at the top. Providers see only their own data.`

**G — Bulk availability** — `Design the bulk availability generator: pick weekdays (Sun–Thu), a date range, and one or more time ranges; preview the count of slots to be created; submit. Available to a provider (for themselves) and an admin (choose a provider first).
Scheduling window: the date-range pickers cannot start before TODAY and cannot end beyond TODAY + the provider ADVANCE LIMIT (≈ 1.5× the admin booking horizon; default 9 months when horizon = 6) — this lets providers pre-load availability further ahead than consumers can currently book. Past dates and dates beyond the advance limit are shadowed/disabled, with the same limited year/month pickers. Show the effective range hint (e.g. "You can schedule from <today> through <today + advance limit>"). If a selected range exceeds it, clamp and warn. IMPORTANT: slots are created only for the weekdays the user picks — do NOT auto-skip Fri/Sat; a provider may deliberately choose to work weekends.`

**H — Connect Google Calendar (provider onboarding, `/dashboard/connect-google`)** — `Design the provider Google-connection screen (FR-13) — ONE screen with three states, no admin/services content here.
Purpose text: a provider connects their Google account so every booking automatically gets a Google Meet link created on their own calendar.
State 1 — NOT CONNECTED: a centered card with a short heading ("Connect your Google Calendar"), one line of explanation, a primary button "Connect Google Calendar" (with the Google multicolor "G" icon on the start side), and below a divider an expandable secondary option "Or paste a permanent meeting link instead" revealing a URL text input + Save button (fallback for providers who skip OAuth). A subtle warning line: "Until you connect your calendar or add a link, your services won't be bookable."
State 2 — CONNECTED: a success card showing a green "Connected" badge, the connected Google account email, the date connected, and a secondary/danger "Disconnect" button.
State 3 — a compact inline warning banner variant (for the top of the provider dashboard) shown while not connected, with a "Connect now" link.
Use the design system (teal primary, 2xl cards, badges, toast on connect/disconnect). RTL-ready (logical properties; the Google "G" sits on the start side).`

**I — Services management (admin, `/dashboard/services`)** — `Design the admin Services Management screen (FR-8, admin only) — ONE screen, no provider/Google content here.
Header: title "Services" (start-aligned) + a primary "New service" button (end-aligned).
Body: a table of services with columns — Name, Description (truncated with ellipsis), Duration (e.g. "30 min"), Providers (a cell of small avatar/name chips for the providers who offer this service, with a "+N" overflow chip), and Actions (Edit and Delete icon buttons).
New/Edit opens a modal (or side drawer) with fields: Name (text), Description (textarea), Duration in minutes (number, min 1), and a searchable multi-select "Providers offering this service" listing PROVIDER users as checkable chips.
Delete opens a confirm dialog ("Delete <service>? Existing bookings are kept.").
Empty state: an illustration-light card "No services yet — create your first service" with the New service button.
Use the design system (table, modal/drawer, chips/badges, buttons, confirm dialog, toasts). RTL-ready.`

**J — Users management (admin, `/dashboard/users`)** — `Design the admin Users Management screen (FR-8/FR-16, admin only) — ONE screen.
Header: title "Users" + a primary "Add user" button; a search box and a Role filter (All / Consumer / Provider / Admin).
Body: a table with columns — Name, Email, Role (a colored badge: Consumer / Provider / Admin), Google (for providers: a small "Connected"/"Not connected" status pill; blank for others), Actions (Edit, Delete).
Add/Edit opens a modal with fields: Full name, Email, Role (select: Consumer / Provider / Admin), and an initial-password field on create (with a note that the user can change it later). Changing a consumer's role to Provider is the "promote" path; show a hint that a promoted/created provider will be asked to connect Google on next sign-in.
Row action "Make provider" as a shortcut on consumer rows (optional convenience) that just sets role = Provider.
Delete → confirm dialog.
Empty/search-no-results states included. Use the design system (table, modal, role badges, status pills, confirm dialog, toasts). RTL-ready.`

---

## 7. Data Model (ERD)

**① Purpose.** The entity-relationship diagram (distinct from a class diagram) and entity descriptions.

**② Template.** Entities, attributes, relationships (1:N, N:M).

**③ Example.** Customer 1—N Booking N—1 Slot.

**④ Our Project.** **Diagram:** [`diagrams/erd.drawio`](diagrams/erd.drawio) — 8 entities, teal headers matching the design system, cardinality labels on each relationship. Open/edit in draw.io. Drawn directly from the live Flyway schema (`app/backend/src/main/resources/db/migration/V1__init_schema.sql`), so it matches what's actually running, not just the prose below. Core entities (**one `User` entity — no separate Provider entity**):
- `User` — `id`, `email`, `passwordHash`, `role` (`CONSUMER`/`PROVIDER`/`ADMIN`), profile fields.
- `Service` — `id`, `name`, `description`, `durationMinutes`.
- `UserService` (**N:M**) — which services a provider (`User`) offers.
- `AvailabilitySlot` — `id`, `providerUserId` → `User`, `date`, `startTime`, `endTime`, `status` (`AVAILABLE`/`BOOKED`). **Bound to the provider, not to a service.**
- `Booking` — `id`, `consumerUserId` → `User`, `slotId` → `AvailabilitySlot`, `serviceId` → `Service`, `createdAt`, `status`.
- `MeetingLink` — `id`, `bookingId` → `Booking`, `url`, `provider` (=Google Meet).
- `GoogleAccountConnection` — `id`, `userId` → `User` (a provider), `googleEmail`, `refreshTokenEnc`, `scope`, `connectedAt`. Powers per-provider Meet-link creation (FR-13); nullable `fallbackMeetUrl` if the provider skips OAuth.
- `AppSettings` — **single-row** typed settings table. `id`, `maxBookingHorizonMonths` (default `6`), driving the booking window (FR-14/FR-15). Default seeded from `application.yaml` (`booking.max-horizon-months`); admin edits persist here and are cached at runtime (chosen over a generic key/value table and over yaml-only, which can't be written/refreshed live in production). The **provider advance limit** (how far ahead providers may generate slots) is *derived*, not stored: `ceil(maxBookingHorizonMonths × booking.provider-advance-multiplier)` (multiplier default `1.5`, yaml-only / not admin-facing).

**Key rule:** a `Booking` on a provider's `AvailabilitySlot` makes that slot `BOOKED` across **all** services that provider offers (the slot belongs to the person, so booking it for one service consumes it for the others).

---

## 8. Implementation

**① Purpose.** How the core was built: foundation, auth, core booking function, providers, dashboard, RBAC, integrations. Cross-references `implementation_plan.md`.

**② Template.** Per feature: what was built, key files, notes.

**③ Example.** Auth: JWT + Spring Security filter chain.

**④ Our Project.** *(Populated Days 3–5.)* See `implementation_plan.md` for the requirement→acceptance-criteria build order. Tech stack in `CLAUDE.md` §B.8.

---

## 9. Testing & Security Review

**① Purpose.** Manual test of basic + error cases; security review by attempting unauthorized access.

**② Template.** Test table (case → steps → expected → result) + security checklist.

**③ Example.** Book without login → prompted to sign in → pass.

**④ Our Project.** *(Populated Day 5; live testing via chrome-devtools MCP.)*

---

## 10. Deployment

**① Purpose.** Production environment prep and deployment (Vercel + backend/DB), plus the live URL.

**④ Our Project.** *(Populated Day 6.)*

---

## 11. User Guide

**① Purpose.** A short guide for end users (and admins) on how to use the product.

**④ Our Project.** *(Populated Day 6.)*

---

## 12. Tools Used

> **Most-requested section — kept current throughout the project.**

| Tool | Purpose | Used in |
|------|---------|---------|
| Claude Code | AI pair-programmer / project driver | All days |
| context7 (MCP) | Up-to-date library & framework docs while coding | Days 3–6 |
| draw.io (skill) | User-journey activity diagram | Day 2 |
| Claude Design | Initial UI/screen design | Day 2 |
| GitHub (MCP) | Repository & version control | Day 3+ |
| chrome-devtools (MCP) | Live browser testing & debugging | Day 5 |
| Vercel | Production deployment | Day 6 |
| Spring Boot 4.1.0 / Spring Security / Spring Data JPA (JVM 21) | Backend & auth | Days 3–5 |
| Flyway | Database schema migrations | Day 3+ |
| PostgreSQL (native Windows service, local dev) | Database | Days 3–5 |
| Next.js 16 / React 19 / TypeScript / Tailwind v4 | Frontend | Days 3–6 |
| DesignSync | Pull the Claude Design system into the repo | Day 2–3 |
| Framer Motion, Embla Carousel, Lucide React | UI/UX | Days 4–6 |
| Gmail SMTP | Confirmation email | Day 5 |
| Google Meet | Meeting-link generation | Day 5 |

---

## 13. Appendix: 6-Day Process Plan

**① Purpose.** The day-by-day tasks and outcomes (narrative, matching the bootcamp agenda). The coding-level plan lives in `implementation_plan.md`.

**④ Our Project.**

| Day | Focus | Output |
|-----|-------|--------|
| 1 | Requirements & scope | Product definition, **user-journey text (draft)**, SRS (FRs + Gherkin + NFRs), scope, priority matrix |
| 2 | UX plan | User-journey **activity diagram** (from Day-1 text), initial design (Claude Design), implementation plan |
| 3 | Foundation | Repo, scaffold, DB/ERD, auth, DB-connected local build |
| 4 | Core function | Full booking journey incl. providers, dashboard, RBAC |
| 5 | Integration & hardening | Email, Google Meet, testing, security, perf |
| 6 | Deploy & present | Live URL, user guide, overview, future plan |
