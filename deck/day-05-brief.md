# Day 5 — deck brief

The slide-by-slide record of `project-package/slides/day-05.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §12 plus §7.8. If this
brief and the curriculum disagree, the curriculum wins.

**23 slides.** Built 2026-10-03, the first Day-5 deck — no earlier version existed. Unlike Day 4,
the curriculum content for this day was already complete (§12's concept, task table, 12.1–12.4 with
steps/نفّذها أنت/راجع نتيجتك/collapsibles, §7.8, and §2.5 already balanced to 215 د inside every
published §1.1 range) — so this build was mostly the deck itself, plus three gaps the exploration
pass surfaced before any slide was written.

**Reshaped same day, before either recording was filmed (see "§12.1 reshaped" below): 20 → 21
slides.** §12.1 originally asked the trainee to hand-write a screen-by-screen inventory — the one
remaining task in the whole course where the trainee produced a formal artifact by hand. Changed to
extract-then-verify: Claude derives the screens from the journey (§11) and requirements (§10), the
trainee reviews in three passes and completes the gaps. Slide 8 rewritten, slide 9 added.

**Corrected again the same day, still before filming (see "§12.1 corrected" below): 21 → 23
slides.** The reshape above got the core idea right but shipped with the review pass's third check
describing an actor-state that hadn't happened yet, and with no dedicated place for the task's actual
highest-value moment. Pass 3 flipped from "does a screen *you* added have an origin" (nothing has been
added at this point) to "trace each extracted screen back to its origin" (a real verification check).
A new pair of slides was added for what only the trainee can give: visual identity, done properly
(colors as hex codes in priority order, not a palette image; a font; an explicit RTL/LTR question),
and an explicit elicitation prompt for anything still only in the trainee's head.

**Corrected a second time, same day, still before filming (see "§12.1's gap list closes
interactively" below): still 23 slides, text-only.** The gap list the extraction step produces (steps
or requirements with no screen) was being displayed and left for the trainee to resolve unaided —
exactly the manual-matching burden extract-then-verify was built to remove. Fixed by having Claude
ask about each gap immediately, with suggested resolutions, in the same turn — closing it on the
spot instead of listing it. Slide 11's addition rule was also rewritten: the original sentence
compressed two different cases (an addition that's part of an existing screen vs. one that's a whole
new screen) into one run-on clause without ever naming the test that tells them apart.

**Day 5 budget:** شرح المفاهيم 40 د · تطبيق مع المدرب 62 د · عمل المتدربين 88 د · مراجعة وعرض
التقدم 25 د = **215 د** (+ استراحة 25 د). No duration widening needed anywhere.

**No new package skill.** `designing-screens/SKILL.md` (119 lines, pre-existing) already covers all
four §12 tasks, the DesignSync limits, the copy-answers rule, and link-vs-download — nothing to add.

---

## Three gaps fixed before the deck, not after

**1. Day 1's deck pointed trainees to the wrong day, six times.** The days 3–7 rebalance (a prior
session) moved §7.7/§7.9 to Day 4 and §7.8 from Day 7 to Day 5, but `day-01.html`'s six forward
references were never updated — a trainee following Day 1 would have been told rules/skills are
"Day 5" (actually Day 4) and the context window is "Day 7" (actually Day 5, this deck). Fixed at
`day-01.html` lines ~444, ~452, ~1397, ~1609, ~1615, ~1620, plus the matching rows in
`deck/DECK_BRIEF.md`. Verified: `day-01.html`'s `deckAudit()`/`deckRefAudit()` still both return `[]`
after the edit.

**2. `PRODUCT.md` §5 had nowhere to put what §12 produces.** 12.4's review step says «احتفظ بروابط
شاشاتك» and `designing-screens/SKILL.md` §5 sends screen links to §5 — but the section only offered
two free-text fields (الشاشات، ملاحظات بصرية). Added two more: **رابط نظام التصميم** and **روابط
الشاشات المولّدة**, plus a **قواعد إلزامية** field for RTL-type requirements, matching the structure
`bootcamp-mvp-process.md` §5.2 requires (Arabic-opening lines, `<br>`-separated). Applied identically
to `trainee-test/PRODUCT.md`, whose §5 was still the untouched empty template.

**3. The handout (`deck/handout/index.html`) was stale for Days 3, 4 and 5** — a known, previously
accepted gap (`conversation_history.md:6615` records a deliberate "leave it alone" decision from the
days 3–7 rebalance). **That decision is overridden here**, at the user's explicit instruction: full
reconcile across all three days, both the short `dayc` summary cards and the detailed per-session
agenda blocks, matched against the current curriculum durations and rows.

---

## The one curriculum edit this deck required

§2.5's تطبيق مباشر مع المدرب had a single 46 د row spanning all four tasks
(`12.1 ← 12.2 ← 12.3 ← 12.4`). §12 crosses two different tools — Claude Code writes the prompts
(12.1, 12.2), then Claude Design builds and generates (12.3, 12.4) — and one continuous recording
across both would be the longest asset in the course. **Decided with the user: split into two
recordings at the tool boundary.** The curriculum row was split to match: `12.1 ثم 12.2 — 18 د` and
`12.3 ثم 12.4 — 28 د`, summing to the same 46 د, so the session total stays 62 د and the day stays
215 د. Nothing else in §2.5 or §12 changed.

---

## §12.1 reshaped: extract-then-verify, not hand-transcription

Reasoned through with the user before either Day-5 recording was filmed — the cheapest possible
moment, since afterward it would be a re-shoot.

**The problem.** 12.1 asked the trainee to hand-write, per screen, its name · path · who reaches it.
Three things in the package already said this was wrong: `bootcamp-mvp-process.md` §7 ("لا تطلب منه
أن يكتب الصيغ الرسمية بنفسه"); `PRODUCT.md` marks every other derived section "يملؤه Claude" except
§5's الشاشات field; and Day-1's own task-map legend defines «تراجع وتصحّح» as exactly what 12.1
should have been. The derivation is mechanical — §11 is a strict numbered journey, §10 is EARS with
flat ids — so hand-writing it mixed transcription with gap-finding in one pass, and transcription won
because it feels finishable, starving the actually valuable part (what's missing).

**The change.** Claude extracts the screens; the trainee reviews in three passes (journey→screens,
requirements→screens, any added screen traces to an origin) and gives visual identity. Per-screen
fields grew from three to five: name, path, **entry path** (new — a short sequence, not a full
journey retelling), who-accesses, and **sections** (new — name + one line only; full detail stays in
12.2). Claude's output must carry four parts, not a bare list: the screens with origins, **the gap
list** (the load-bearing part — journey steps/requirements with no screen), flagged assumptions, and
an explicit "bounded by your sources" statement. The old traceability rule ("every screen needs an
origin") inverted: it's now a test applied only to screens the *trainee* adds, since extracted ones
trivially pass. An AskUserQuestion threshold was set to avoid rebuilding the manual burden one
question at a time: ask only when the answer changes the screen *set* (does it exist, one screen or
two); everything else gets decided and logged as a flagged assumption.

**12.1/12.2 boundary.** Section *identification* (the list, with research into page conventions like
landing-page ordering) stays in 12.1; section *detail* (order within the screen, content, states, and
any further research specific to that detail) moved to 12.2 — a deliberate split, not a duplication.

**Deck consequence.** Slide 8 rewritten around the five fields + gap list + bounded-by-sources
warning; a new slide 9 added for the trainee's three review passes + visual identity (20 → 21 slides,
per A.6.2's "deliberate, requested" bar for growing slide count). Slide 10 (12.2) and slide 11
(demo-121-122's step rows) updated to match. `designing-screens/SKILL.md` and `PRODUCT.md` §5
(both repos) rewritten to match; `PRODUCT.md`'s الشاشات field became a 5-column table instead of a
single free-text line.

---

## §12.1 corrected: pass 3 named the wrong actor, and the task's real point was never stated

Caught by the user in direct review of the reshape above, same day, still before filming.

**Defect 1 — pass 3 described an action that hadn't happened yet.** The reshape's third review pass
read «أي شاشة أضفتها ← لها أصل؟» ("does a screen *you* added have an origin"). At the point this pass
runs, the trainee has added nothing — they are reviewing Claude's extraction. "Who added the screen"
at this moment is Claude, not the trainee, so the pass was asking about a flow-state that hadn't
occurred. **Fixed by flipping the direction**: passes 1–2 are forward checks (source → does it have a
screen?); pass 3 is now a backward check (screen → does the source Claude cited actually hold up?) —
tracing every extracted screen's claimed origin to confirm it's real, not trusting it silently.
Separately, **origin became its own explicit sixth field** per screen (one or more journey steps
and/or requirements, explicit or implicit) rather than an internal tag Claude kept to itself — slide 8
never listed it as something the trainee could see was being extracted.

**Defect 2 — the task's actual value was never asked for.** Reviewing Claude's extraction for
correctness matters, but it was never the main reason 12.1 is worth the trainee's time. The highest-
value moment is the trainee noticing **what's still only in their own head** — a screen, section, or
detail never written into the journey or requirements — and saying it explicitly, before any design or
code exists. Nothing in the shipped reshape asked for this; the task ended at "review what Claude
found." **Added as a new, explicitly-labeled section** coming after the three review passes, framed as
"two things only you can give, Claude cannot produce them": (a) visual identity, done properly —
colorhunt.co or a copyable search-phrase snippet for a palette, **hex codes recorded in priority
order, never a palette image** (an image forces Claude to guess codes and leaves priority ambiguous
from pixel proportions), an alternate path via coolors.co/image-picker for a trainee's own image,
fonts.google.com for a font, and an explicit RTL/LTR question (each term gets an inline `.qmark`
definition, reusing the existing component rather than inventing a new icon); and (b) the elicitation
step itself — the real point of the task.

**Where the old pass-3 logic actually belongs.** "A screen without an origin needs a justifying
requirement" didn't disappear — it moved to sit next to the elicitation step, where a trainee-added
screen is a real thing that can happen, instead of living in the review passes where it never applied.

**Deck consequence.** Slide 8 gained the origin field (sixth list item) and its first `.promptbox` —
the curriculum already had a ready extraction prompt in نفّذها أنت, but the deck itself had none.
Slide 9's pass 3 reworded; its visual-identity closing card removed entirely (moved out) and replaced
with a concrete origin-tracing example card to keep the frame from reading sparse once the card left.
**Two new slides** added — `task-121-identity` (colors/font/RTL-LTR) and `task-121-gap` (the
elicitation prompt, plus a closing bridge line into 12.2) — sharing one badge text ("جزءان منك أنت
وحدك") so they read as one conceptual unit despite being two slides (21 → 23). `demo-121-122`'s
stepvid step count grew from 4 to 5 to narrate the corrected flow; its step list now scrolls inside its
fixed-height panel (`.stepvid__list`'s existing `overflow-y: auto`, a deliberate house pattern, not a
new one) rather than overflowing the slide.

---

## §12.1's gap list closes interactively, and slide 11's addition rule gets a named test

Caught by the user in direct review of the corrected reshape above, same day, still before filming.
Text-only fix — 23 slides stays 23.

**Defect 1 — the gap list was a dead end, not a resolution.** `SKILL.md` §1.2 and slide 8 both told
Claude to produce the gap list (every journey step or requirement with no matching screen) and show
it to the trainee — but neither said what happened to it next. As written, the trainee was left to
notice each gap and work out, unaided, whether it needed a new screen, a section on an existing one,
or nothing at all — silently re-creating the exact manual-matching burden extract-then-verify was
built to eliminate. **Fixed by having Claude ask, immediately, in the same turn that produces the
extraction and the gap list:** a direct question per gap with 2–4 suggested resolutions
(`AskUserQuestion`), not a list left for later. New `SKILL.md` §1.3 makes this explicit, inserted
right before the existing "when to ask at all" rule (old §1.3, now §1.4) — a gap, by definition,
changes the screen set, which is already that rule's trigger condition for asking. Subsections
§1.4–§1.7 renumbered to §1.5–§1.8 accordingly.

**This also re-scopes what "الفجوة الأخيرة" (§1.8) actually is.** Before this fix, nothing
distinguished a gap Claude could detect from existing data (a step or requirement with no screen) from
something the trainee alone could supply (never written anywhere). Now that the first kind closes on
sight in §1.3, §1.8 is correctly narrowed to the second kind only — and passes 1–2 of the trainee's
three-pass review (slide 9) should normally come back clean, since any gap they'd otherwise surface
was already resolved at extraction time. `SKILL.md` §1.6 now says so explicitly.

**Defect 2 — slide 11's addition rule was obfuscated.** "أي شيء تضيفه يحتاج أصلًا — إن خدم شاشة موجودة
فأضِفه قسمًا لها، وإن كان شاشة جديدة فاربطها بمتطلّب..." compressed two different cases into one
run-on clause without ever naming the test that tells them apart — a trainee reading "إن خدم شاشة
موجودة" had no way to judge whether what they were picturing qualified. **Fixed by naming the actual
test:** does this open at its own URL as a page in itself (→ a new screen, needs a requirement), or is
it just more content inside a screen that already exists (→ a section, whose origin is that screen)?
Same fix applied to the curriculum's parallel paragraph and to `SKILL.md` §1.5's "حالة 2", so all
three surfaces state the same test.

**Deck consequence.** Slide 8's `.card--state` note and its `.promptbox` (both the visible text and
`data-copy`) reworded to ask about each gap immediately rather than just listing it. Slide 11's
warning card rewritten with the two-case test. `demo-121-122`'s step 1 description updated to match.
No slide added or removed — both fixes are text-level corrections to existing cards, verified by
`deckAudit`/`deckRefAudit` (`[]`) and a fresh screenshot of slides 8, 11, and the demo slide.

---

## Slide 17 filmed: `tasks_12.3_12.4.mp4`, and a real-vs-taught discrepancy surfaced

The 12.3+12.4 recording came in at 7:06 — considerably more than the placeholder's guessed two-screen
demo. Reading it properly (two-pass, per `SKILL.md` §5) surfaced two things worth recording.

**The real recording generates eleven screens, not "a second screen."** The placeholder step list
(ported from slide 13's shape before filming) described 12.4 as "repeat the same steps on a second
screen, and it comes out consistent with the first" — a reasonable guess for an unfilmed task, but the
actual video shows the full inventory being built out: Home, Book Session, Tutor Profile, Booking Page,
Login, Signup, My Sessions, My Schedule, Admin Dashboard, Admin Subjects, and one more — eleven in
total, a number not guessed but read directly off Claude Code's own closing message ("12 أمرًا كاملة
(نظام + 11 شاشة)"). The step list grew from 5 to 7 to represent this honestly: steps 1–2 cover 12.3
(create the system, review it), steps 3–4 cover the *shape* of one 12.4 iteration (new conversation,
paste the screen's command), step 5 names the repetition explicitly instead of implying a single
"second screen," and steps 6–7 cover a closing phase the placeholder didn't anticipate at all.

**That closing phase is where the recording diverges from what slides 15–16 actually teach.** Slide 16
prescribes a per-screen handoff: finish one screen, immediately give Claude Code its link and any
Claude Design Q&A answers via the `.promptbox` phrasing, then move to the next screen. The recording
does something different — all eleven screens are generated first (with the trainee privately tracking
each conversation's name and link as they go), and only once every screen is done does a single message
ask Claude Code to write all eleven names and links into `PRODUCT.md` §5 **at once** ("دفعة واحدة"),
rather than one at a time. Claude Code then opens a browser preview via chrome-devtools to confirm the
written command blocks render correctly under RTL, closes it, and only then commits and pushes.

Slide 17 is a documentary demo slide, not a prescriptive one — the same way slide 13's step 2 shows the
trainee reconsidering the extraction plan three times rather than a clean single pass — so the step list
here describes the batch handoff exactly as filmed, without reconciling it against slide 16's per-screen
rule. **That reconciliation is a judgement call for the person running the bootcamp, not something to
resolve silently inside a deck edit:** either the batch approach is the better technique and slide 16
should be loosened to allow it, or the per-screen rule is deliberate (catches a missed answer earlier,
before eleven screens have drifted) and the recording is a counter-example worth a note. Flagged here
rather than decided.

**ffmpeg's seek-resets-PTS hazard (`SKILL.md` §5, third documented case) struck again on this file.**
Early contact sheets built with `-ss <t> -i …` produced labels that looked plausible and internally
consistent across a whole sheet — and were wrong, the same failure mode already seen on
`tasks_12.1_12.2.mp4`. Caught the same way: a `showinfo` cross-check on a nonzero offset returned
`pts_time:0`. Every contact sheet and every one of the 7 final timestamps was rebuilt or verified using
`trim=start=X:end=Y` (continuous decode, true PTS) before being written into `data-t`. No new write-up
needed in `SKILL.md` — the existing third bullet already generalizes past the specific filename.

**Deck consequence.** Slide 17's `stepvid__video--soon` placeholder replaced with the real
`<video>` element; all 5 placeholder steps replaced with 7, each carrying a verified `data-t` and a
`.stepvid__time` button instead of an ordinal badge. No slide added or removed (23 stays 23); verified
by `deckAudit`/`deckRefAudit` (`[]`) and seeking the video to each of the 7 timestamps in a live page,
confirming the visible frame matches the step's own description.

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم الخامس | `sag-title` dark | — | |
| 2 | مهامّ اليوم: شرح (40 د) + تطبيق (62 د) | 2 × `.sess` | — | Rows verbatim from §2.5, including the new 18+28 د split |
| 3 | مهامّ اليوم: عمل (88 د) + مراجعة (25 د) | 2 × `.sess` | — | The curriculum's single combined 83 د عمل row rendered as four separate task rows (one per 12.1–12.4) for readability — same durations, finer granularity than the curriculum's own line-wrapping |
| 4 | أهداف اليوم | 3 cards | — | نظام تصميم متكامل / شاشات مولّدة / تدير جلساتك (the §7.8 goal folded in, since Day 5 is where it lands) |
| 5 | §12 — الأدوات الثلاث | 3 cards + `؟` on مكوّنات | `s12-concept` | Claude Design / نظام التصميم / DesignSync, each glossed as *what it is · what it does · when you'd use it* |
| 6 | §12 — حدود DesignSync | ✔/✘ 2-card bento + warning card | `s12-sync` | **The load-bearing slide.** Components transfer automatically; generated screens never do; the irreversible reason (project type fixed at creation) gets its own warning-bordered card |
| 7 | §12 — مهامّ هذا القسم | 4-card bento | `s12-tasks` | Each of the four tasks framed by **where the trainee stands**, not just who executes it — per the deck's "never label a task by who performs it" rule, since §12 is the one section where the executor split is itself the content |
| 8 | المهمة 12.1 — Claude يستخرج شاشاتك | lead + 2-card bento + load-bearing `.card--state` (gap list + bounded-by-sources, merged into one) + `.promptbox` | `task-121` | Six fields now (origin added); the `.card--state` note now says each gap gets an immediate question with suggested resolutions, not a list for later; `.promptbox` prompt updated to ask Claude to question the trainee about each gap on the spot |
| 9 | المهمة 12.1 — دورك: ثلاث مراجعات | 3-card bento + `.card--state` (origin-tracing example) + tip card | `task-121-review` | Pass 3 corrected to «الشاشات ← أصلها» (backward trace, verifying Claude's claimed origin); the old visual-identity closing card removed entirely (moved out) and replaced with a concrete example card so the frame doesn't read sparse |
| 10 | هويّتك البصرية — ثلاثة قرارات ما يقدر Claude يأخذها | full-width `.card--accent` (colors, 2 `.snipbox` search phrases) + 2-card bento (font; RTL/LTR with two `.qmark` terms) | `task-121-identity` (new) | **New slide.** colorhunt.co or a search snippet, hex codes in priority order never an image, coolors.co/image-picker as the own-image path, fonts.google.com, and an explicit RTL/LTR question |
| 11 | الفجوة الأخيرة — أهمّ سؤال في هذه المهمّة | lead + `.card--accent` (the question) + example card + warning card + `.promptbox` + closing `.card--state` bridge | `task-121-gap` (new) | **New slide — the task's actual point.** Explicit elicitation of anything still only in the trainee's head; the old "trainee-added screen needs an origin" logic now lives here, where it actually applies. Warning card rewritten with a named test (own URL → new screen needs a requirement; lives inside an existing screen → a section, no separate origin needed) replacing a compressed, hard-to-parse version of the same rule |
| 12 | المهمة 12.2 — إعداد الأوامر | 1 card (2 steps) + tip card (detail-research, narrowed from list-research) + prompt card | `task-122` | "You don't write the commands" framing; research narrowed to section *detail* now that the section *list* is 12.1's |
| 13 | ▶ المقطع: 12.1 + 12.2 | `stepvid`, real `<video>` | `demo-121-122` | **Filmed and wired up** (`media/tasks_12.1_12.2.mp4`, 6:23). 5 timestamped steps across 2 dividers, each `data-t` verified against an extracted frame: 0:18 (first `AskUserQuestion`), 1:38 (extraction plan ready for review — where the three-pass review actually happens), 2:08 (visual identity asked, final gap deferred), 5:00 (final gap answered, hand-off to 12.2 in plan mode), 5:30 (Claude's 12.2 plan). Step list still scrolls inside its fixed panel, the same pre-existing house pattern |
| 14 | المهمة 12.3 — بناء نظام التصميم | lead + 1 card (4 steps) + tip card | `task-123` | Design-System project type, fixed at creation |
| 15 | المهمة 12.4 — توليد الشاشات | 1 card (3 steps) + warning card (copy-answers rule) + example card | `task-124` | The mandatory copy-answers rule with its *why* (Claude Code only knows what it asked for) |
| 16 | كيف توصل شاشتك إلى Claude Code | lead + 2-card bento + tip card + `.promptbox` | `task-124-handoff` | Link-by-default, download-when-triggered — no longer the deck's only `.promptbox`, now joined by slide 8's and slide 11's |
| 17 | ▶ المقطع: 12.3 + 12.4 | `stepvid`, real `<video>` | `demo-123-124` | **Filmed and wired up** (`media/tasks_12.3_12.4.mp4`, 7:06). 7 timestamped steps across 2 dividers — up from the placeholder's 5 ordinal badges, because the real recording showed more distinct beats than guessed: 0:16 (design-system command pasted), 0:40 (reviewing tokens/components/states), 1:04 (new conversation, design system auto-attached), 1:16 (first screen's command pasted from `PRODUCT.md` §5), 2:56 (the same two steps repeated across the rest of the inventory — 11 screens shown), 6:40 (batch request: write every screen's name+link into `PRODUCT.md` §5 at once), 6:56 (Claude Code verifies the written commands render correctly under RTL via chrome-devtools, then commits and pushes). Each `data-t` verified against an extracted frame |
| 18 | §7.8 — نافذة السياق والضغط | lead + 2 cards + `.snipbox` (`/compact`) + tip card | `s78` | Placed **last** in شرح, after both recordings — lands right before 88 minutes of unsupervised multi-conversation work, where the trainee will actually feel it. No gateway example: by Day 5 the trainee has already lived "sessions getting longer" (§2.5's own goal line), so the definition lands cold |
| 19 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 20 | دورك الآن | 2 × `.sess` nested + note | `your-turn` | Split "جهّز شاشاتك وأوامرها" (25 د: 12.1+12.2) / "ابنِ وولّد شاشاتك" (63 د: 12.3+12.4+push) — mirrors the tool boundary established on slides 2, 12–17; 12.1's row label reworded to "راجع جرد شاشاتك وأكمله" |
| 21 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 22 | مخرَج اليوم | 3 cards + tip card (real trainer anecdote) + quote | `day-review` | Consistency, RTL, and "your design is a reference, not a finished deliverable" — closing with the real trainer story of finding five pages of drift between the design and the built code |
| 23 | غدًا — اليوم السادس | `sag-closing` dark | — | Points forward to §13 نموذج البيانات (ERD) + §14.2, framed as "the data behind the screens you designed today" |

---

## What the build caught — worth keeping

- **A `qmark` button must contain only the `؟` glyph — putting the labelled word inside it breaks
  layout.** Slide 5's first draft wrote `<button class="qmark">مكوّنات؟</button>`, which rendered the
  whole word inside the small circular badge and visually collided with the text below it. Every
  correct precedent in the codebase (`day-02.html`) keeps the word as plain text *before* the button
  and gives the button only `؟`. Caught by screenshot, not by any audit script — `deckAudit()` only
  checks overflow, not malformed-looking components. **Grep any new `class="qmark"` for more than one
  character between its tags before trusting a screenshot-free review.**
- **Sparse slides are a silent failure the overflow guard cannot catch.** Slides 7 and 12 first
  shipped as a bare `.flow` ordered list and a two-card row respectively — both legal, both
  `deckAudit()`-clean, and both visibly under-using the frame when screenshotted. `deckAudit()` only
  flags overflow; it says nothing about a slide using 30% of its vertical space. Fixed by converting
  slide 7's list into a 4-card bento (richer, not longer) and adding a concrete example card to
  slide 12. **A clean audit is necessary, not sufficient — screenshot every new slide and judge
  density by eye, per A.6.2.**
- **A "watched, not re-run" exception does not generalise to every recorded section — it has to be
  re-earned per section.** §7.11.3 (Day 4) and §16 (Days 3, 10) get it because a second performance
  is either account-bound or produces no new information. §12's recordings do not qualify: Claude
  Design generation is neither one-time nor account-bound, so the default interleaved pattern
  (explain → watch → trainer re-executes live) applies, and the agenda rows carry no "watched only"
  note. Checked explicitly against `day-deck-recipe.md`'s stated test ("would a second performance
  produce new information") before assuming the exception carried over from Day 4's neighbouring
  section.
- **A standing "leave it alone" decision is not permanent — it is a decision made under a specific
  scope, and a later explicit instruction can override it.** `conversation_history.md:6615` recorded
  a deliberate choice to leave `deck/handout/index.html` stale because it sat outside that session's
  scope. This session's user instruction explicitly asked for the full reconcile, which is not a
  contradiction of the earlier note — it is a new, in-scope decision superseding an old out-of-scope
  one. Recorded here so a future pass does not misread the old note as still controlling.
- **A curriculum task row's own internal `·`-separated sub-durations are a legitimate cue to render
  as separate slide rows, not a reason to cram one wide row.** §2.5's عمل session lists
  `12.1 15 د · 12.2 10 د · 12.3 12 د · 12.4 46 د` as one curriculum line, but the content's own
  structure (four named amounts) reads better as four `.task` rows on both the agenda slide and the
  `your-turn` checklist — same total, same tasks, just not force-fit into one row's `task__t`/`task__d`
  pair. Matches the precedent of how every other combined curriculum row ("12.1 ← 12.2 ← 12.3 ← 12.4")
  was already being split visually elsewhere in prior days' decks.
- **A task that makes the trainee hand-produce a formal artifact is a design smell worth catching
  even after a section ships clean.** 12.1 passed every review this build ran — register sweeps,
  `deckAudit()`, screenshots — because "write down your screens" reads as ordinary instructional
  prose. What caught it wasn't any check in this skill; it was noticing the *shape* matched a rule the
  package states elsewhere (`bootcamp-mvp-process.md` §7) and that `PRODUCT.md` itself flags every
  other Claude-derived section but not this one. **The data to do the extraction automatically — a
  structured journey (§11) and EARS requirements (§10) — already existed upstream; the manual step was
  there only because nobody had looked for it.** Re-shaped into extract-then-verify before either
  recording was filmed. Worth re-checking any future section the same way: not "does this pass the
  deck's own rules" but "could the trainee's structured upstream data make this step unnecessary."
- **A reversed rule needs its trigger restated, not just its content.** "Every screen needs an origin"
  kept its exact wording across the reshape, but its effective meaning flipped: before, it was a live
  check on every screen the trainee wrote; after Claude extracts first, it is dead weight unless
  re-scoped to screens the trainee *adds*. A rule can look unchanged in a diff and still have silently
  stopped doing anything — check what population a rule actually fires against, not just its text,
  whenever the step producing its inputs changes. **This same mistake shipped again one turn later**,
  in the very reshape meant to fix the first instance of it — the "did you add this screen" pass-3
  wording was carried straight through to the new flow without checking whether the trainee had
  actually done any adding yet at that point. Catching the pattern once does not inoculate against
  writing it again; the check is "what has actually happened by this step," asked fresh every time a
  flow is restructured, not "does this match what I already know to avoid."
- **Reviewing an AI's output and stating what you alone know are different kinds of value, and a deck
  can present only the first while believing it covers both.** The reshape added real review structure
  (three passes, a gap list, an origin field) and genuinely improved 12.1 — but every bit of it was
  about checking Claude's work. Nothing asked the trainee to say what was never in the source data to
  begin with, which is the one thing no amount of extraction quality can produce. The fix wasn't making
  the review better; it was adding a question that doesn't resemble review at all. **When a task's
  stated purpose is "the trainee's input matters here," checking for review steps is not the same as
  checking for an actual elicitation prompt** — a deck can satisfy the former completely and still omit
  the latter entirely.
- **The "info" affordance a plain-language request describes often already exists under a different
  name.** Asked for "an icon that explains RTL and LTR," the literal reading suggests a new UI element;
  the actual need — click a marker next to a term, see its definition — is exactly what this deck's
  `.qmark` + `<template class="terms">` component already does, used once before on this very day's
  slide 5. Reusing it was faster and more consistent than building a second mechanism that would have
  done the same job with different markup. Before adding a new component for a described interaction,
  check whether an existing one already produces that interaction under different words.
- **A contact sheet that "looks internally consistent" is not the same as being correct.** Filming
  `tasks_12.1_12.2.mp4` surfaced a third variant of the stepvid-timing hazard already documented twice
  in `SKILL.md` §5: `ffmpeg -ss <t>` resets the decoded PTS to ~0 on this file, so a `drawtext` overlay
  burned onto a seeked contact sheet shows labels that are strictly increasing and plausible-looking —
  and simply wrong, by an amount that drifted between invocations. Several sheets were read with real
  confidence (content matched expectations, labels never jumped backwards) before a deliberate
  `showinfo` check caught the reset outright. Switching to `trim=start=X:end=Y` (no seek, true PTS
  preserved) fixed it. **Internal consistency of a measurement is not evidence of its correctness** —
  only cross-checking against a source that cannot share the same failure mode is.
- **Producing the right list is not the same as resolving what's on it.** The gap list (steps or
  requirements with no screen) was itself correct — Claude really can detect these from existing data —
  but displaying it and moving on quietly handed the resolution work back to the trainee anyway, the
  exact burden extract-then-verify existed to remove. The fix wasn't a new check on the list's
  *content*; it was asking what happens to each item immediately, in the same turn, instead of after.
  **A list produced for someone to act on later is not the same as acting on it with them now** — even
  when the list itself was the right thing to produce, stopping there quietly reintroduces the manual
  step one level up.
- **A compressed sentence can hide an undefined test, not just read awkwardly.** Slide 11's addition
  rule ("if it serves an existing screen, add it as a section") sounded reasonable on a fast read, but
  it never stated *how* to tell whether something "serves" an existing screen — the actual
  distinguishing test (does it open at its own URL, or does it just add to a screen that's already
  there?) was missing entirely, not just unstated plainly. A.6.3's "never compressed" check isn't only
  about register — reading a sentence back and asking "could I apply this rule to a new case right now"
  catches missing tests that reading it for tone alone does not.
