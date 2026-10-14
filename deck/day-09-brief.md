# Day 9 — deck brief

The slide-by-slide record of `project-package/slides/day-09.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §2.9 for the agenda; §14's
المهمة 14.6, المهمة 14.7 and the «لمّا ينكسر شي: اقرأ ردّ Claude، وأعطه اللي يحتاجه» concept section for
content. If this brief and the curriculum disagree, the curriculum wins.

**21 slides.** Built 2026-10-13 as 22, restructured 2026-10-14 after the user's review (see «The
2026-10-14 restructure» below). The skeleton's 21 plus one deliberate extra recording slot (§14.6 gets
two recordings because on darrisni it builds five screens plus the «حصصي» actions, decided with the user
2026-10-11), minus one: the two-slide report block became a one-slide reminder. Preceded by a pre-flight
pass: every "What the build caught" and review section from days 3–8 was turned into a 25-row check
table, run during the build (results below).

**Day 9 budget:** شرح المفاهيم 44 د (11 + 14 + 12 + 7) · تطبيق مع المدرب 58 د (14 + 13 + 23 + 8) ·
عمل المتدربين 88 د (42 + 40 + 6) · مراجعة وعرض التقدم 25 د (18 + 7) = **215 د**. Two splits were invented
and written back into §2.9 and the handout's Day-9 block *before* the deck: شرح's undivided 26 د became
14.6 14 د · 14.7 and keys 12 د (the deck delivers them in different places), and تطبيق's 14.6 27 د
became part 1 14 · part 2 13 (one per recording). Day-8 precedent.

**Four problems found before any slide was drafted. All four were fixed in the package first:**

1. **The 11-minute concept block existed only as one agenda line.** Same gap as Day 8's «صياغة
   الأوامر». A curriculum section was written first. **Its first form was wrong** (a four-habit lesson
   under the name «قراءة تقرير Claude حين ينكسر البناء», built as slides 11–12, placed right before 14.7)
   and was redone on 2026-10-14; see the restructure section. Final form: a short reminder section
   «لمّا ينكسر شي: اقرأ ردّ Claude، وأعطه اللي يحتاجه», one slide, right after the recap.
2. **Screens could reach deploy unbuilt, because nothing assigned them a task.** darrisni's 14.5
   deferred the public tutor profile (`/teachers/[id]`, FR-13/14: the ratings, the core of the
   product) because «رحلتك لا تمرّ بها», with no destination. §14.6 covered "the dashboard", 14.7's
   "continue your features" slot covers only trainees with no external service, and Day 10 builds
   nothing. This is the 14.6 output-risk check the Day-8 brief asked for, and it turned out real.
   Fixed with an **inventory step** that opens 14.6: every §5 screen with no row in the §7 routes
   table, plus every display-only action, each assigned a place today. It lives in the curriculum
   (new step 1, new «راجع نتيجتك» bullet), in `building-features/SKILL.md` §ز (a full procedure with a
   completion gate), in §و (record a deferred item's destination *when* it is deferred), and on
   slides 8, 9 and 17.
3. **Both curriculum prompts used bracket placeholders.** §14.6 had «[حدّد البيانات]» and «[حدّد]»;
   §14.7 had «[اسم الخدمة]», «[الوظيفة]», «[الصقها]» and «[اسردها]». Rewritten to point at `PRODUCT.md`
   sections (§5 against §7, §2, §7's permissions table, §2's stakeholders, §1.1). The key is no longer
   pasted into the prompt; Claude asks for it after the numbered steps. All three prompts open with their
   task number.
4. **Day 8's closing slide previewed only 14.6.** Its brief defended that as "the one-task preview
   convention". No such convention exists, and it is the exact mistake the user corrected on Day 6.
   Added the 14.7 card and corrected the Day-8 brief's row.

**Also changed in §14.7 and the skill:** the recipient test («جرّب مع مستخدم غيرك» — some free tiers
deliver only to the account owner), leaked-key rotation, and a pointer to `deploying/SKILL.md`
§6.1/§7 for the production key at 16.3. Three «منتج» in §14.7's text became «مشروع» while the
section was being touched.

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم التاسع | `sag-title` dark | — | Footer line states the day's stake: «اللي ما ينبني اليوم ما ينبني أبدًا» |
| 2 | مهامّ اليوم: شرح (44) + تطبيق (58) | 2 × `.sess` | — | Rows in delivery order: the reminder block (11 د) → 14.6 concept → 14.7 concept |
| 3 | مهامّ اليوم: عمل (88) + مراجعة (25) | 2 × `.sess` + `.card--plain` | — | The note carries Day 8's early-finisher handoff: «بدأت 14.6 أمس… كمّل من حيث وقفت» |
| 4 | أهداف اليوم | lead + 2×2 bento + example card | — | The four §2.9 goals, with a darrisni example card built in from the start (Day 8 slide 4's sparse-first-draft lesson) |
| 5 | سبع مهامّ — وين تقف اليوم | `.card--accent` flow + 2-card bento | `s14-recap` | **Shipped sparse, fixed same pass**: ~40% of the frame was empty under a one-line note. Replaced with two real cards («ليش 14.6 قبل 14.7؟», «اليوم آخر يوم بناء») |
| 6 | لمّا ينكسر شي: اقرأ ردّ Claude، وأعطه اللي يحتاجه | lead + 3-card bento + card | `break-reply` | **New 2026-10-14; replaces old slides 11–12.** A reminder of the Day-6 loop, not a new lesson. Three cards, each = the rule + «شفته:» pointing at a clip the trainee already watched (14.5 part 1 for the decisions and the pasted error, 14.4 for the open defect). The fourth card, «الجديد في 14.7», says what is new: the errors now come from outside the project. Promoted from a footnote strip to a card for density |
| 7 | ايش لوحة التحكم؟ | lead + 4-col bento + plain card | `s146-concept` | Ties «لوحة التحكم» to Day 1's temporary `/dashboard` (the deck's only earlier use of the term — same page, now made real). One darrisni example per verb |
| 8 | آخر يوم بناء — اجرد اللي باقي | lead + 2-card bento + warning card | `s146-inventory` | States the test (A.6.13) and reuses Day 5's «جرد الشاشات» noun for the same idea. darrisni's real list is from `PRODUCT.md` §5 against §7 |
| 9 | المهمة 14.6: نفّذها | lead + 2-card bento + `.promptbox` | `task-146` | The booking anecdote («لا أريد صفحة «مواعيدي»…») carries the full framing formula |
| 10 | ▶ المقطع: 14.6 الجزء الأول | `stepvid--soon` | `demo-146a` | 8 `--idx` steps, 2 dividers. Step 4's English menu names first rendered scrambled under bidi; fixed with `tok-lat` spans |
| 11 | ▶ المقطع: 14.6 الجزء الثاني | `stepvid--soon` | `demo-146b` | 7 steps, 3 dividers. Two step headings given verbs |
| 12 | الخدمة الخارجية: ايش هي، ومتى تحتاجها | lead + 3-card bento + plain card + `؟` | `s147-concept` | The `؟` window defines «مفتاح API» and disambiguates it from Day 6's «مفتاح التعريف» (the term-collision check's one real hit). Third card added for density |
| 13 | مفتاحك سرّ: وين ينحفظ، ووين لا | lead + ✔/✘ bento + plain card | `s147-keys` | Names `.env.local`, the real filename the trainee saw on Day 1. Callback: §55's password refusal, which is in Day 8's part-1 clip |
| 14 | المهمة 14.7: نفّذها | lead + anecdote card + 2 × `.promptbox` | `task-147` | Both curriculum prompts (with and without a service) side by side. «لم أفهم إطلاقًا» anecdote framed |
| 15 | ▶ المقطع: 14.7 | `stepvid--soon` | `demo-147` | 7 steps, 2 dividers. A first draft named Gmail; removed, since trainee-facing text stays provider-neutral (the provider lives in the shotlist only) |
| 16 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 17 | دورك الآن | 2 × `.sess` (`tasks--tree`) + 2 notes | `your-turn` | 14.6 has three `task--l2` children (inventory → slide 8, panels → demo-146a, deferred actions → demo-146b), keys shared with slide 3 |
| 18 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 19 | ادخل بكل دور، وحاول تفتح اللي مو لك | lead + 2× 2-card bento | `day-review` | The role check is taught as a first run on per-role pages, not «تذكّر من اليوم 7». Uses the real message «ما عندك صلاحية» |
| 20 | مخرَج اليوم | 3 cards + tip (story, then «الدرس:») + quote | `day-outcome` | §56's hidden-link story told in full, then the lesson in its own paragraph |
| 21 | غدًا — اليوم العاشر | `sag-closing` dark | — | **First draft had three preview cards whose notes spilled 17–23px out of their cards**, a spill `deckAudit()` does not catch. Folded the course close into the 16.3 card: two cards, verified by a per-card child-bottom check |

*Built as 22 slides on 2026-10-13. Removed: old 11 «قبل المهمّة الجاية: اقرأ تقرير Claude صح»
(`report-read`) and old 12 «لمّا ينكسر شي: ايش تعطي Claude عشان يصلّح» (`report-give`). Added: the new 6.
Old 6–10 are now 7–11, and old 13–22 are now 12–21.*

---

## Pre-flight table — which rows fired

The 25 rows live in the planning file. These ones actually caught something during the build
(slide numbers are those of the current 21-slide deck):

- **#1 sparse slides:** fired on slides 5, 12 and 14. All three were fixed with real content, not padding.
- **#2 card spill invisible to the audit:** fired on slide 21. Found by the per-card bottom check
  (which was validated: it flagged that slide before the fix and nothing after it).
- **#5 framing:** two booking anecdotes (slides 9 and 14), both framed. The sweep found no unframed
  booking noun.
- **#6 term collision:** «مفتاح» (Day 6 = row ID) was handled in the `؟` window. «لوحة التحكم» (Day 1 =
  the temporary `/dashboard`) and «جرد» (Day 5 = screen inventory) were each the *same* meaning, so the
  slides reuse them deliberately.
- **#11 register:** five bold lead-ins opened with a و-word («وهذي», «ومتى», «ولكل», «والتقرير», «ومو»)
  and three sentences ended on a Latin token (full stop on the wrong side). All fixed. Family sweeps,
  و+Latin glue and digit sweeps found 0.
- **#16 diff before sync:** the first sync of this round overwrote `trainee-test`'s copies before
  diffing them. Checked right after: that repo only ever receives one-way syncs, so nothing was lost.
  Later syncs were diffed first. **It fired again on 2026-10-14:** `day-09.html` had user edits newer than
  the last sync (cover title, a Google Meet mention, the «مفتاح التعريف "id"» note), so the restructure
  was done as targeted edits on the newer file. And `trainee-test/CLAUDE.md` is that project's live
  progress ledger, so it is never copied over; the one-line rule change was applied to both files in place.

Rows that held without firing: prompts (3 curriculum → 3 promptboxes, `data-copy` identical, all
numbered, zero «[»), checkbox behaviour (cascade, rollup to partial and back, cross-slide sync,
reload persistence, Ctrl+click navigation without ticking), icons (all 16 defined), offline (0
remote references), `tok-code` (only passing mentions), `deckAudit()` (22, none overflow) and
`deckRefAudit()` (`[]`).

---

## What the build caught — worth keeping

- **The output-risk check the Day-8 brief asked for found a real gap, again in a shape nobody had
  predicted.** Day 8's version was "the journey is never written back". Day 9's is "a deferred screen
  has no destination". The common thread: **a task that defers something must record where it goes,
  or the next task has no reason to pick it up.** That is now a rule in `building-features/SKILL.md`
  §و. Worth running the same check on §15/§16 before Day 10. A candidate: ⚠ lines a trainee left unanswered
  during the build. Nothing in §15 or `testing-and-security/SKILL.md` tells Claude to look for them (the
  claim here earlier that §15 told the trainee to carry them in was true of the withdrawn first draft only).
- **A fact from the planning file was almost written onto a slide.** The plan's beats named Gmail,
  and slide 15's placeholder repeated it, against the plan's own "provider-neutral deck" rule. The
  pre-flight table did not catch it. Re-reading the plan's "not doing" list did.
- **The closing slide's preview column has a hard height limit.** Three cards do not fit next to a
  2×2 "what you finished" grid. When a day has more than two things to preview, fold them into
  cards rather than add a third.
- **A screenshot reads bidi faults the markup hides.** Slide 10's two English menu names inside «»,
  side by side in one sentence, rendered in a scrambled order. Fixed by giving each its own `tok-lat`
  span and an Arabic verb between them, the existing "two elements joined by an Arabic verb" rule.

---

## The 2026-10-14 restructure — what the user's review found, and what it taught

The user read slides 11–12 and rejected both their name and their position. The findings, in order of
how much they matter for the next days:

- **The first time a thing appeared in the real build is not the day it should be taught.** The
  «لك أنت» / «تفاصيل تقنية» split, the «⚠» line and the pasted-error habit all entered the real
  `trainee-test` log late (§17 for ⚠, §49 for the headings, §52–§56 for the rest), and slides 11–12 were
  written from those late sections, so they taught on day 9 of 10 what the course had needed from day 1.
  **When a slide is sourced from the build log, ask where the *deck* first needs the idea, not where the log
  first shows it.** Day 1 already showed the two-part split (the 14.1 clip's plan, 0:18), and Day 6 slide 14
  is where the review loop is formally taught.
- **A block named after an artifact reads as the artifact.** «قراءة تقرير Claude» was understood as "Claude
  will produce one report of everything so far". The content was the ordinary build–test–report loop. Name a
  block by what the trainee *does*, not by the noun they will meet.
- **A convention Claude "has" is not a convention until the package writes it down.** «⚠» as a flag and
  «قرارات اتّخذتُها» / «لم يُحلّ» as headings were habits of one real session. Nothing in `CLAUDE.md` or
  `.claude/rules/` asked for them, and the last two appear once each in the whole log. Slides must not teach
  a sign the package does not enforce. Resolved by writing **one** sign into the package: `bootcamp-mvp-process.md`
  §5.1 («⚠» lines live in «لك أنت»; the test is "if the trainee read only «لك أنت», did they miss a decision
  or an open item?") plus a pointer in `CLAUDE.md` §ب. The two invented headings were dropped.
- **A claim in this brief was wrong:** "three of them were already watched in Day 8's clips". The «ملاحظة
  أعمق لم تُحلّ» moment (§56) is in no clip at all. The open-defect example now comes from Day 7's 14.4 clip
  (3:50, «المهمّة تكتمل، ويبقى عطب واحد مفتوح»); the decisions and the pasted error come from Day 8's part-1
  clip (1:07, 2:08 and 2:50). §56 stays only in slide 20's tip.
- **What moved where.** Day 1: one sentence on slide 42's 0:18 step («وهذا شكل كل ردّ من Claude من هنا
  ورايح»), and a styled box on slide 45 under «49 دقيقة» (the two parts, plus the ⚠ line). No slide added.
  Day 6 slide 14: the one-paragraph «كيف تراجع نتيجة أي مهمّة» became a three-step card (read the reply and
  answer any ⚠, try it, report back with three things and the error pasted as-is); the same text went into the
  curriculum section of that name. Day 9: one reminder slide before 14.6. The «التقرير مو ضمان» card was
  dropped, since Day 6 (slides 16, 21) and Day 8 slide 8 already teach it twice.
- **Side fix, same pass:** Day 1 slide 45's setup column (eleven rows) ran 80px past its frame and covered
  its own «30 دقيقة، وتتفاوت بحسب جهازك» note. New `.tasks--scroll` modifier in `deck.css`, modelled on
  `.card--scroll`; the list scrolls inside itself so the note keeps its space.

---

## Still open

- **Recordings:** all three slots ship as `--soon`. Filming rules and beats are in
  `MEDIA_SHOTLIST.md` d9-1/d9-2/d9-3. **d9-3 pastes a real Gmail app password on camera; revoke it
  after filming.**
- **Day 8's dead-space band (slides 4, 6–9)** is still the user's decision; untouched.
- **The ⚠ rule changes what Claude writes for every trainee**, from the first reply of Day 1 (before,
  a ⚠ line was one real session's habit). Day 1's slide 45 box and Day 6's slide 14 teach it. Whether to
  sync the rule into `trainee-test` is done (the file is identical there); whether the next real run
  actually produces ⚠ lines in «لك أنت» is not verified until someone runs it.
- **Optional:** a one-line «سجّل وجهة المؤجَّل» rule in `bootcamp-mvp-process.md` §6 (always loaded).
  The skill already carries it, so it was not added silently.
