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
| `project-package/slides/media/deployment.mp4` | Tasks 16.1 + 16.2, end to end on darrisni | 3:22 | **Shipped** — Day-3 slide 9 |
| `project-package/slides/media/task-10.1.mp4` | Task 10.1 **and the FR half of 10.2**, on darrisni | 6:16 | **Shipped** — Day-3 slide 15 |

**Filenames are lowercase-hyphen** and the deck references them by name — see `MEDIA_SHOTLIST.md`.
The original of the above arrived as `8.1_&_8.2_tasks.mp4` and was renamed: `&` has to be escaped in
an HTML attribute, and no other asset uses underscores.

### Still to record

Everything else — Day 2 is now fully covered. §9 was recorded on **2026-09-25** and, with it, the
last BookIt material left the deck: Day-2 slides 12 and 13 were rebuilt on darrisni and slide 14's
`chatlog` was replaced by the recording.

**Day 3 — fully covered, no third recording.** §16's `deployment.mp4` arrived 2026-09-26 and §10's
`task-10.1.mp4` on 2026-09-28. Both were verified frame-by-frame (not from an auto-generated
transcript — see the appendix below for why that distinction mattered here) and are embedded with
real timestamps. A third recording for the 10.2 review round was considered and dropped on
2026-09-29 — reviewing written requirements turned out to be a plain read/note/feedback loop with
nothing demo-worthy in it, so its placeholder slide was deleted rather than left as `--soon`.

| File | Covers | Status |
|---|---|---|
| `media/deployment.mp4` | §16 — tasks 16.1 + 16.2, Vercel setup through first live link | **Shipped** (slide 9), delivered under this name rather than the planned `tasks-161-162.mp4` — renaming was free since nothing referenced the placeholder yet |
| `media/task-10.1.mp4` | §10 — task 10.1 **plus the FR-writing half of 10.2** | **Shipped** (slide 15), 6:16. Delivered wider than its brief, which said «must **not** show the formal requirement being written (that is Day 4)» — but Day 4 no longer owns that: the formats block and 10.2 moved to Day 3 in the 2026-09-28 rebalance, so the take is correctly scoped after all |

> **A take can outrun its brief and still be right — check the curriculum before re-cutting.**
> `task-10.1.mp4` violated an explicit "must not" in its own capture brief. The brief was stale, not
> the recording: the day boundary had moved underneath it. **When footage contradicts a shotlist
> entry, re-read the curriculum before assuming the footage is wrong.**

**§16 is watched, not re-run live** — deploying an already-deployed project produces nothing, and the
account steps happen once per person. This is the per-section exception documented in
`day-deck-recipe.md`; it applies again to §16.3 on Day 10.

**Day 4 — two of two recordings shipped.** Built 2026-09-30, the first Day-4 deck. Two slots, both on
darrisni, per `deck/MEDIA_SHOTLIST.md`:

| File | Covers | Status |
|---|---|---|
| `media/tasks-10.3-11.1-11.2.mp4` | §10.3 (NFR) then §11 — the NFR prompt, then the journey written and diagrammed | **Shipped 2026-10-01** (slide 9), 5:59, frame-verified, 14 steps. Delivered under a different name than planned — `task-103-11.mp4` was never referenced anywhere yet, so the rename was free |
| `media/task-7.11.mp4` | §7.11.3 — a skill authored end to end in Claude Desktop, then tested in a **second, different tool** | **Shipped 2026-10-02** (slide 16), 5:30, frame-verified, 13 steps. Delivered under a different name than planned — `skill-from-scratch.mp4` was never referenced anywhere yet, so the rename was free, same as d4-1 |

**The hard capture requirement — "the first test run must genuinely fail" — turned out not to be met,
and that is the correct outcome, not a miss.** The shot list asked for real footage of the skill's
description failing to trigger, planning a `stepvid__step--new` row on slide 16 around it, on the same
"a description is a guess until tested" reasoning already in `writing-requirements/SKILL.md` §5.1.1
from the Day-3 recording. The real second session — a plain, unnamed request, in a different tool
(Antigravity) than the one that built the skill — triggered correctly on the first try. Slide 16 was
rebuilt to match that footage, and the planned failure row was removed rather than kept as an
unsupported claim. **The lesson generalises in both directions: a recorded "it broke" beat needs real
breakage, and a recorded "it worked" beat needs an honestly unscripted test — not a staged one either
way.**

