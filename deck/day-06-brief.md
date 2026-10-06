# Day 6 — deck brief

The slide-by-slide record of `project-package/slides/day-06.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §13 plus §14's concept and
task-list portion (§14.2's own steps are §14's; tasks 14.1 and 14.3–14.7 are taught on other days).
If this brief and the curriculum disagree, the curriculum wins.

**22 slides.** Built 2026-10-05, the first Day-6 deck — no earlier version existed. Preceded by a
promotion pass: every lesson from Day 5's build (sparse-slide blind spot, missing-test compression,
reversed-rule triggers, review-vs-elicitation, list-vs-resolution, component reuse) was written into
`.claude/skills/bootcamp-deck/` and two new standing standards (`CLAUDE.md` A.6.12–13) before this
day's first slide was drafted, per the user's explicit instruction not to repeat Day 5's mistakes.
Then **revised the same day**, after a user review caught four real defects in the shipped draft — see
"§13.1/13.2 task boundary moved" below; that pass is the one the slide table and the component notes
in §7–10 now reflect.

**Day 6 budget:** شرح المفاهيم 46 د · تطبيق مع المدرب 58 د · عمل المتدربين 84 د · مراجعة وعرض
التقدم 27 د = **215 د** (+ استراحة 25 د). No duration widening needed anywhere — all four session
totals and every sub-row trace directly to the curriculum's own numbers.

**New package skill: `data-model`.** §13 previously had no skill of its own — its execution logic
lived as a 7-line blockquote inside `building-features/SKILL.md` §ج, a §14 skill, whose own
`description` even claimed coverage of §13. Built `project-package/.claude/skills/data-model/SKILL.md`
(226 lines) mirroring `designing-screens/SKILL.md`'s structure, and deleted the misplaced blockquote
in favor of a one-line pointer. `drawio/SKILL.md` was not touched — it is the tool both `user-journey`
and `data-model` call, and stays a dependency, not a duplicate.

---

## §13.1 reshaped before the deck existed: extract-then-verify, same shape as §12.1

Decided with the user before any Day-6 slide was drafted. §13.1 («وصف بياناتك بصيغة حرّة») asked the
trainee to describe their data from scratch — but by Day 6 the trainee already has roles (§9), EARS
requirements (§10), a numbered journey (§11), and a screen inventory with sections (§12) on record in
`PRODUCT.md`, all of which make entities highly derivable. Applying Day 5's own closing lesson
("could the trainee's structured upstream data make this step unnecessary?") to §13.1 gave the same
answer it gave for §12.1: yes.

**The reshape, mirrored field-for-field from §12.1's pattern:** Claude extracts entities from
`PRODUCT.md` §§2–5 (roles, requirements, journey, screens), each carrying four fields — name, what's
stored, links to other entities, and **origin** — plus a gap list closed immediately by question
(`AskUserQuestion`, suggested resolutions, same turn, never left as a list per the §12.1 "gap list
closes interactively" fix from Day 5). The trainee reviews in three passes (requirements→entities,
journey/screens→entities, entities→origin) then answers one final-gap question for data that exists
nowhere but their own head. The task table's «مَن ينفّذها» column flipped from **أنت** to **Claude
ثم أنت**, matching §12.1's own «Claude Code ثم أنت» exactly.

**Five cross-reference sites required the heading rename** (`#المهمة-131--وصف-بياناتك-بصيغة-حرّة` →
`#المهمة-131--استخراج-كياناتك`): the 29-task map, both §2.6 agenda rows, §13's own task table, and
13.2's «تعتمد على» line. All five updated in one pass, then verified with a fresh anchor check. Two
new «صياغة مقترحة» prompts were added where 13.1 previously had none (the extraction prompt and the
final-gap prompt) — the same hole §12.1 had before its own reshape. 13.2's existing prompt was
reworded to build on the reviewed extraction (reading from `PRODUCT.md` §6) rather than asking the
trainee to re-paste what they'd already written.

**Deck consequence (superseded same day — see below).** The first draft gave 13.1 three slides
(extraction, three reviews, final gap) and 13.2 one (model completion). A same-day user review moved
the task boundary itself: **13.1** now covers everything Claude produces in one continuous pass
(extraction + keys + relationship types + junction tables), and **13.2** is the trainee's review (the
three passes + final gap) — see "§13.1/13.2 task boundary moved" below for the reasoning and the final
2+2 slide split.

---

## §13.1/13.2 task boundary moved — same-day revision, after the first draft shipped

