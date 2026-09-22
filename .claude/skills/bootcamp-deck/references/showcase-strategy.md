# Showcase strategy — which project fills «شرح المفاهيم», and in what form

Settled 2026-09-22. Committed to for days 2–10, reviewable later.

---

## The split

| Session | Project | Why |
|---|---|---|
| **«شرح المفاهيم»** — the showcase | **BookIt** | Finished, richly documented, and its thinking artifacts are stack-independent |
| **«تطبيق مباشر مع المدرب»** — live | **darrisni** (`C:\Users\ammar\future-dev\claude\trainee-test`) | On the course's own stack, built with the actual trainee package |

Both sessions run **every** day 2–10. The choice above is about which project *supplies the
material*, not about skipping a session.

**The trade-off that was accepted:** darrisni is used for the live session, so it is *not* producing
recordings. If that turns out wrong, the fallback is to record days on darrisni and start a fresh
project for live sessions.

### Why not BookIt for the live session
It is finished. Its build cannot be performed again.

### Why not darrisni for the showcase
It would mean building each day on darrisni *in advance* to record it, which is the same work as the
live session done twice.

### Why BookIt's wrong stack does not disqualify it here
BookIt is Spring Boot + a separate Next.js + native Postgres + Docker/Render. The course teaches one
Next.js app + Supabase + Vercel in `application/`. That mismatch **matters enormously for process
steps and not at all for thinking artifacts**. A problem statement, a scope split, a roles table, an
ERD, a user journey — none of them care what framework shipped underneath. Days 2–6 are almost
entirely thinking work, which is exactly where BookIt is strongest.

It bites from §14 onward. See the open question at the bottom.

---

## Choosing the form, per content type

| Content | Form | Note |
|---|---|---|
| A thinking artifact (definition, scope, roles, requirements) | **`chatlog`** — the real conversation + a formatted-output slide | Text projects badly on video; the trainee needs to *read* the before/after |
| A diagram | show the diagram | `diagrams/*.drawio` are presentable as-is |
| A process on the trainee's stack | **recording**, made on darrisni | Must match what the trainee will actually type |
| BookIt's finished app | one tour, recorded once | No progression needed — it is the "where you're heading" shot |

"Showcase" does not mean "video."

---

## What BookIt actually has, per section

Verdicts from a full inventory of the repo.

| § | Verdict | Best artifact |
|---|---|---|
| **§8** MVP definition + scope | **RICH** | `PROJECT_REPORT.md:40-42` (problem/purpose/4 objectives) + `73-82` (three scope lists); the raw notes becoming them at `conversation_history.md:124-169 → 205-238` |
| **§9** users + stakeholders | **RICH** | 3-role table `PROJECT_REPORT.md:56-60`, paired with the live correction at `conversation_history.md:250-254 → 266-270` where the separate Provider entity is deleted |
| **§10** requirements | **RICH** | 16 EARS requirements with priority matrix, user story and Gherkin criteria each: `PROJECT_REPORT.md:100-163`. Requirements visibly *born* from pushback at `533-541` (FR-14/15) and `844-850` (FR-16) |
| **§11** journey + activity diagram | **RICH** | three journeys `PROJECT_REPORT.md:176-219` → `diagrams/consumer_booking_activity.drawio` |
| **§12** design | **RICH** prompts/workflow · **PARTIAL** screens | ten ready-to-paste Claude Design prompts `PROJECT_REPORT.md:274-321` + tokens table `250-264`. Only **4** reference screens survive in `app/frontend/src/components/ds/screens-reference/`; the 9 generated screens have **no exports and no recorded URLs** — the shipped pages under `app/frontend/src/app/` stand in |
| **§13** data model | **RICH** | `diagrams/erd.drawio` — 8 entities, cardinality-labelled, drawn from the live `V1__init_schema.sql`; the `SystemSetting` → `AppSettings` redesign argument at `conversation_history.md:554-562` |
| **§14** implementation | **RICH** | `implementation_plan.md:71-161` — M0–M6.3 maps one-to-one onto tasks 14.1–14.7, with acceptance criteria and real bug callouts |
| **§15** testing + security | **PARTIAL** | Report §9 is an empty stub, but the per-milestone verification blocks are real — the RBAC curl matrix at `conversation_history.md:1064-1067` |
| **§16** deployment | **PARTIAL** | Report §10 never written; `render.yaml`, `app/backend/Dockerfile` and `app/frontend/.vercel/project.json` are showable as-is; the Vercel-CLI story only at `conversation_history.md:1625` |

**Zero BookIt screenshots or recordings exist anywhere in the repo.** Any BookIt visual is net-new
work. The only images are SAG Lab logos.

---

## Where the curated excerpts already are

The curriculum's «ما كتبه المدرب» collapsibles are **already** trimmed, translated showcase
material — use them before re-reading `conversation_history.md`:

| Collapsible | Lines in `bootcamp_roadmap_and_curriculum.md` |
|---|---|
| 8.1 steps 1–4 — free-form notes → definition | 1187–1216 |
| 8.1 step 5 — the correction round | 1220–1234 |
| 8.2 steps 1–3 — scope derived, not collected | 1272–1287 |
| 8.2 step 4 — the 3–5 limit, and why the trainer broke it | 1289–1296 |
| 9.1 steps 1–5 — roles + the representation decision | 1380–1395 |
| 9.1 step 3 — the overlap question | 1414–1427 |
| 9.2 steps 1+3 — the external service that changed the design | 1443–1460 |

---

## Trainer-example discipline

Binding rule from `CLAUDE.md` §A.5, and it applies to slides as much as to the curriculum:

- **Product only.** Exclude anything about building *this course* — choosing the project from the
  brochure, the agenda, the report structure, authoring tooling. The bootcamp brain-dump at
  `conversation_history.md:39-120` is out for this reason.
- **Excerpt at the clause level, not the prompt level.** Build-era prompts mix product and process in
  the same message.
- **Drop trainer-stack specifics** — Spring Boot metadata, the backend/frontend split, the monorepo
  layout, Maven, Flyway. A trainee on Next.js + Supabase never meets them.
- When unsure whether an excerpt qualifies, ask.

---

## Open, deferred to Day 6

**Does §14 get an incremental BookIt clone-and-replay?**

Feasibility was checked and it is **technically sound**: 19 clean commits (`23a5db0` M0 →
`7efdd6b`), self-describing milestone messages, Flyway `V1`–`V7` arriving incrementally so a fresh
DB replays forward naturally, 164 tracked files with no build artifacts committed. No tags, but the
messages are enough.

**The objection is not the versioning, it is the stack.** Replaying M0→M6 puts Maven commands, a
two-server local setup and native Postgres on screen — none of which a trainee will ever run. High
effort (fresh DB per checkpoint, env vars, Google OAuth credentials), and it demonstrates the wrong
process.

Decide at Day 6, when §14 is actually being built. The alternative for §14 is a `chatlog` of the
real M-milestone conversations plus darrisni recordings for the steps the trainee actually performs.

**Also deferred:** BookIt's deployment is currently down — the Render free tier expired, taking the
backend and its DB container with it. Only matters if §16 uses BookIt; the plan is that §16 is taught
on darrisni (Vercel, the course stack). If a BookIt tour is wanted anyway, run it locally and expose
it with ngrok for that one recording.
