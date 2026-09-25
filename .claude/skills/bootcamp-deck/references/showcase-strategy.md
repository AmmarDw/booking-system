# Showcase strategy — which project fills «شرح المفاهيم», and in what form

**Reversed 2026-09-25.** The 2026-09-22 split (BookIt showcases, darrisni goes live) is dead. Read
the new one below; the old arrangement survives only as the appendix, because its BookIt inventory
is still a useful reference.

---

## The split

| Session | Project | Form |
|---|---|---|
| **«شرح المفاهيم»** — the showcase | **darrisni** (`C:\Users\ammar\future-dev\claude\trainee-test`) | **Recorded video**, made on the course's own stack with the actual trainee package |
| **«تطبيق مباشر مع المدرب»** — live | ⚠ **unassigned — a third project is still needed** | The trainer re-runs the same steps live |

### Why BookIt lost the showcase

**A finished project cannot demonstrate a process.** BookIt can only ever show a *conversation that
already happened*. A trainee watching a replay of someone else's finished thinking has nothing to
copy — they see a result, not a method. That is what made its slides read as confusing, and it is
not fixable by picking better excerpts.

darrisni has the opposite property: it is being built *on the stack the trainee uses*, with the same
`PRODUCT.md`, the same `notebook.txt`, the same skills. Every recording is a thing the trainee will
literally repeat.

### The cost this incurs, stated plainly

darrisni is now spent on recordings, so **it cannot also be the live project** — the live session
needs a project whose next step is genuinely unperformed. That project has **not been chosen yet**.
Until it is, «تطبيق مباشر مع المدرب» has no source. This is the open item; do not plan around it as
if it were solved.

### How the two sessions are delivered

They are **interleaved, per section** — not two blocks:

> explain §A → play §A's recording → trainer re-runs §A live → explain §B → …

Which is why days 2–10 have **no «تطبيق مع المدرب» break slide**. See `day-deck-recipe.md`.

---

## What exists today

| Recording | Covers | Length | Status |
|---|---|---|---|
| `project-package/slides/media/tasks-81-82.mp4` | Tasks 8.1 + 8.2, end to end on darrisni | 3:24 | **Shipped** — Day-2 slide 9 |
| `project-package/slides/media/tasks-91-92.mp4` | Tasks 9.1 + 9.2, end to end on darrisni | 1:49 | **Shipped** — Day-2 slide 14 |

**Filenames are lowercase-hyphen** and the deck references them by name — see `MEDIA_SHOTLIST.md`.
The original of the above arrived as `8.1_&_8.2_tasks.mp4` and was renamed: `&` has to be escaped in
an HTML attribute, and no other asset uses underscores.

### Still to record

Everything else — Day 2 is now fully covered. §9 was recorded on **2026-09-25** and, with it, the
last BookIt material left the deck: Day-2 slides 12 and 13 were rebuilt on darrisni and slide 14's
`chatlog` was replaced by the recording.

**Day 3 — two recordings, both planned and neither filmed.** The deck ships their slides now, as
`stepvid__video--soon` placeholders carrying the expected steps (see `day-deck-recipe.md`).

| Planned file | Covers | Scope decided 2026-09-25 |
|---|---|---|
| `media/tasks-161-162.mp4` | §16 — tasks 16.1 + 16.2, Vercel setup through first live link | Film **all of it**, signup and both browser confirmations included. ⚠ **The env-key moment must be blurred or cropped in post** — it is the first recording in the course where a real secret is on screen |
| `media/task-101.mp4` | §10 — task 10.1, free-form notes about what the project does | Ends where Claude asks what is missing; it must **not** show the formal requirement being written (that is Day 4) |

**§16 is watched, not re-run live** — deploying an already-deployed project produces nothing, and the
account steps happen once per person. This is the per-section exception documented in
`day-deck-recipe.md`; it applies again to §16.3 on Day 10.

---

## Choosing the form, per content type

| Content | Form | Note |
|---|---|---|
| A task the trainee will perform | **recording**, on darrisni | The default now. It must match what the trainee will actually type |
| A diagram | show the diagram | `diagrams/*.drawio` are presentable as-is |
| A thinking artifact with no screen work | recording of the conversation happening | Even "thinking" tasks have a screen: the prompt being written, the reply arriving, the file changing. 8.1/8.2 proved this films fine |
| A finished app to aim at | one tour, recorded once | The "where you're heading" shot |