Caught in user review of the already-built deck, not during drafting. Four defects, all from the same
root cause: **the task boundary didn't match who actually did the work.** 13.1 (extraction + the
trainee's three reviews + final gap) and 13.2 (Claude adding keys/relationships/junction tables) each
mixed a Claude-production step with a trainee-decision step, with no real pause between 13.1's review
and 13.2's work — Claude had nothing left to decide once gaps were closed, so splitting "extract" from
"complete the model" into two trainee-facing tasks manufactured a review step (13.1's three passes,
against *entities only*) that the trainee would just redo once 13.2 added keys and relationships.

**The fix:** reassign by actor, not by extraction-vs-modeling. **13.1 = everything Claude produces**
(entities, gap-closing, keys, relationship types, junction tables, one-sentence-per-entity) in one
continuous task triggered by a single merged prompt — no second prompt needed once gaps close. **13.2 =
the trainee's review alone**, now reviewing the *complete* model: the same three passes
(requirements→entities, journey/screens→entities, entities→origin) plus the final-gap question, both
carried over unchanged from the old 13.1. Old 13.2's own three sanity questions ("why does this entity
exist," "is the relationship type right," "any single-value-only entity") were **dropped as
trainee-facing material** — the user's explicit call — and folded into `data-model/SKILL.md` §1.6 as
Claude's own pre-presentation self-check instead, since a non-technical trainee can't meaningfully
verify them and re-stating them as review items just re-created the manual-matching burden extraction
was built to remove.

**Three more defects caught in the same review, fixed alongside the reorg:**