**§7.11 is a new kind of section for this showcase strategy: the recording teaches a general method
(authoring a skill), not a fixed curriculum task.** Unlike every other recorded section, the *specific*
skill demoed («جولة قبل العرض») is one menu option among eight — the recording's job is to prove the
six-slot method works end to end, not to be the only skill a trainee could plausibly build. Do not
generalise this exception to other sections without checking whether the same "one method, many valid
instances" shape actually applies.

**Day 5 — both recordings shipped.** Built 2026-10-03, filmed 2026-10-04/05. Two slots, split at the
tool boundary — §12 crosses two different tools (Claude Code writes the prompts, Claude Design
builds and generates), so the curriculum's single 46 د تطبيق row was split in two (18 + 28 د) to give
each its own recording and its own slide, per `deck/MEDIA_SHOTLIST.md`:

| File | Covers | Status |
|---|---|---|
| `media/tasks_12.1_12.2.mp4` | 12.1 (screen inventory extracted from §§3–4, trainee's three review passes + final gap) then 12.2 (Claude Code writes the design-system + per-screen prompts) | **Shipped**, 6:23, slide 13 (`demo-121-122`), 5 `data-t`-verified steps |
| `media/tasks_12.3_12.4.mp4` | 12.3 (build the Design System–type project) then 12.4 (generate 11 screens, select-system-first, copy-answers rule, batch hand-off) | **Shipped**, 7:06, slide 17 (`demo-123-124`), 7 `data-t`-verified steps |

**d5-2 was the first Day 1–5 asset recorded entirely inside a browser tool (Claude Design) rather
than an editor** — its capture setup (screen region, zoom level) differed from every prior recording,
which all showed an editor or terminal. Both files are gitignored (over GitHub's 100 MiB limit, same
convention as three earlier oversized recordings) — present on disk, not tracked in the repo.

**§12 is not a one-time/account-bound section**, so it does **not** get the "watched, not re-run"
treatment §16 and §7.11.3 get. The default interleaved pattern applies: explain → watch the recording
→ the trainer re-executes the same steps live — which is why the agenda's تطبيق rows (18 + 28 د) carry
no «يُشاهَد ولا يُعاد تنفيذه» note, unlike 7.11.3's row on Day 4.

**Day 6 — both shipped.** §13 نموذج البيانات (ERD) + §14.2 إنشاء الجداول. Two slots, split at the
§13/§14.2 boundary (the curriculum's own 20 د and 22 د تطبيق rows), per `deck/MEDIA_SHOTLIST.md`:

| File | Covers | Status |
|---|---|---|
| `media/tasks_13.mp4` | 13.1 (Claude extracts entities from §§2–5 with origins, closes four gaps live via `AskUserQuestion`, then — same continuous pass, no second prompt — completes the model: keys, relationship types, junction table, one-sentence explanation per entity, written to §6) → 13.2 (trainee's three review passes + final gap, shown as reading the rendered `Preview PRODUCT.md`) → 13.3 (draws the ERD via `drawio`, boxes expanded from the start with fields visible, no box-opening step, then a formatting/arranging pass) | **Shipped** 2026-10-06, 4:02, 7 `data-t`-verified steps, first at `0:00` |
| `media/task_14.2.mp4` | 14.2 (Claude discovers the Supabase MCP connection needs renewing this session rather than silently failing, writes the full plan ready to execute, trainee reconnects in one step, Claude inspects current state before creating, creates all seven tables and pushes, trainee verifies each real table in the Supabase dashboard) | **Shipped** 2026-10-06, 2:25, 6 `data-t`-verified steps + one `stepvid__step--new` row for comparing the diagram against the real tables and updating only the diff (not in this recording) — reworded same-day from an outright "redraw" instruction, which would have discarded any manual arranging done to the diagram |

**§13.1 mirrors §12.1's extract-then-verify shape** (entities are derivable from roles, requirements,
journey and screens already on record by Day 6), but the task boundary moved in a same-day review
before filming: 13.1 is everything Claude produces in one continuous pass (extraction through model
completion), and 13.2 is the trainee's review alone (the three passes + the final-gap question). The
real footage confirmed this shape. **§13 is not one-time/account-bound either** — same default
interleaved treatment as §12, no «يُشاهَد ولا يُعاد تنفيذه» note on its agenda rows.

**Day 7 — both shipped.** §14.3 الأدوار والصلاحيات + §14.4 تصفّح المحتوى والصفحة الرئيسية. Two
slots, split at the curriculum's own تطبيق sub-durations (25 د · 27 د), per
`deck/MEDIA_SHOTLIST.md`:

| File | Covers | Status |
|---|---|---|
| `media/task_14.3.mp4` | 14.3 (Claude reads roles/permission-requirements/screen-access from §§2–3–5, enters plan mode, a first migration attempt comes back "declined" and Claude pauses to ask rather than retry blindly, resolves it as Supabase's own automatic safety warning, writes per-role RLS policies and server-side checks, tests via bash/chrome-devtools, delivers the two-part report, logs in as a role to confirm the restricted view) | ✅ Shipped 2026-10-07, 2:13 |
| `media/task_14.4.mp4` | 14.4 (the `/design-sync` failure and its recovery, filmed as it happened: an invented design rejected by the trainee → two wrong errands (`/design-login`, `/design-sync`) → the manual per-screen download that actually works → a catch-up full-system pull, repeated a second time for `/book` → the two finished pages → the clip's one terminal moment (4:13–4:18) → its real ending, a 404 on the not-yet-built booking-confirmation page. Four `stepvid__fix` notes mark the beats the corrected instructions now prevent) | ✅ Shipped 2026-10-08, 4:34 — **gitignored, 157.3 MiB**, 16 `data-t` steps, corrected same-day against the raw footage |

**⚠ A recording can document a defect the package has since fixed — label it, don't re-cut it.**
`task_14.4.mp4` is the only Day-1–7 clip whose first half shows behaviour the trainee must *not*
copy. The fix is four `stepvid__fix` amber notes naming each specific beat, not suppressing the
footage: the recovery is itself the lesson (a trainee rejecting output that doesn't match their
design is exactly the review behaviour §14 asks for). When a future correction invalidates part of a
shipped clip, do the same — amber-note the beat, keep the clip.

**§14.3 and §14.4 are not one-time/account-bound** — same default interleaved treatment, no «يُشاهَد
ولا يُعاد تنفيذه» note. Run the test explicitly rather than inheriting it from Day 6: a second live
run of either task on a different project produces a different, informative result every time
(different roles, different screens), exactly the shape the test requires for the default treatment.

**⚠ Day 7's role check can only be partially verified on Day 7 — carry the rest forward, don't drop
it.** The restriction is genuinely built and server-side-enforced on Day 7 (14.3), but through Day 7
only `/`, `/book`, `/signup`, `/login`, and a placeholder `/dashboard` exist — the role-specific pages
a trainee would need to "open a page forbidden to another role" don't arrive until 14.5 (Day 8) and
14.6 (Day 9). Before then, attempting that check returns **404 — not built**, which looks identical
to **403 — not allowed** through the UI-only review the package requires (no code, no tests). Verified
directly against the shipped footage: `task_14.4.mp4` ends at 4:32–4:33 on `/book/confirm?…` returning
404, not a permission result.

So the Day-7 deck (slides 13/19/20) establishes the idea and names the 404-vs-403 test, honestly
scoped to what Day 7 can verify. **Days 8, 9 and 10 each carry the check forward for whatever that
day just built** — Day 8 (14.5) is the first journey pages, Day 9 (14.6) is the first page that
genuinely differs by role, and Day 10's §15.3 is the **first full matrix run** (every role against
every page), not a recap of Day 7. When building those decks: write each day's role-check beat as
genuine first-time execution against that day's new pages — never as "remember from Day 7," which
would silently drop the days 8–9 steps and leave §15.3 looking redundant instead of cumulative.

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

## A correction can be as unverified as the bug it fixes

`deployment.mp4`'s first review pass (2026-09-26) was written from an auto-generated step-by-step of
the footage, without extracting a single frame. It got real things wrong in both directions: it
mis-attributed a manual, human-typed CLI install to Claude, and it flagged root directory and
production keys as unconfirmed when both are directly evidenced on screen (a live login on the
deployed URL greeting the trainer by his own email does not happen without a working database
connection). The fix was corrected a second time, this time against extracted frames, before slide 9
was time-stamped. **A correction is a claim too — it needs the same frame-level evidence a bug report
does, not just confidence that it sounds more careful.**

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
