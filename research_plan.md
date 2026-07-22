# Research Plan — Booking & Appointment Management System

> Open questions to resolve before/at their design or integration step. Findings recorded inline; results feed `PROJECT_REPORT.md` and `implementation_plan.md`. **Status: R1–R4 resolved (Day-2 prerequisites satisfied).**

## R1 — Google Meet vs Calendly-style meeting links  *(pulled early; affects schema — implemented last)*
**Questions:** Does programmatic Google Meet link generation need a paid plan / Google Workspace? Which API? Can we keep our own booking UI? How do Calendly-style links relate to Google Meet?

**Findings:**
- A **free personal Gmail account can** generate Meet links via the **Google Calendar API** — `events.insert` with query param `conferenceDataVersion=1` and a `conferenceData.createRequest` containing a unique `requestId` and `conferenceSolutionKey.type = "hangoutsMeet"`. The API returns the meeting URL (`hangoutLink` / `conferenceData.entryPoints`).
- The "**Google Workspace required**" limitation applies to the **Admin SDK / service-account (domain-wide delegation)** path — **not** to normal **user-OAuth2** event creation. With **OAuth2 consumer credentials** (client id/secret + consent), a personal account works.
- **Custom UI is preserved:** Meet only returns a link string; there is no imposed/fixed component. Our booking UI stays fully custom.
- **Calendly** works the same way: it OAuth-connects the user's Google Calendar and adds Meet as the event location, which makes Google generate the link. (Tip from docs: disable Google Calendar's *automatic* Meet setting so you don't get two links.)
- Email confirmation is separate and simpler: **Gmail SMTP + app password** (no OAuth needed).
- Sensitive Calendar scopes require **Google OAuth verification** for a public production app; **test-user mode** is sufficient for the bootcamp demo.

**Admittance mechanics (resolved):**
- The **calendar organizer = the account whose calendar hosts the event**. Google Meet treats **anyone whose email is on the event's guest list as "Trusted"** → they **join directly, no host present, no manual admit**, as long as the **waiting room is off** (off by default for consumer meetings). Uninvited emails must "knock" and be admitted by someone in the call.
- **Therefore, on each booking we must add BOTH the provider and the consumer as event guests** (`attendees`) so neither has to knock.
- **One-host-account downside** (why we reject it): the operator's single calendar would own *every* meeting across all providers; the operator (not the attending provider) is the organizer; and any edge-case knock (consumer joins from a different email, or a waiting-room/restricted setting) could **only be cleared by the absent operator**. Also poor separation of data.

**Decision — per-provider Google connection from the START (chosen by user for better UX):**
- Each **provider connects their own Google account** (one-time OAuth2 consent, scope `calendar.events`). We store their **refresh token** (encrypted) on the user.
- On booking confirmation, create the event **on the provider's calendar** (provider = organizer/host, who actually attends), with `attendees=[consumer, provider]`, `conferenceData.createRequest` (`hangoutsMeet`), `conferenceDataVersion=1`, and `sendUpdates=all`. Store returned `hangoutLink` in `MeetingLink`.
- Result: provider is the real host (can admit any edge-case knock since they're present); invited consumer joins directly. No central operator involvement.
- **Provider gating:** a provider is not bookable until Google is connected — **fallback**: allow a provider to paste a **persistent personal Meet link** if they skip OAuth.
- **Consumer** needs no Google account; being an invited guest lets them join, and the present provider-host can admit if they arrive from a non-Google email.
- **Sequencing:** implemented **last** (M6). **When coding:** use **context7** for the Google Calendar Java client (`google-api-services-calendar`) + OAuth flow.
- **Google Cloud setup:** OAuth 2.0 client (id/secret), Calendar API enabled, consent screen with `calendar.events` (sensitive) scope; providers added as **test users** while unverified; submit for verification before public production.

**Sources:** [Google Calendar API — create events with Meet (`conferenceData`)](https://developers.google.com/calendar/api/guides/create-events#video), [codegenes: generate Meet link programmatically](https://www.codegenes.net/blog/programmatically-generate-a-google-meet-link/), [Calendly + Google Meet help](https://calendly.com/help/calendly-google-meet), [recall.ai: create a Google Meet programmatically](https://www.recall.ai/blog/create-a-google-meet-programmatically).

## R2 — Admin/provider dashboard patterns
**Questions:** How to lay out per-service appointments? How many admin pages? Best layout for many appointments?

**Findings:**
- Best practice: a **calendar view with month/week/day toggle** for overview + a **list/table view** for detail; one-click switching. Appointment **cards** show service, consumer name, time/duration, status; **color-code by service** (or, for us, by availability pressure). Filters (by service, staff/provider, status, location) are essential; multiple filters at once. Keep it **simple and consistent**, avoid clutter. Optional niceties: drag-to-reschedule, resize-to-change-duration (future).

**Decision:**
- **One shared dashboard** for PROVIDER and ADMIN (same UI). **Admin-only additions:** a **provider selector/filter**. Provider sees only their own data.
- Views: calendar (month/week/day) + list toggle. Filters: service, status, (admin) provider.
- **MVP pages:** Dashboard (shared) · Services management · Bulk-availability generator (form/modal: weekdays × date range × time ranges). Bulk generation is available to **both providers (own slots) and admins (any provider)**.

**Sources:** [Eleken — Calendar UI examples & UX tips](https://www.eleken.co/blog-posts/calendar-ui), [AdminUIUX — appointment booking dashboard](https://www.adminuiux.com/appointment-booking-dashboard-ui/), [BookingPress — admin calendar view](https://www.bookingpressplugin.com/documents/admin-calendar-view/).

## R3 — Landing-page sections + Claude Design prompts
**Questions:** Which sections suit an MVP booking landing (no social proof)? What prompts for Claude Design?

**Findings / Decision:**
- **Section set (MVP, no social proof):** **Hero** (H1 + subtext + primary CTA "Book now") → **How it works / User journey** (mirrors our journey text) → **Services preview** (a few sample services) → **(optional) FAQ** → **Footer** (links, copyright).
- Baseline reference `common_blueprints.md` §2 is minimal and my-implementation-only; we intentionally drop its Social-Proof section.
- **Claude Design prompt** drafted in **Day 2** from this section list (kept simple: palette-driven, RTL-aware per the i18n rule, logical properties).

**Sources:** [common_blueprints.md §2 Landing Page Standard](C:\Users\ammar\future-dev\antigravity\brain\blueprints\common_blueprints.md) (internal), general MVP landing guidance.

## R4 — Calendar UX: popup vs dedicated page
**Questions:** After choosing a service, is date/slot selection better as a modal or a dedicated page?

**Findings:**
- Rule of thumb: flows with **>3–4 steps** or multi-field interaction belong on a **dedicated page**, not a modal; modals get clunky on mobile and aren't shareable/crawlable. Our flow is multi-step (date → provider dropdowns → slot → confirm) and needs a clean **auth-redirect-back** target (a real URL).

**Decision:** **Dedicated page** — route like `/book/[serviceId]` (calendar + provider dropdowns + confirm). Not a modal.

**Sources:** [Smashing — Modal vs. Separate Page decision tree](https://www.smashingmagazine.com/2026/03/modal-separate-page-ux-decision-tree/), [LogRocket — modal UX patterns](https://blog.logrocket.com/ux-design/modal-ux-design-patterns-examples-best-practices/).