- **"المفاتيح" (keys) was used undefined, and collided with "مفتاح API" taught on Day 1** — slide 13
  (§14 concept) uses the same bare word for account/API keys three slides after §13 would have used it
  for database keys. Fixed by renaming the term to **"مفتاح التعريف"** everywhere in §13/§14.2 material
  (deck, curriculum, skill) and tying the explanation to the ID concept the trainee already has (a
  user's own ID number), never to PK/FK terminology — first introduced via a `.qmark` tooltip on slide
  6, the deck's first use of that component.
- **Nothing ever instructed writing 13.1's output to `PRODUCT.md` §6** — curriculum's old 13.2 step 1
  assumed the entities were "already" there, but only slide 10's prompt text mentioned the location,
  and no instruction ever told Claude to write at that point. Fixed with a new explicit instruction
  (`data-model/SKILL.md` §1.7, curriculum 13.1 step 3) to write the complete model immediately after
  presenting it, before 13.2 begins.
- **Slide 4's third goal card said "المرحلة الثانية من بناء الواجهات"** ("the second phase of
  interface-building") — stray leftover framing; Day 6 is about the data model and tables, not
  interfaces (that was §12, Day 5). Replaced with language describing what the day actually does:
  model-on-paper becoming a real working table.

---

## Two stale cross-day references caught and fixed before they could ship

**1. chrome-devtools' connection was mis-attributed to Day 6 in three places.** §14.2's own step 1
told the trainee to connect chrome-devtools — but §7.10 already connects it on **Day 1** (confirmed in
both the trainer and trainee agenda rows there), and `bootcamp-setup/SKILL.md` and
`building-features/SKILL.md` both already said so. §17's tools table and §15's quick-term note still
pointed at §14.2 as the connection site. All three fixed to point at §7.10, with §14.2's step
rewritten as a one-line explanation of what the tool does (since Day 6 is genuinely where its first
real *use* happens) rather than a connect instruction. `deck/handout/index.html`'s Day-6 block carried
the same error twice (a 6 د trainer row and an 8 د trainee row both titled «ربط chrome-devtools») —
removed, with their minutes re-merged into the neighbouring Supabase-MCP rows (16→22 د, 30→38 د) so
both session totals stayed unchanged.

**2. Day-1's 29-task map still described the pre-reshape 13.1.** The table's own row read «وصف
البيانات اللي يحفظها مشروعك، بكلامك» — accurate before this session's reshape, stale after it. Its
`تقرّر وتوصف` classification was **kept**, not changed: by the same logic that keeps §12.1 classified
as `تقرّر وتوصف` even though extraction is Claude's, the task's defining trainee action is still the
elicitation (stating what's missing), so only the one-line description was reworded, not the category.

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم السادس | `sag-title` dark | — | |
| 2 | مهامّ اليوم: شرح (46 د) + تطبيق (58 د) | 2 × `.sess` | — | شرح's four rows trace exactly to §2.6's 14+7+14+11; تطبيق's four rows trace to the curriculum's own 20+8+22+8 breakdown |
| 3 | مهامّ اليوم: عمل (84 د) + مراجعة (27 د) | 2 × `.sess` (first as `tasks--tree`) | — | عمل's first row is a generic section-level parent («13 · نموذج البيانات», 38 د total, undivided per the curriculum, `ref` → `s13-tasks`) with four `task--l2` children, one per real sub-task: 13.1 «نموذج بياناتك الكامل» (→ slide 8, the slide that actually carries its `.promptbox`), 13.2 «تراجعه بثلاث مرّات» (→ slide 9), 13.2 «الفجوة الأخيرة» (→ slide 10), 13.3 «الرسم ومراجعته» (→ slide 11, likewise its own `.promptbox` slide) — after two rounds of user correction: first that the combined label was mislabeling 13.1/13.3 content as review, then that the fix had gone too far and dropped 13.1/13.3 as trainee actions entirely; مراجعة's 3 rows trace to 12+9+6 |
| 4 | أهداف اليوم | 3 cards + lead | — | Enriched from an initial 2-card draft that screenshotted sparse (see below) — lead line + 3rd goal (مخطّط ERD يطابق الواقع) added; 3rd card's "المرحلة الثانية من بناء الواجهات" stray line fixed in the same-day review |
| 5 | §13 — الكيان والحقل والعلاقة | 3-card bento + plain card | `s13-concept` | Entity/field/relationship each glossed *what it is · what it does · when you'd use it*, relationship examples drawn from درّسني (tutor↔session 1—N, tutor↔subject N:M); the plain card's bare "المفاتيح" mention removed in the same-day review (never defined on this slide; first use moved to slide 6) |
| 6 | §13 — مهامّ هذا القسم | 3-card bento + plain card + `<template class="terms">` | `s13-tasks` | Each task framed by دورك فيها, mirroring §12's "never label by who performs it" rule; 13.1's card is the deck's **first use of `.qmark`**, introducing **"مفتاح التعريف"** tied to the ID concept (not PK/FK), explicitly disambiguated from Day 1's API-key tooltip |
| 7 | المهمة 13.1 — من الكيان إلى النموذج الكامل | lead + 2-card bento (extract / complete) + `.card--state` (gap-by-question) + `.card--plain` (real two-column example) | `task-131` | No `.promptbox` on this slide — the single merged prompt moved to slide 8, since gap-closing must resolve before the model-completion half of the same request makes sense to show. Added a real worked example — درّسني's «ملف المدرّس» entity, pulled from `trainee-test`'s filled `PRODUCT.md` §6 — as a `.bento[data-cols=2]` nested inside one `.card--plain`, mirroring the slide's own extract/complete split with real data instead of the abstract lists alone; needed `gap:var(--sp-2)` on `.sag-slide__body` to clear a 2px overflow |
| 8 | المهمة 13.1 — أنواع العلاقات وجداول الربط | 2-card bento (relationship types / junction table) + `.card--plain` (real anecdote) + `.promptbox` | `task-131-model` | Carries the merged prompt (extraction text + model-completion text combined into one, per the user's explicit request) and the real booking-system anecdote (8 entities, unrequested `user_services`), moved here from the old slide 10 |
| 9 | المهمة 13.2 — ثلاث مراجعات بهذا الترتيب بالضبط | lead + 3-card bento + `.card--state` example + `.card--plain` note | `task-132` | Content unchanged from the old slide 8 (درّسني's real out-of-scope online-payment fact as the false-origin example) — only the task number, anchor, and lead paragraph changed to reflect reviewing a *complete* model rather than bare entities |
| 10 | المهمة 13.2 — الفجوة الأخيرة | lead + `.card--accent` + example + warning (two-case test) + `.promptbox` | `task-132-gap` | Content unchanged from the old slide 9 — only the task number and anchor changed |
| 11 | المهمة 13.3 — رسم الـERD ومراجعته | lead + 2-card bento + `.card--plain` (app.diagrams.net) + warning (rocket, conditional-diff tie-back) + `.promptbox` | `task-133` | Restructured from an initial stacked-cards draft that screenshotted sparse into a 2-col bento (see below); real empty-boxes anecdote from the curriculum reused. The rocket note was rewritten after a user correction: it originally told the trainee to ask Claude to redraw the ERD outright after 14.2, which would blow away any manual arranging done to the diagram — now says compare against the actual tables and update only the diff |
| 12 | ▶ المقطع: 13.1 + 13.2 + 13.3 | `stepvid`, real `<video>` | `demo-13` | **Shipped** 2026-10-06 — `tasks_13.mp4`, 4:02, 7 `data-t`-verified steps across 3 dividers (13.1 النموذج الكامل · 13.2 مراجعة النموذج · 13.3 الرسم ومراجعته), first step at `0:00` not skipping the lead-up, 7th step added for the diagram-arranging/formatting beat (`2:58`–end) after a user correction caught step 1 starting too late |
| 13 | §14 — تبني بمراحل صغيرة | 2×2 bento + `.card--plain` | `s14-concept` | Four ideas (small stages / review=try / Claude self-setup / context7) — this is the chapter's first formal concept teaching even though task 14.1 itself was already built on Day 1 |
| 14 | §14 — دورة العمل الواحدة | `.card--accent` (5-step flow + متى تحفظ note) + `.card--state` (كيف تراجع) + `.card--plain` (plan mode) | `s14-cycle` | **Caught a real bug here**: step 5 originally read "(commit و push)" — a direct و+Latin glue violating the house rule's own named example; fixed to "(commit &amp; push)" matching Day-1's established convention |
| 15 | §14 — المهامّ السبع | `.card--accent` (7-item ordered flow, day badges, «أنت هنا» on 14.2) + `.card--plain` | `s14-tasks` | 14.1 marked done (اليوم 1 ✔), 14.2 marked current (اليوم 6 ← أنت هنا) — "where you stand" framing applied to a 7-row list instead of the usual 3–4 card bento |
| 16 | المهمة 14.2 — جداولك الحقيقية تُنشأ الآن | lead + `.card--plain` (chrome-devtools note) + `.card--state` (real "لم يظهر خطأ" anecdote) + warning (rocket, conditional-diff tie-back) + `.promptbox` | `task-142` | Ties back explicitly to slide 11's 13.3 instruction. The promptbox's `data-copy` now ends with an explicit compare-then-update-only-the-diff clause (it previously didn't mention the ERD at all, even though the card above it did) — the ask-first-for-a-real-difference behavior was missing from the one prompt the trainee actually copies |
| 17 | ▶ المقطع: 14.2 | `stepvid`, real `<video>` | `demo-142` | **Shipped** 2026-10-06 — `task_14.2.mp4`, 2:25, 6 `data-t`-verified steps under «14.2 — إنشاء الجداول» (starting at `0:00`) plus one `stepvid__step--new` amber row under «مقارنة المخطّط بالجداول الفعلية» — the real take includes a genuine Supabase MCP reconnection episode not in the original placeholder script, and shows neither a diagram comparison nor a chrome-devtools app check, so the step list was rewritten to match reality. The amber row's own wording was corrected same-day from "redraw the ERD from the real tables" to "compare and update only the diff" — the original phrasing would have told the trainee to blow away manual diagram arranging for no reason |
| 18 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 19 | دورك الآن | 2 × `.sess` (first as `tasks--tree`) + note | `your-turn` | Split «راجع نموذجك وارسمه» (38 د: the same generic «13 · نموذج البيانات» parent plus all four 13.1/13.2/13.2/13.3 `task--l2` children as slide 3, identical `data-task-key`s so ticking any of them stays in sync across both slides) / «أنشئ جداولك الحقيقية» (46 د: 14.2 + push) — mirrors the §13/§14.2 tool-and-phase boundary established on slides 2, 12, 17 |
| 20 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 21 | مخرَج اليوم | 3 cards + tip card (real anecdote reprised) + quote | `day-review` | Closes on the same "لم يظهر خطأ لا تعني نجح" lesson from slide 16, generalized to "اليوم ولا في أي مهمّة بعده" |
| 22 | غدًا — اليوم السابع | `sag-closing` dark | — | «ايش نعمل بكرة» carries two cards, 14.3 الأدوار والصلاحيات and 14.4 تصفّح المحتوى والصفحة الرئيسية — added same-day after the user caught that the original single-card version named only 14.3 even though Day 7's own title names both and 14.4 owns more clock time (27+42 د vs 25+35 د); the 14.3 card keeps its original "the data you prepared today becomes tomorrow's permission basis" framing, 14.4's names the temporary home page getting its final §12 design |

---

## What the build caught — worth keeping

- **The sparse-slide rule just promoted into the skill caught two real instances on its very first
  outing.** The goals slide (4) first shipped with only 2 cards in a `data-cols="2"` bento and no lead
  paragraph — legal, `deckAudit()`-clean, and visibly using under a third of the frame when
  screenshotted. Fixed by adding a lead line and a third goal (3-card bento). Slide 11 (13.3) shipped
  similarly thin — four single-paragraph cards stacked vertically with no bento richness — fixed by
  pairing the first two into a 2-col bento with proper `card__top` icon+title headers. Both caught
  immediately because the just-promoted A.6.12 rule says to screenshot and judge every new slide by
  eye, not just run `deckAudit()` — which passed both before the fix.
- **A real register bug slipped through source-writing despite the rule being freshly promoted the
  same session.** Slide 14's work-cycle step 5 was written as "(commit و push)" — a direct و+Latin
  glue, the exact failure the house rule names "commit & push" to prevent. Caught only by reading the
  rendered screenshot, not by writing the source carefully the first time — confirming that even a
  rule just re-stated in the skill file does not self-enforce; the screenshot pass is still the actual
  gate. A full-file regex sweep after the fix confirmed no second instance.
- **A screenshot can misread correct text as a typo, and the fix is to check the source, not assume
  the pixel.** Two different slides appeared to show "فوزا" where the source read "فورًا" — a Cairo
  font rendering artifact of ر + ًا at small screenshot scale, not an actual spelling error. Verified
  by grepping the source directly before "fixing" something that was never broken. The lesson cuts
  both ways: trust the screenshot for density and layout, but verify text content against source
  before acting on what a compressed screenshot image appears to show.
- **"Redraw the diagram after the build changes it" needs a diff check in front of it, or it destroys
  work the trainee already did.** The 13.3/14.2 redraw instruction originally told Claude to redraw the
  ERD outright once the real tables existed — but by then the trainee may have manually arranged the
  diagram (slide 12's own 7th stepvid step is exactly that arranging pass), and a blanket redraw throws
  that away even when the tables match the model exactly. Caught by the user, who also traced the fix
  to its real arrow-type source: `trainee-test/diagrams/data-model.drawio`'s edges had been manually
  redrawn from `entityRelationEdgeStyle` to `orthogonalEdgeStyle` (draw.io's own default when dragging
  from a shape's edge midpoint) specifically because the old style produced ugly bends — meaning the
  "don't blow away manual work" principle already applied to the diagram once, just not yet to the
  redraw step itself. Fixed in the one place that actually governs it (`data-model/SKILL.md` §3.5) and
  mirrored into every slide that repeats the instruction (11, 16, 17) plus the one prompt the trainee
  copies (16's `.promptbox`, which hadn't mentioned the ERD at all before this pass) — compare first,
  update only a real difference, never redraw wholesale.
- **A task row's badge can claim coverage it doesn't have, and the tell is a mismatch with its own
  session name.** Slide 19's session head read «راجع نموذج بياناتك وارسمه» (review it, then draw it) —
  but the single task row inside it was badged «13.1 · 13.2 · 13.3» and worded as if "تراجعه" (review
  it) applied to all three, when review is specifically 13.2's job. Caught by the user; fixed by
  keeping the parent row as the overall 13.1→13.3 flow and splitting out 13.2's two real components —
  the three-pass review and the final-gap question — as `task--l2` children pointing at their own
  slides (9 and 10), mirrored onto slide 3 with the same `data-task-key`s so the checkbox state stays
  one task across both slides, not two independent ones.
- **Fixing a mislabeled task row can overcorrect into dropping real content, not just the label.**
  The previous fix (above) correctly split 13.2's review work out of a badge that falsely claimed it
  for 13.1 and 13.3 too — but in doing so left 13.1 and 13.3 with no trainee-facing row at all on
  slide 19/3, even though both have a real action (copy a `.promptbox` prompt) the trainee performs.
  The session name «راجع نموذج بياناتك وارسمه» should have been the tell: it names review *and* draw,
  not review alone. Fixed by making the parent generic (names only the section, «13 · نموذج
  البيانات», pointing at the section-overview slide rather than any one sub-task) and giving all four
  real sub-tasks their own child row, each `data-ref` pointing at the slide that actually carries its
  prompt (13.1 → slide 8, not the explanation-only slide 7; 13.3 → slide 11). The lesson generalizes:
  when a label turns out to overclaim, check whether the fix silently underclaims instead — removing a
  wrong scope is not the same as removing content, and "two tasks for the thing that was wrong" doesn't
  mean "nothing for the things that were already right."
- **A fully-shipped section's own reference doc can go stale the moment the next day is built.**
  `showcase-strategy.md`'s Day-5 entry still described both recordings as "Not yet filmed" under
  planned filenames that never matched what was actually delivered (`tasks_12.1_12.2.mp4` vs. the
  stale `task-12.1-12.2.mp4`) — caught only because building Day 6 required reading that file again
  for the Day-6 entry, and the Day-5 entry sat right above it looking wrong by comparison. The same
  staleness pattern was waiting in `MEDIA_SHOTLIST.md`'s Day-5 header ("Neither filmed yet" sitting
  directly above two rows both marked ✅) — fixed in the same pass. A reference file is only as current
  as the last time something forced a re-read of it.
