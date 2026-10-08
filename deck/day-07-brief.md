# Day 7 — deck brief

The slide-by-slide record of `project-package/slides/day-07.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §2.7 for the agenda, §14's
المهمة 14.3 and المهمة 14.4 for task content. If this brief and the curriculum disagree, the
curriculum wins.

**21 slides.** Built 2026-10-06, the first Day-7 deck — no earlier version existed. Preceded by three
rounds of research (curriculum §2.7 + the two tasks' full content, the complete Day-6 mistake record
across `day-05-brief.md` and `day-06-brief.md`, and the package-side state: `building-features/
SKILL.md` §د/§هـ, `PRODUCT.md` §7, `/design-sync`'s ownership and failure modes) per the user's
explicit instruction not to repeat Day 6's mistakes.

**Day 7 covers exactly two curriculum tasks — 14.3 الأدوار والصلاحيات and 14.4 تصفّح المحتوى والصفحة
الرئيسية** — both in §14, both already classified «تجرّب وتعدّل» in Day 1's 29-task map. No §15
content (that is Day 10). No §7.x reference sections (the only candidate, §7.8 نافذة السياق والضغط,
is Day 5 — see the cross-day cleanup below).

**Day 7 budget:** شرح المفاهيم 46 د (34+12) · تطبيق مع المدرب 60 د (52=25·27, +8) · عمل المتدربين
84 د (77=35·42, +7) · مراجعة وعرض التقدم 25 د (18+7) = **215 د**. Built from §2.7 directly, not from
`deck/handout/index.html` — the handout's own Day-7 block was stale (see below) and would have
produced a wrong شرح total (28+8+10=46 by a different split, carrying a §7.8 row that doesn't belong
on this day at all).

---

## Cross-day cleanup, done before any Day-7 content existed

`deck/handout/index.html`'s Day-7 block carried a **§7.8 نافذة السياق والضغط (8 د)** row and a
matching 4th goal line. §7.8 is **Day 5** — it is in curriculum §2.5, already built as `day-05.html`
slide 18, and already present in the handout's own Day-5 block, i.e. duplicated across two days in
the same file. Fixed by deleting the row and the goal, and re-merging the freed minutes into the
neighbouring rows so شرح stayed 46 د (14.3+14.4 concept: 28→**34 د**, أسئلة ونقاش: 10→**12 د**,
matching §2.7 exactly).

Two sibling stale pointers in the same cluster, both still saying "في اليوم 7" for §7.8: Day-1's own
goals block in the handout (`:1012`) and curriculum §2.1's goals (`:141`). Both corrected to "في
اليوم 5" — `day-01.html`'s own slide had already been fixed to say Day 5, so only the handout and the
curriculum's §2.1 prose were lagging.

While in `showcase-strategy.md` and `MEDIA_SHOTLIST.md` for the Day-7 entry, re-verified the Day-6
entries against the shipped slide (the A13 staleness pattern — *"a reference file is only as current
as the last time something forced a re-read of it"*): `showcase-strategy.md`'s Day-6 row still
described slide 17's amber row as *"for the ERD redraw"*, but the shipped wording (from the same-day
correction round) is "compare the diagram against the real tables and update only the diff". Fixed
in both files.

---

## Package work, done before the slides

**`building-features/SKILL.md` §د (14.3) and §هـ (14.4) were the thinnest sections in that skill** —
15 and 9 lines, no sub-headings, no completion checklist, and **no mention of Supabase RLS at all**
even though the real trainee's state parks seven tables at `rls_enabled_no_policy` explicitly for
14.3 to resolve. Fully deepened both, matching `data-model/SKILL.md`'s depth:

- §د gained: a named three-input list (§9 roles, §10 permission requirements, §5's «من يصل إليها»
  per screen — the skill previously named only §9), an explicit RLS sub-section stating the two-layer
  enforcement (database policies + server checks) and naming the `rls_enabled_no_policy` warning so
  Claude recognises it rather than treating it as a defect, a page-vs-action split for where each
  constraint gets recorded, an instruction to fill `CLAUDE.md` §د «الأدوار» if still empty (a live
  defect found in the real trainee's state — §9 completed 2026-09-25, §د never got filled, and
  nothing ever told Claude to), and a completion checklist.
- §هـ gained: a "this replaces, it doesn't build from scratch" note (`/` already exists from 14.1,
  temporary), `/design-sync`'s actual failure modes (`/design-login` prerequisite, a consent error we
  hit ourselves building this repo's own design system — `slides/assets/styles.css:3`), the
  components-transfer-not-screens reminder at the point of use, and a completion checklist.

**`PRODUCT.md` §7 gained a «الصلاحيات حسب الدور» table**, inserted between the features table and the
routes table — 14.3's stated outcome is «كل صفحة **وإجراء** مقيّد بحسب الدور», but §7 only ever had a
per-page «لمن تفتح؟» column; per-action permissions (who can cancel a booking, who can edit a rating)
had nowhere to live. Added to both `project-package/PRODUCT.md` (the template) and `trainee-test/
PRODUCT.md` (structurally, as an empty block — the trainee's real data above and below it untouched).

**The curriculum's own 14.3/14.4 prompts used bracket placeholders** (`[اسردها]`, `[حدّد]`) asking the
trainee to retype their roles and public/private decisions by hand — directly violating
`deck-anatomy.md`'s own documented `.promptbox` rule: *"a prepared prompt must tell Claude where the
data lives now, not which task produced it… point at the `PRODUCT.md` section instead."* Rewrote both
curriculum prompts (`:2759`, `:2798`) to point at `PRODUCT.md` §2/§3/§5 and §12 respectively, matching
what §د's new three-input list and §هـ's replace-not-build note already say. The slide's `.promptbox`
carries the identical corrected wording — this is the deliberate redundancy
`bootcamp-mvp-process.md` §2 requires, not two different prompts.

**`day-06.html`'s closing slide gained a 14.4 card.** Its original single-card «ايش نعمل بكرة» named
only 14.3, even though Day 7's own title names both tasks and 14.4 owns more clock time (27+42 د vs
25+35 د). Added inside the existing `bento[data-cols="1"]` — growth inside the frame, not a new
slide. Committed and pushed as part of "finish Day 6" before any Day-7 slide was written, per the
user's explicit instruction to ship Day 6 clean first.

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم السابع | `sag-title` dark | — | Facts row names both tasks by number (`المهمة 14.3`/`14.4`), not just the section, since Day 7 has no higher-level §-grouping worth citing the way Day 6 cited §13/§14 |
| 2 | مهامّ اليوم: شرح + تطبيق | 2 × `.sess` | — | شرح's 34+12 and تطبيق's three rows (25/27/8) trace exactly to §2.7; تطبيق's 52 د row is split into two — one per task — per the recipe's own rule that internal `·` sub-durations are a cue for separate rows, not one wide row |
| 3 | مهامّ اليوم: عمل + مراجعة | 2 × `.sess` | — | عمل's 77 د row splits 35·42 the same way, each carrying `data-task-key`s (`d7-143`, `d7-144`, `d7-push`) shared with slide 17's checklist; مراجعة's two rows (18+7) carry their own keys for consistency with the Day-6 pattern, though nothing else currently shares them |
| 4 | أهداف اليوم | 3 cards + lead | — | Lead + 3-card bento with a visible gap below the cards — confirmed by direct screenshot comparison against Day 6's own shipped (and already-approved) slide 4, which has the identical gap; not a new sparse-slide defect, just how this component renders |
| 5 | سبع مهامّ متتابعة — وين تقف أنت اليوم | `.flow` ordered list + plain card | `s14-recap` | Verbatim reprise of `day-06.html`'s own slide 15 (the 7-task list), `data-ref` cannot cross files so this restates it briefly per the recipe; 14.2 now shows `✔ اليوم 6`, 14.3 carries `← أنت هنا` |
| 6 | مثال قبل أي تعريف: الزرّ المخفي | 2-card bento (assumption/reality) + inline quote | `hidden-button` | **Gateway example (A.6.11)** — the day's one heavy idea («القيد في الخادم») is unparseable cold, so this opens on a concrete situation (a hidden admin-only delete button, generic roles not a specific business domain) and never names "الخادم" until the closing attr line. Built on the exact proven structure of `day-01.html`'s MCP gateway slide (24), not improvised — a 2-column before/after contrast, not a linear narrative, after checking the actual precedent rather than inventing a new device. Title shortened mid-build after the `deck-part` "1/2" marker wrapped awkwardly against a longer title; re-screenshotted to confirm the fix |
| 7 | طيب ليش ما يكفي إخفاء الزرّ؟ | 2-card bento + bordered rule card | `server-rule` | Names the concept and explains it by pointing back at slide 6's two columns part by part — matches `day-01.html` slide 25's structure (`2/2`, badge now names the revealed concept). Curriculum's own line reused verbatim: «لا تثق بالواجهة أبدًا — القيد الحقيقي يكون في الخادم». RLS is deliberately **not named** here — A.6.4 caps trainee-facing depth at what/when, the two-layer mechanic is described in plain language only, the term itself lives in the skill |
| 8 | ما تحتاج تقرّر شيئًا من جديد | 3-card bento + plain card | `roles-ready` | Cashes three forward promises made on earlier days: §9's overlap-rule answer (`day-02.html:802`), §12 screens' «من يصل إليها» field (`day-05.html:511`, `designing-screens/SKILL.md:43`), and §10's permission requirements — explicit about Claude reading these, not re-asking |
| 9 | اطلب من Claude تقييد كل صفحة وإجراء | lead + 2-card bento + `.promptbox` | `task-143` | **Shipped sparse, then fixed same pass** — first draft had no lead paragraph and only two stacked plain cards; screenshot showed roughly half the frame empty, the exact A.6.12 smell from Day 5/6. Added a lead stating the المخرَج and converted the two notices into a proper 2-col bento with `card__top` headers, matching `task-142`'s density from Day 6 |
| 10 | المقطع: 14.3 | `stepvid`, `--soon` placeholder | `demo-143` | 5 steps from curriculum's own numbered list (`:2725–2733`), ordinals in **Latin digits** (`1`–`5`) — the recipe's own markup example at `day-deck-recipe.md:94` uses an Arabic-Indic `١`, which is itself a documented bug against `SKILL.md`'s digits rule; not copied |
| 11 | صفحتك الرئيسية مؤقّتة الآن | lead + 3-card bento | `s144-intro` | States explicitly that `/` already exists in temporary form (real trainee state: `شكل مؤقّت — التصميم النهائي في القسم 12`) so 14.4 reads as a replacement from the first slide that mentions it |
| 12 | اسحب مكوّناتك الآن | lead + 2-card bento | `design-sync` | Covers the two real failure modes found in research: `/design-login` as an interactive prerequisite, and a consent/403 error (we hit this exact failure building this repo's own design system, `slides/assets/styles.css:3`) — neither was documented anywhere in the package before this pass |
| 13 | ايش يشوفه الزائر بلا حساب | lead + 2-card bento + example card + warning | `public-browse` | **Also shipped sparse, same fix** — no lead, two cards then a large gap before the warning card. Added a lead sentence and a concrete clarifying example (A.6.5: "يقدر الزائر يشوف قائمة خدماتك… لكن لمّا يضغط «احجز»…") rather than leaving the public/private split abstract |
| 14 | اطلب من Claude بناء صفحتك الرئيسية | lead + 2-card bento (المخرَج / راجع نتيجتك) + anecdote card + `.promptbox` | `task-144` | **Also shipped sparse, same fix** — originally opened directly on the trainer-anecdote card with nothing above it; content ended roughly a third down the frame. Added a lead + a 2-col bento pairing المخرَج with راجع نتيجتك before the anecdote, matching the density pattern now established on slides 9 and 13 |
| 15 | المقطع: 14.4 | `stepvid`, `--soon` placeholder | `demo-144` | 5 steps from curriculum (`:2771–2777`), same Latin-digit ordinals |
| 16 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 17 | دورك الآن | 2 × `.sess` + plain card | `your-turn` | Asymmetric split (35 د / 49 د) mirrors Day 6's own imbalanced pattern (38/46) rather than forcing an even halves; `data-task-key`s match slide 3 exactly |
| 18 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 19 | جرّب الممنوع، لا المسموح فقط | lead + 2-card bento (✔/✘ contrast) + plain card | `day-review` | The ✔/✘ pair is lifted near-verbatim from `testing-and-security/SKILL.md:80–85` (attempt-and-result vs. a vague assertion) — a ready-made contrast the skill already had that no slide had used yet |
| 20 | مخرَج اليوم | 3-card bento + plain card + inline quote | `day-outcome` | Mirrors `day-06.html`'s day-review slide structure exactly (3 state cards, lightbulb tip reusing a real-build anecdote, closing quote line) |
| 21 | غدًا — اليوم الثامن | `sag-closing` dark | — | «ايش نعمل بكرة» carries one card for 14.5 الوظيفة الأساسية للمنتج, explicitly framed as building on today's roles/pages («على الصلاحيات والصفحات اللي جهّزتها اليوم») rather than a bare forward pointer |

---

## What the build caught — worth keeping

- **Three slides shipped sparse in the same first draft, all the same shape.** Slides 9, 13 and 14
  each opened straight into a notice card or two with no lead paragraph, leaving roughly a third to
  half the frame empty below the content — the exact A.6.12 smell documented from Day 5 (slides 7, 12)
  and Day 6 (slides 4, 11). The fix was identical each time: add a lead sentence stating the task's
  outcome, and where there were only plain `card--plain` notices, convert at least one pairing into a
  proper `card__top`-headed bento card. **The pattern recurring three times in one file, on the very
  first pass after the lesson was freshly re-read from the Day-6 brief, confirms the brief's own
  framing: screenshotting is the actual gate, not having read the rule.** A clean `deckAudit()` never
  flagged any of the three.
- **A `deck-part` "1/2" marker wrapped onto its own line when the title was too long.** Copying
  `day-01.html`'s MCP gateway slide structure (badge + title + inline `.deck-part`) worked exactly
  until the title text ran longer than Day 1's own example — caught only by screenshot, fixed by
  shortening the title to a comparable length, re-screenshotted to confirm the marker sat inline
  again. `deckAudit()` had nothing to say about it either way, since nothing overflowed the frame.
- **The curriculum's own prompts for 14.3/14.4 used bracket placeholders that contradicted a rule
  already written down elsewhere in the package.** `deck-anatomy.md`'s `.promptbox` section states the
  rule explicitly — point at a `PRODUCT.md` section, not at the task that produced the data — but the
  curriculum text for exactly these two tasks had never been checked against it, because the rule was
  written for a different day's correction and nobody had re-read these two prompts since. Fixed in
  the curriculum first, then mirrored into the slide, so both carry the identical corrected sentence
  rather than the slide silently improving on a curriculum that still says something else.
- **Cleaning the stale Day-7 handout row before writing any Day-7 content caught a second, unrelated
  staleness in the same files** — `showcase-strategy.md`'s Day-6 entry still described slide 17's
  amber row with its pre-correction wording ("for the ERD redraw") even though the actual same-day fix
  had already reworded the slide itself. Same A13 pattern as Day 6 catching Day 5's stale entries: a
  reference file only gets re-read when something forces it, and starting Day 7 was that force for the
  Day-6 rows this time.
- **A package gap stayed invisible until the task that actually needed it was built.** `PRODUCT.md`
  §7 had carried a per-page «لمن تفتح؟» column since Day 1, which reads as "permissions are already
  handled" at a glance — but 14.3's outcome is explicitly "page **and action**", and nothing in the
  template had a place for the action half until this pass. The gap was only visible once the task
  that depends on it was in front of us, which is itself worth remembering for days 8 and 9 (14.5's
  journey-completion state and 14.6's admin CRUD both likely have similar unrecorded-output risks
  worth checking before their decks are built, not after).

---

## 2026-10-07 — 14.3 filmed; 14.4's design-pull mechanism corrected

**`task_14.3.mp4` (2:13, slide 10) went from `--soon` to a real `stepvid`, built from frames, not from
memory of "about 37s to 1:40 was Claude running."** Two-pass per `deck-anatomy.md` §5: a coarse contact
sheet first (`fps=1/7` and `fps=1/2`, `tile` filter, no seek), then a full-resolution `trim`-extracted
frame at every candidate second before it went into a `data-t`. The coarse pass alone was actively
wrong once — a 7-second-interval thumbnail read as a settings dropdown at `t=0`; the verified
full-resolution frame at the same second showed the day's own task slide instead, confirming the
two-pass rule earns its keep rather than being a formality. The real recording diverged from the
original shotlist row in a way worth recording precisely: the planned "confirms 403 not 500" beat
isn't what carries the middle of the clip — a first `apply_migration` call comes back `{"status":
"declined"}`, and Claude pauses to ask whether that was intentional instead of retrying blindly or
ploughing past it. The trainee pushes back ("ما رفضت اي شي"), and Claude's own investigation
(`get_advisors`, `execute_sql`) turns up that the "decline" was Supabase's own automatic safety warning
for a sensitive DDL statement, not a real rejection. That exchange — not a silent, unbroken execution
block — is what the user's "all Claude running" recollection was pointing at; the content underneath it
was more specific and more useful than the recollection alone suggested, which is exactly why the
hazard note insists on frames over memory even when the memory turns out roughly right in shape.
Six real `data-t` steps replaced the five `stepvid__mark--idx` placeholders (a 6th earned its own step
because the declined-migration pause is a distinct, valuable beat the original 5-step placeholder had
no slot for); commit & push stayed an `stepvid__mark--idx` row with no timestamp because the clip
genuinely ends before it, right after Claude's own chrome-devtools role-login check. **The first written
draft of step 1 itself tripped the deck's own و+Latin-glue rule** (`وClaude` with no space, rendering as
a garbled "Claudeg" under RTL) — caught by the mandated register sweep immediately after screenshotting
the slide, fixed by reordering to `ويقرأ Claude`. Caught by the same check this brief has flagged
twice before (Day 6's `commit و push`): the markup-level regex alone would have missed nothing here
either — it was read correctly the first time because the screenshot was taken, not skipped.

**14.4's design-pull mechanism was rewritten everywhere it's described, not patched on the slide
alone.** The shipped version (and the curriculum it was built from) treated `/design-sync` as if it
might plausibly pull a full generated screen, with "describe what you see in Claude Design" or a
same-day link/download fallback as the backstop. Both assumptions were wrong in the same direction:
`/design-sync` only ever moves design-system *components* — `designing-screens/SKILL.md` §0 already
said so — and Claude has no mechanism to pull a full custom screen's pixel-accurate layout from a link
or a description of it, reliably, at all. The fix makes `designing-screens/SKILL.md` §3.3 (the single
shared mechanism every future screen-pull task depends on, not just 14.4) say what actually works: the
trainee downloads the real files — the dropdown opposite the zoom percentage at the top of the Claude
Design page → **"All project files"** → everything except **"Design System"** → into a `design-temp/`
folder Claude prepares and empties between screens — and Claude builds from those files, every time,
not as a last resort after a mismatch. `building-features/SKILL.md` §هـ, the curriculum's generic
per-feature cycle description and its 14.4 step list (now six steps, not five), and both of
`day-07.html`'s affected slides (`design-sync` restructured from a 2-card `/design-sync`-only layout to
three cards that separate "components, automatic" from "screens, download them yourself"; `task-144`'s
promptbox; `demo-144`'s still-unfilmed placeholder steps) were all brought into line with the same
corrected mechanism, in that order — skill first, so the deck can't end up contradicting it.
**Making this change surfaced an unrelated bug in the 14.4 prompt itself:** `بقية هذا السطر كانت تقول
«من تصميمي في القسم 12»` — citing the *curriculum's* task number for the design section, when every
sibling prompt (14.3's own, three lines above it in the same file) correctly cites `PRODUCT.md`'s own
section number instead (§5, not §12 — §12 doesn't exist in `PRODUCT.md`, which only runs to §10). This
is the exact failure the `.promptbox` rule exists to prevent, sitting one task-row below a prompt that
already got it right — caught only by reading the two prompts side by side while already in the file
for an unrelated reason, not by any check aimed at this specific thing.

Both `deck/MEDIA_SHOTLIST.md` and `.claude/skills/bootcamp-deck/references/showcase-strategy.md` were
updated to flip `task_14.3.mp4` from ⬜ to ✅ with the real content described above, and to rewrite
`task_14.4.mp4`'s row around the corrected mechanism so a future filming pass is briefed on what the
recording now actually needs to show. All four touched files with a `trainee-test` counterpart
(`slides/day-07.html`, `.claude/skills/designing-screens/SKILL.md`,
`.claude/skills/building-features/SKILL.md`, `bootcamp_roadmap_and_curriculum.md`) were synced and
diff-verified identical immediately after editing, not batched to the end.

---

## 2026-10-07 — the `/design-sync` mechanism itself was backwards, project-wide

**The paragraph immediately above this one is wrong, and shipped in this exact file minutes earlier.**
It says "components pull via `/design-sync`." They don't. `/design-sync` uploads an existing **code**
component library from a repo *to* Claude Design — the opposite of what every file in this project,
including this brief, assumed. This was not found by review; it was found because a real trainee hit
it and said so: `trainee-test/conversation_history.md` §45, after Claude built 14.4's visual design
from guesswork instead of the real Claude Design files —

> «التصميم ماله علاقة ابدا بالتصميم الي اشتغلنا عليه في claude design!!!!!!!!!!!!!!!!!!!<br>
> كان المفروض ان تسحب مكونات التصميم بأمر ‎/design-sync»

Three sources, read in order, converged on the same answer. The live `DesignSync` tool definition
(fetched via `ToolSearch` to check the claim, not assumed from memory): its stated purpose is keeping
"a local component library in sync with a Claude Design project," and its write path exists to
*push* (`finalize_plan → write_files`), with `get_project` there specifically to verify a target
**before pushing**. `trainee-test`'s own §47 then surfaced the skill's loaded definition directly:
it converts a design-system **repo** and uploads it, looks for `.storybook/` or `*.stories.*` (a
bootcamp project has neither), and carries `disable-model-invocation` — Claude is blocked from running
it at all. And our own `conversation_history.md:894`, from the real booking build, already had it
right: *"The `/design-sync` skill is user-triggered only (can't be model-invoked), so pulled via the
DesignSync tool's `get_file` + local `Write`."* **That last one is the actual failure** — the correct
mechanism was discovered, used, and written down during the booking build, and the trainee package was
later authored contradicting its own project's history (a CLAUDE.md §A.5 violation: grounded in
assumption, not the source sitting in the same repo).

**The cost, read from `trainee-test/conversation_history.md` §44–§47:** 14.4 shipped once with an
invented design (brand colors `#FCF0DA`/`#AEAC78`/`#F2C46A`/`#4C4541` absent entirely), was corrected,
then the trainee was sent on **two separate wrong errands** — asked to run `/design-login` then
`/design-sync`, each time because the (also-wrong) instructions said to — before Claude, on the third
attempt, read the Claude Design project's files directly and built the real thing. Recovery took three
full response cycles that would not have been needed had the mechanism been right the first time.