**The `chatlog` component is dead.** It was built for BookIt conversation replays. Its last instance
(Day-2 slide 14) was replaced by `tasks-91-92.mp4` on 2026-09-25, so **no deck uses it any more** —
though its CSS and JS are still in `deck.css`/`deck.js`, deliberately left in place rather than
ripped out. **Do not author new `chatlog` slides.** A recording of the same exchange teaches more.

---

## Trainer-example discipline

Binding rule from `CLAUDE.md` §A.5, and it applies to recordings as much as to text:

- **Product only.** Exclude anything about building *this course* — choosing the project, the agenda,
  the report structure, authoring tooling.
- **Drop trainer-stack specifics.** With darrisni this mostly stops being a problem: it *is* the
  trainee stack. As of 2026-09-25 no BookIt material survives in any deck, so this rule now only
  guards against reintroducing it.
- When unsure whether an excerpt qualifies, ask.

**One discipline, learned from the first recording: a step must match the delivered cut, not the
underlying session.** The real 8.1/8.2 session included a correction round — the trainer caught that
the ready-made prompt asked for one merged paragraph and had it split into two — but the trainer
edited that back-and-forth **out** of `tasks-81-82.mp4` on purpose, to keep the video from confusing
trainees with a mistake that no longer exists in the deck. A step authored from the written session
log alone (`conversation_history.md`/`PRODUCT.md`) can describe something that is true of the session
but not actually visible in the video that ships — check the frames at the step's own timestamp, not
just the transcript, before writing it.

**Separately, a recording can also show a wording the deck has since moved past** (a stale slide, not
an edited-out moment) — say so in a `stepvid__fix` note rather than re-recording. No current step
needs one; the note stays here as the pattern for when one does.

---

## Resolved: the §14 clone-and-replay question

**Moot — dropped.** The old plan deferred to Day 6 the question of whether §14 gets an incremental
BookIt clone-and-replay. It does not: §14 will be recorded on the live-session project like every
other section. The objection that killed it was always the stack (Maven, a two-server local setup,
native Postgres — none of which a trainee runs), and that objection stands regardless of feasibility.

**Also noted:** BookIt's deployment is down (Render free tier expired). It no longer matters — §16 is
taught on the course stack.

---

# Appendix — the BookIt inventory (historical)

BookIt is **no longer a showcase source, and no deck slide draws on it any more** (the last two,
Day-2 slides 13 and 14, were rebuilt on darrisni on 2026-09-25). This table is kept only because it
is an accurate map of what the repo holds. Use it as a reference, not as a plan.

| § | Verdict | Best artifact |
|---|---|---|
| **§8** MVP definition + scope | RICH | `PROJECT_REPORT.md:40-42` (problem/purpose/4 objectives) + `73-82` (three scope lists) |
| **§9** users + stakeholders | RICH | 3-role table `PROJECT_REPORT.md:56-60`, with the live correction at `conversation_history.md:250-254 → 266-270` deleting the separate Provider entity |
| **§10** requirements | RICH | 16 EARS requirements with priority, user story and Gherkin each: `PROJECT_REPORT.md:100-163` |
| **§11** journey + activity diagram | RICH | three journeys `PROJECT_REPORT.md:176-219` → `diagrams/consumer_booking_activity.drawio` |
| **§12** design | RICH prompts · PARTIAL screens | ten Claude Design prompts `PROJECT_REPORT.md:274-321`; only 4 reference screens survive |
| **§13** data model | RICH | `diagrams/erd.drawio` — 8 entities, drawn from the live `V1__init_schema.sql` |
| **§14** implementation | RICH | `implementation_plan.md:71-161` — M0–M6.3 maps onto tasks 14.1–14.7 |
| **§15** testing + security | PARTIAL | Report §9 is a stub; the RBAC curl matrix at `conversation_history.md:1064-1067` is real |
| **§16** deployment | PARTIAL | Report §10 never written; `render.yaml` and the Vercel project file are showable |

**Zero BookIt screenshots or recordings exist.** Any BookIt visual is net-new work.

The curriculum's «ما كتبه المدرب» collapsibles remain trimmed, translated BookIt excerpts:

| Collapsible | Lines in `bootcamp_roadmap_and_curriculum.md` |
|---|---|
| 8.1 steps 1–4 · the correction round | 1187–1216 · 1220–1234 |
| 8.2 steps 1–3 · the 3–5 limit | 1272–1287 · 1289–1296 |
| 9.1 steps 1–5 · the overlap question | 1380–1395 · 1414–1427 |
| 9.2 steps 1+3 | 1443–1460 |
