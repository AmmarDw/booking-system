# Day 8 — deck brief

The slide-by-slide record of `project-package/slides/day-08.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §14's §14.5 task plus the
new «صياغة الأوامر وتصحيح المسار» concept sub-section. If this brief and the curriculum disagree, the
curriculum wins.

**19 slides.** Built 2026-10-08, the first Day-8 deck — no earlier version existed. Preceded by a
pre-flight pass reading every `## What the build caught` section from days 3–7's briefs into a
17-item check table, run live during the build rather than as a reading exercise — per the user's
explicit instruction to make sure the same mistakes don't recur.

**Day 8 budget:** شرح المفاهيم 44 د · تطبيق مع المدرب 56 د · عمل المتدربين 90 د · مراجعة وعرض
التقدم 25 د = **215 د** (+ استراحة 25 د). All four totals trace to the curriculum's own numbers;
none were widened to fit new content.

**Two curriculum gaps, found before any slide was drafted:**

1. **«صياغة الأوامر وتصحيح المسار» — the day's single largest concept block (26 د, bigger than any
   concept block on days 2–7) — existed only as one agenda line, with no `#### ` section anywhere in
   the curriculum.** Writing the deck from it directly would have meant inventing 26 minutes of
   content with nothing to ground it, a direct §A.5 violation. Wrote the sub-section first
   (`bootcamp_roadmap_and_curriculum.md`, under §14's concept area), built from four already-curated
   real exchanges — all from days already taught (14.3, 14.4, 14.5's own collapsibles) — explicitly
   excluding 14.6/14.7 material to avoid spoiling Day 9. Then built slides 6–9 from that section, not
   the other way around.
2. **§14.5 silently invalidates `PRODUCT.md` §4 and `diagrams/booking-journey.drawio`, and nothing
   said to reconcile them.** The Day-7 brief had already flagged this as a likely risk worth checking
   before Day 8 was built, by analogy with the ERD: `data-model/SKILL.md` §3.5 has a full
   compare-don't-redraw rule for after 14.2; `user-journey/SKILL.md` had no equivalent for after 14.5
   at all — the journey was only ever read, never written back. Checked, confirmed real, fixed with a
   matching §3.6 in `user-journey/SKILL.md`, a numbered step in `building-features/SKILL.md` §و, and
   a curriculum «راجع نتيجتك» bullet — all three say the identical thing: no difference, touch
   nothing; a real difference, update only what changed, never redraw or rewrite wholesale.

**One more caught while writing the curriculum's own `.promptbox` prompt for 14.5:** it told the
trainee to `[الصق الرحلة]` (manually paste the journey into the prompt) instead of pointing at its
`PRODUCT.md` §4 location — the exact anti-pattern `deck-anatomy.md`'s "Point at the `PRODUCT.md`
section, not the task that produced the data" rule documents (caught once before, on Day 5 slide 8).
Fixed in the curriculum first, then the identical corrected wording went into slide 11's
`.promptbox` — both carry the same sentence, per the deliberate-redundancy rule.

**No recordings exist yet.** §14.5 is one curriculum task with a single undivided 46 د تطبيق row,
unlike days 5–7 which each had a natural two-task or sub-duration boundary to split a recording
along. Invented an A/B pacing split (22 د · 24 د) and wrote it back into §2.8 before building the
deck, so the curriculum and the deck's two recording slots agree. Both ship as `stepvid__video--soon`
placeholders with the curriculum's own numbered steps as `stepvid__mark--idx` ordinals, per
`day-deck-recipe.md`'s "ship the slide anyway" rule.

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم الثامن | `sag-title` dark | — | |
| 2 | مهامّ اليوم: شرح (44 د) + تطبيق (56 د) | 2 × `.sess` | — | شرح's three rows trace to §2.8's 8+26+10; تطبيق's three rows split the invented 46 د (22+24) plus the shared «كيف تراجع نتيجة أي مهمّة» 10 د |
| 3 | مهامّ اليوم: عمل (90 د) + مراجعة (25 د) | 2 × `.sess` + `.card--plain` (time-varies note) | — | عمل's two rows are 14.5 (85 د, undivided — one task, no natural sub-split) + push (5 د); مراجعة's two rows are 18+7 |
| 4 | أهداف اليوم | 3 cards + lead + `.card--plain` example | — | First draft shipped with only the lead + 3-card bento, no closing example — screenshotted visibly sparse (A.6.12, exactly the failure the pre-flight table named as most likely to recur). Fixed by adding a concrete example card («رحلتك قد تبدأ بتصفّح خدماتك، وتنتهي بتأكيد الحجز») rather than padding the existing cards |
| 5 | §14 — سبع مهامّ، وين تقف اليوم | `.card--accent` (7-item ordered flow) + `.card--plain` | `s14-recap` | Mirrors Day 7's own slide 5 exactly — `data-ref` cannot cross day files (`deck-anatomy.md`), so the 7-task recap is restated here with 14.1–14.4 marked done and 14.5 marked «أنت هنا» |
| 6 | صياغة الأوامر وتصحيح المسار — المفهوم | lead + 2-card bento (صياغة الأمر / تصحيح المسار) + `.card--plain` | `cmd-intro` | No task number — first concept slide not tied to a §14.N badge; uses a bare `.sag-badge` with no inner `__num` span, matching how «أهداف اليوم» does it |
| 7 | جرّب الحالة اللي ما تبيها، لا الناجحة بس | lead + 2-card bento + `.card--plain` (القاعدة) | `cmd-forbidden` | Both 14.3 incidents (the missing booking-self-restriction, the 500-vs-403 reporting bug) from the same real collapsible, kept paired since the source pairs them. **Reworked 2026-10-08:** the lead opened «في المهمة 14.3», which reads as the trainee's *own* task from yesterday — replaced with the framing formula plus the Day-2 callback that actually establishes the prerequisite. Card 1 rewritten so it stops restating the lead |
| 8 | اسأل «لماذا لا؟»، وجرّب على جهازك أنت | lead + 2-card bento + `.card--plain` | `cmd-question` | First draft shipped with no lead paragraph — went straight from title to bento, and an accidental duplicate `.sag-slide__body` wrapper was introduced while fixing it (caught by re-reading the edit before moving on, not by any audit). **Reworked 2026-10-08:** card 1's filter story genericised (its lesson is domain-free, and keeping it cost three prerequisite facts); card 2 retitled from «جرّب على جهازك، بإعداداتك» — settings of *what* was never stated — and rewritten to show the actual before/after instead of asserting a defect |
| 9 | صِف اللي يزعجك، ودع Claude يقترح الحلّ | lead + 2-card bento + `.card--plain` | `cmd-constraint` | Both halves (the config-vs-table hesitation, the "لست متأكّدًا" line) from the same 14.5 collapsible. **Reworked 2026-10-08:** «القيد» retired across the whole deck — Day 7 defines «القيد في الخادم» at `day-07.html:332` and uses it ~20 times for the permission check, so Day 8's unrelated sense was a term collision, not just jargon. «مقايضة» → «الطريقتين». «ملفّ الإعدادات» now glossed inline |
| 10 | 14.5 — رحلتك تُبنى وظيفةً وظيفة | lead + 3-card bento + warning card (journey-reconcile) | `task-145-split` | Carries the first on-slide statement of the journey-reconcile rule, in the warning-styled card |
| 11 | المهمة 14.5: نفّذها | lead + 2-card bento + `.promptbox` | `task-145` | `data-copy` points at «رحلتي (القسم 4 في PRODUCT.md)», not at a task number or a paste-here placeholder — see the curriculum fix above |
| 12 | ▶ المقطع: 14.5 الجزء الأول | `stepvid` + `media/task_14.5_part_1.mp4` | `demo-145a` | ✅ Shipped 2026-10-11 — 24 frame-verified steps, 4 dividers, one «في المقطع:» note for the moved teacher-test block; title updated to «تقسيم رحلتك، وبناء أوّل ثلاث وظائف» because the clip covers F1–F3 |
| 13 | ▶ المقطع: 14.5 الجزء الثاني | `stepvid` + `media/task_14.5_part_2.mp4` | `demo-145b` | ✅ Shipped 2026-10-11 — 28 frame-verified steps, 4 dividers |
| 14 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 15 | دورك الآن | 2 × `.sess` (first as `tasks--tree`) + 2 `.card--plain` notes | `your-turn` | First deck to give a single curriculum task (14.5) `task--l2` children — two invented sub-steps (`demo-145a`/`demo-145b` refs) matching the two recording slots, present only on this slide, not echoed on slide 3's agenda (the parent key alone carries the rollup state there). First draft left a visible empty gap below the two `.sess` columns — fixed by adding a card explaining the two sub-steps map to the two recordings just watched, rather than only the Ctrl+click hint |
| 16 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 17 | امشِ على رحلتك، لا تقرأها بس | lead + 2× 2-card bento | `day-review` | Four cards: walk it fully, try a wrong case, try it with a role that shouldn't have it (continuing Day 7's 404-vs-403 thread explicitly — "تذكّر فرق «غير موجودة» عن «ممنوع» من أمس"), and the journey-reconcile check |
| 18 | مخرَج اليوم | 3 cards + tip card (two-paragraph anecdote) + quote | `day-outcome` | The tip card follows the user's standing Day-7 feedback on this exact component: the real scenario told in full (what the trainer tried, what he said, what Claude proposed) in one paragraph, then the generalized rule in a separate «الدرس:» paragraph — not condensed into one sentence |
| 19 | غدًا — اليوم التاسع | `sag-closing` dark | — | «ايش نعمل بكرة» names only 14.6 لوحة التحكم والإدارة, matching every prior closing slide's one-task preview convention — checked against the command-writing block explicitly and confirmed this isn't a stale forward-reference (Day 7's own closing slide also previews only 14.5 despite Day 8 carrying the 26 د concept block too) |

---

## What the build caught — worth keeping

- **The sparse-slide failure predicted by the pre-flight table hit twice on the first pass, both
  caught only by screenshot.** Slide 4 (goals) shipped with a large empty band below its 3-card
  bento; slide 8 shipped with no lead paragraph at all, going straight from title to bento. Both
  `deckAudit()`-clean. Fixed by adding real content (a concrete example on slide 4, a lead sentence
  on slide 8) — confirming the house lesson that a clean audit is necessary, not sufficient, and that
  the failure recurs even when a pre-flight check names it in advance.
- **A copy-paste fix introduced a duplicate wrapper element.** Adding slide 8's missing lead
  paragraph was done by copying a `<div class="sag-slide__body">` block from a neighbouring slide,
  which left two `sag-slide__body` divs inside one section — invisible to `deckAudit()` (no overflow
  resulted) and would have been invisible to a register sweep too. Caught by re-reading the diff
  immediately after the edit, not by any automated check.
- **The curriculum's own `.promptbox` prompt for 14.5 had never been checked against
  `deck-anatomy.md`'s "point at the `PRODUCT.md` section" rule**, because the rule was written for a
  different day's correction (Day 5 slide 8) and nobody had re-read this specific prompt since. Same
  shape as the Day-6 brief's "14.3/14.4 bracket-placeholder" finding — a rule fixed once in one place
  doesn't retroactively check every other place it applies.
- **A flagged risk from the previous day's brief turned out to be real on first check.** The Day-7
  brief predicted — without yet verifying — that 14.5's journey and 14.6's admin CRUD "likely have
  similar unrecorded-output risks worth checking before their decks are built, not after." Checked for
  14.5: real, in exactly the shape predicted (same as the Day-6 ERD gap). Worth re-running the same
  check for 14.6 before Day 9 is built, rather than assuming one confirmed instance closes the matter.

---

## Review round — 2026-10-08

Reported after the deck shipped: retire «من طرفها إلى طرفها» course-wide; slides 7 and 8 assume a
project the trainee has never seen; slide 8's second half is unclear; slide 9's «قيد»/«مقايضة».
Plus a request to audit earlier days for the same example problem.

- **«من طرفها إلى طرفها» → «من البداية إلى النهاية», 16 sites** across days 6/7/8, the curriculum,
  `building-features/SKILL.md` and the handout. Two traps: the phrase **wraps across lines** in two
  places (`day-07.html:1167`, `day-08.html:509`), so a line-oriented `sed` silently misses them; and
  `bootcamp_roadmap_and_curriculum.md:874`'s «من طرفين يتحدّثان» is a different word about APIs that
  any looser pattern destroys. A third variant, «من أوّلها لآخرها» (`day-08.html:807/814`), was left
  alone — natural spoken Arabic, not the reported term.
- **The BookIt audit found six sites, not the zero `showcase-strategy.md` claimed.** That file
  asserted «As of 2026-09-25 no BookIt material survives in any deck» — wrong, and unchecked for two
  weeks. Corrected there, with the framing rule recorded so the next day's build can't reintroduce
  the problem.
- **A term collision beats a jargon complaint as a diagnosis.** «قيد» was reported as unclear. It is
  not merely unclear: Day 7 *defines* it (`day-07.html:332`) and spends a whole section on it, so a
  trainee reaches Day 8 already owning the word with a different meaning. The grep that found this
  (`قيد` on day-07) is the same grep that proves Day 7's 23 uses must survive untouched — the fix is
  one-directional, not a global replace.
- **The same example lived in a skill, and only the diff revealed it.** `building-features/SKILL.md`
  carried the identical unframed filter story in a «سؤال المتدرّب الذي يستحقّ توقّعه» block — i.e.
  text Claude is told to relay to the trainee. Found only because the `قيد` sweep compared against
  `HEAD` and flagged the file. A deck fix that leaves its own skill contradicting it is half a fix.
- **Comparing against `HEAD` produces false positives while a previous round is uncommitted.**
  `SKILL.md`'s `قيد` count read 1→5 as "NEW" — four of those came from the *previous* Day-8 round,
  still unstaged. Every flag needs reading in place before it counts.
- **⚠ Open: the صياغة الأوامر block is under-written for its frame.** Measured, not eyeballed:
  `.bento` is `flex: 1 1 auto` with `align-content: safe center`, so a 3-child body (lead + one
  bento + a one-line rule card) leaves the bento stretched to **539px holding 194–233px of cards** —
  about 300px of dead space, ~40% of the body. It affects slides **4, 6, 7, 8 and 9 alike**; slide 4
  was "fixed" for this during the build and still measures 539/194. This round's edits made 7, 8 and
  9 marginally *denser*, never sparser. Fixing it properly means writing new teaching content for
  five slides, and the curriculum sub-section those slides draw from is already fully mined — so it
  was left for a decision rather than padded with invented material (§A.5). The dense comparison
  points are slides 17 (301/156 + 340/194) and 18 (316/194 + a 244px card + a 138px quote).

---

## Review round 2 — 2026-10-08

Reported: the «ممنوع» shortcut never says what the message actually is, and it recurs beyond Day 8;
slide 8's three defects; slide 11's prompt needs its task number, and that should become a rule;
`building-features/SKILL.md` §14.5 never pulls the designed screens the way §14.4 does.

- **The deck already had the real message — the shortcut was the only thing missing.**
  `day-07.html:1047` teaches «الصفحة غير موجودة» vs **«ما عندك صلاحية»** as the whole point of the
  404-vs-403 lesson, then four other places said «رمز «ممنوع»» / «رسالة «ممنوع»» instead — a phrase
  defined nowhere. Fixed in days 7 and 8, the curriculum (×2) and the skill (×2). The skill's step
  now says the 403 code alone is not the deliverable: the user judges the restriction by what is on
  screen, so the message text is part of the output.
- **Three objections to slide 8, and all three killed the habit, not just its wording.**
  «جرّب على جهازك أنت لا على جهاز غيرك» answers a question no trainee asks — they only have one
  machine. And «منتجك قد يظهر غلط على جهازك وحده» taught a misconception: if a product offers a
  language choice it must honour it regardless of the OS. The incident's defensible lesson is a
  different one — **Claude's check read the stored value and passed; the trainer opened the page and
  saw the display was wrong.** That is the course's own review principle, it is what actually
  happened, and the correct engineering answer («منتجك هو اللي يقرّر شكل العرض، لا إعدادات الجهاز»)
  now closes the card instead of being contradicted by it. Habit renamed accordingly in the deck and
  the curriculum.
- **A prepared prompt must open with its task number — and this does not contradict the rule above
  it.** `deck-anatomy.md` already forbade task numbers in prompts; that rule is about *where the data
  lives* («من رحلتي (11.1)» → wrong, point at the `PRODUCT.md` section). The new rule is about *which
  procedure to run* («طبّق مهمّة 14.5:» → required). Both corrections belong in the same sentence.
  The audit found 4 of 13 deck promptboxes carried a number and 2 of 7 §14 curriculum prompts did;
  all task-bound prompts now carry one, in both places, and day-06's «طبق مهمة 14.2 و…» was
  normalised to the house spelling. The three prompts that invoke no numbered task (two gap prompts,
  one session-hygiene prompt) correctly stay bare — the rule says so explicitly, so nobody
  "completes" it later by numbering them.
- **The design-pull was written as 14.4's private procedure, so 14.5–14.7 silently inherited
  nothing.** 14.5 builds more screens than any other task and its step list never mentioned the
  design at all. The reusable half is now **«سحب التصميم»** in §أ — stated once, called by 14.4,
  14.5, 14.6 and 14.7 — while 14.4 keeps what is genuinely its own (the one-time full system pull,
  the `/` replacement). A one-line guard in `bootcamp-mvp-process.md` makes the invariant
  always-loaded, so skipping it survives neither route.
- **Two drifts found by the verification pass, not by reading.** `day-04.html`'s two promptboxes had
  `data-copy` carrying «بعد أن نتّفق» that the visible paragraph lacked — the copy button handed
  Claude an instruction the trainee never read. Aligned up to the stronger wording. `day-03.html`'s
  promptbox reports as a mismatch and is **not** one: its `data-copy` is deliberately a superset of
  the visible paragraph, because the commands it embeds are rendered as separate `snipbox`es.
- **The file had been edited outside this session, and the diff is what caught it.** `day-08.html`
  came back reflowed by an editor, with «العطب» replaced by «المشكلة» throughout and the filter
  example deliberately put *back* to booking nouns. Diffing project-package against the last
  trainee-test sync surfaced all of it before any edit landed — otherwise the exact-match patterns
  would have silently reverted an editorial pass. **Diff against the last sync before editing a file
  the user also edits.**

## Recordings shipped (2026-10-11)

Both 14.5 recordings replaced the placeholders on slides 12–13. Full beat lists live in `deck/MEDIA_SHOTLIST.md` d8-1/d8-2.

- **The 1 fps contact grid ran up to a second ahead of true time** on both files (same finding as 14.4). Every `data-t` was set from a per-step `trim` frame, not the grid.
- **One block was filmed out of order on purpose:** the trainee's own teacher-can't-book test (habit 1, slide 7) was recorded after F4 but placed at the end of part 1 as F1's check. A «في المقطع:» amber note tells the trainee why the reply on screen mentions «حصصي».
- **Both clips show the four habits in use without staging them as lessons:** the forbidden case (teacher books; teacher opens «حصصي»), describing exactly what bothers you (the phone-size complaint, the faint title), opening the result with your own eyes (phone size; home-vs-book nav), and Claude asking instead of guessing (activating 14.6 buttons early; the step-21 journey diff).
- **⚠ Not fixed, flagged to the user:** the shared QA password and Chrome's autofill list of the trainer's personal emails are readable in the footage (exact seconds in the shotlist).

## Early-finisher note — 2026-10-11

Day 9 carries 14.6 and 14.7 plus a new concept block, so it is heavier than Day 8. To lighten it, a trainee who finishes 14.5 before the day's time runs out now starts 14.6 instead of waiting. The note sits on slide 15 (`your-turn`, third line of the plain card: «خلّصت رحلتك قبل ما يخلص وقت اليوم؟ لا تنتظر»), with a one-sentence echo on slide 3 and in the curriculum's §2.8 عمل row. The trainee tells Claude «طبّق مهمّة 14.6»; Claude's plan mode and the building-features skill take it from there. Day 9's deck must say «من بدأ 14.6 أمس يكمل من حيث وقف» on its agenda slides.