**What changed, both trees:** `designing-screens/SKILL.md` §0 now states the correct direction by
name, with an explicit "do not run `/design-sync`, do not ask the trainee to" warning — the
misconception is named and killed, not just omitted. `building-features/SKILL.md` §هـ adds the
completeness gate this incident's forensics made necessary (next paragraph). Nine sites in the
curriculum, four in `day-05.html`, one in `day-06.html`, and this file's own four sites in
`day-07.html` were corrected — including the §12 slide that taught "link first, download only on
mismatch," which was itself half of the wrong doctrine and is now download-only, matching
`designing-screens/SKILL.md` §3.3. `deck/DESIGN_SYSTEM_PROMPT.md`, `PROJECT_REPORT.md`,
`implementation_plan.md`, `MEDIA_SHOTLIST.md`, `showcase-strategy.md`, and root `CLAUDE.md` §A.4 (a
new standing entry, so the next authoring pass can't reintroduce this) were all corrected to match.

**And a second, concrete gap, found while verifying `trainee-test`'s actual disk state rather than
trusting its own "لك أنت" claim of success:** the session's corrected pull *did* read real files this
time, but only 11 of the ~19 component class roots present in the pulled `components.css` have a
matching `.jsx` file, and **zero** have a `.d.ts`. Checkbox, Chip, Accordion, Avatar, Modal, Table,
Tabs, and Toast have styles with no component — a style with no component is a missed pull, not a
completed one. This is the same shape as the booking build's own `conversation_history.md:964`
oversight (".d.ts files fetched properly after I'd only pulled the `.jsx` files earlier") — confirming
"pull everything, with types, and cross-check the stylesheet's class roots against what was actually
written" belongs in the skill as a standing gate, not a thing to notice only when it breaks 14.5's
Dialog/Toast or 14.6's Table/Tabs two days from now. `building-features/SKILL.md` §هـ now says so
explicitly, and a non-technical Arabic hand-off prompt (written for the trainee to send, carrying no
technical content itself — the corrected skill supplies that once step 1 forces it open) was prepared
to get that session to finish the pull using its own words from §47, not ours.


## 2026-10-08 — `task_14.4.mp4` stepvid corrected against the raw footage, and a role-check honesty pass

**Part 1 — the stepvid list for slide 15 (demo-144) was built once, then corrected after the user
watched the actual video.** The first pass leaned on coarse contact sheets and inferred timing; the
user watched the real clip and corrected it directly: deleted a step claiming the dev server had
stopped ("I was just refreshing the page and it worked, nothing more!" — the step was invented
narrative, not something the footage showed), added a step for the one terminal moment in the whole
clip (4:13–4:18, a command-line window opened separately to run `claude` from inside `application/`,
instead of the editor's integrated console used everywhere else), retimed nine existing steps to exact
boundaries given from direct viewing, removed a trailing sentence from one step's description, and
added two new steps: one merging a misplaced "home page is final" beat with a verification that
`/book` was still untouched (2:48), and one explicitly naming that the download procedure was running
a second time, now for `/book` (2:58). The corrected list is 15 steps, each frame-verified via `trim`
extraction (never `-ss` seeking — confirmed unreliable on this file in an earlier pass) before being
written.

**Part 2 — a sixteenth step, added the same day for an unrelated reason.** Re-reading the clip's final
seconds while auditing the Day-7 role-check teaching (below) surfaced a beat nobody had stepped: at
4:32–4:33 the clip ends on `/book/confirm?tutor=…` returning **404 — the page isn't built**, not a
permission result. That became both a new stepvid step (4:32, naming the page as not-yet-built, due
14.5) and the concrete evidence for Part 3.

**Part 3 — Day 7 was teaching a permission check it cannot actually verify on Day 7, and the clip's
own ending proves it.** Slide 19 told trainees to log in as each role and open a page belonging to
another role; slide 20's outcome card asked them to tick that they had. Through Day 7 the only pages
that exist are `/`, `/book`, `/signup`, `/login`, and a placeholder `/dashboard` — the role-specific
pages a trainee would need for that check don't arrive until 14.5 (Day 8) and 14.6 (Day 9). So the
check returns 404, not 403, and through UI-only review (no code, no tests, per `CLAUDE.md` §A.5) those
two outcomes are indistinguishable — a trainee would tick the box having proved nothing, which is
exactly the failure slide 19 exists to catch. The fix, decided with the user and scoped explicitly to
avoid dropping the idea rather than deferring it: slides 13/19/20 now establish the restriction
honestly (it genuinely is built, server-side, on Day 7) and name the distinguishing test — "«الصفحة
غير موجودة» = not built yet, not a permission result; «ما عندك صلاحية» = the restriction actually
fired; only the second counts." The full role-against-page matrix is pushed to run cumulatively from
Day 8 onward, one day at a time against whatever that day just built, culminating in §15.3 on Day 10 as
the **first full run**, not a recap. This reaches the curriculum (`كيف تراجع نتيجة أي مهمّة` and every
«راجع نتيجتك» from 14.3 through 15.3, plus the §2.7–§2.9 agenda rows) and a standing note in
`showcase-strategy.md` so a future Day 8–10 deck build doesn't quietly reintroduce the Day-7 shape by
treating this as "already mentioned."

**Part 4 — both `PRODUCT.md` files had their tables' column order reversed.** Every table in both
files was written key-first in source (e.g. `| الدور | الوصف | الاحتياجات |`); measured directly in
Chrome, a table under `dir="rtl"` *does* reverse column order, so that source already read correctly
there — but the user's own viewer does not perform that flip, so the key column was landing leftmost
instead of rightmost, backwards for an RTL reader. Reversed every table's cell order in both files
(verified lossless: zero escaped pipes, no pipes inside inline-code spans, and a per-row
content-multiset check before/after). This is an explicit, accepted trade-off, not an oversight: these
tables now render backwards in Chrome and on GitHub. The convention is recorded in
`.claude/rules/bootcamp-mvp-process.md` §5.2 (both trees) so the next table either file's Claude
session writes doesn't silently revert to key-first.
