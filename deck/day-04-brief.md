# Day 4 — deck brief

The slide-by-slide record of `project-package/slides/day-04.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §2.4 plus §10.3, §11, §7.7,
§7.9, and the new §7.11. If this brief and the curriculum disagree, the curriculum wins.

**21 slides.** Built 2026-09-30, the first Day-4 deck — no earlier version existed. This is also the
day the 56-minute skill-authoring reservation (open since 2026-09-28) gets designed and built.

**Day 4 budget:** شرح المفاهيم 50 د · تطبيق مع المدرب 56 د · عمل المتدربين 86 د · مراجعة 23 د =
**215 د** (+ استراحة 25 د). Every band lands inside the published §1.1 ranges without widening them
— the cleanest possible landing for a day that had sat at a provisional 159 د for two days.

> **How the 56 د resolved.** Four open questions sat in `deck/skill-block-todo.md` (now deleted, its
> content folded into `conversation_history.md` §D154 and this file): recorded-or-live, how to teach
> a general method from one instance, fixed-menu-or-free-choice, and where the block lives in the
> curriculum. All four were answered in a dedicated planning pass before any slide was built — see
> `conversation_history.md` §D154 for the full research and reasoning (worked-example ordering,
> analogical encoding, a 238-skill defect study, bounded-choice literature) and §D155 for the design
> the user reviewed and corrected.
>
> **The design changed materially after user review.** The first draft proposed having trainees
> derive the six-slot structure themselves by reading two *package* skills
> (`writing-requirements` vs `drawio`). The user rejected this on two independent grounds: it
> violates a rule printed in the trainee-facing curriculum itself (`bootcamp_roadmap_and_curriculum.md`
> line ~785 — trainees never open `.claude/` files, that is Claude's job) and it offloads teaching
> onto the trainee, which contradicts the course's whole collaboration model. The comparison survived
> in a different form: **trainer-presented**, using two **real, standard, published Anthropic skills**
> (`internal-comms` vs `a11y-debugging`) instead of course-internal ones.

**Architecture, set by the user:** a brand-new Claude Desktop session (Code tab, `Environment: Local`)
on the project folder → a prepared starter prompt → the new package skill `authoring-skills` (elicits
the six slots, suggests answers from `PRODUCT.md`) → **`/skill-creator`** (builds the file). The
package skill never constructs `SKILL.md` itself — division of labour, matching the precedent already
in `user-journey/SKILL.md`, which hands off to `drawio` mid-procedure.

**Media: neither recording exists yet.** Both ship as `stepvid__video--soon` placeholders with full
step lists — see `MEDIA_SHOTLIST.md`'s new Day-4 section for the capture brief, including the
explicit instruction to capture a *real* first-run failure for slide 16 rather than staging one.

---

## Three decisions this deck encodes

**1. The comparison is presented, not derived — and uses market-standard skills, not course ones.**
Slide 12 puts `internal-comms` (32 lines, Anthropic, zero code) and `a11y-debugging` (91 lines,
Anthropic, zero code) side by side on one screen. Concurrent comparison is the mechanism (Rittle-Johnson
& Star); splitting them across two slides would waste it. Both being zero-code is deliberate — it is
the single fact most likely to disarm a non-programmer's fear that "writing a skill" means
programming.

**2. One recording, no live re-run — but the "own idea" gate is exercised live instead.** This
reuses the §16 "watched, not re-run" precedent from `day-deck-recipe.md`: a second performance of an
identical build teaches nothing. The trainer's freed minutes go to vetting each trainee's proposed
idea against the seven-question gate on slide 14 — the step that genuinely fails without a human in
the room.

**3. The menu is bounded choice, not a fixed list and not free choice.** Eight pre-vetted ideas
(input already exists on Day 4, no new account, output is a named file) plus a self-proposed idea
gated by seven yes/no questions. Two menu items needed re-scoping after research found real failure
modes: SEO is scoped to the share-card only (a page-by-page version breaks the build on every
`"use client"` route in the trainee's own Next.js app — verified against the actual codebase), and
Gmail is scoped to a triage report only (the official connector requests `gmail.readonly` +
`gmail.compose`, not `gmail.modify` — label writes are an open Anthropic bug, #47383).

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم الرابع | `sag-title` dark | — | |
| 2 | مهامّ اليوم: شرح (50 د) + تطبيق (56 د) | 2 × `.sess` | — | Rows verbatim from §2.4. Three new §7.11 rows in شرح (8+3 د) after the existing 7.7/7.9 rows |
| 3 | مهامّ اليوم: عمل (86 د) + مراجعة (23 د) | 2 × `.sess` | — | New §7.11 rows in both: 14+12 د in عمل, 3 د in مراجعة |
| 4 | أهداف اليوم | 4 cards | — | Fourth card is new: authoring a skill explicitly exceeds the brochure's own "using" promise |
| 5 | §10.3 — صفات الجودة | 1 card (5-item list) + prompt + note | `task-103` | The five NFR categories from the curriculum, the ready-made prompt, and the "خلال ثانيتين لا سريع" distinction |
| 6 | §11 — المفهوم العام | 2 cards | `s11-concept` | رحلة المستخدم / مخطّط النشاط, with an Activity-Diagram `.ttip` |
| 7 | §11 — الصيغة الموحّدة ومهامّ القسم | 2 cards + unified-format snippet | `s11-tasks` | The template block, and the two tasks (11.1 write, 11.2 diagram) |
| 8 | المهمة 11.1 ثم 11.2 — نفّذها أنت | 1 card (5 steps) + prompt | `task-111` | "Your journey is already written — just reordered" framing, matching the curriculum's own lesson |
| **9** | **▶ المقطع: 10.3 ثم 11** | **`stepvid --soon`** | `demo-103-11` | Placeholder, 6 ordinal steps across 3 dividers. Capture brief in `MEDIA_SHOTLIST.md` |
| 10 | §7.7 — القواعد والمهارات | 2 cards + 2 plain-note cards | `s77` | Existing curriculum content, unchanged in substance |
| 11 | §7.9 — بنية ملفات Claude Code | 2 cards (عامّ / محلّي) | `s79` | File-tree rendered as two cards rather than raw ASCII — cleaner RTL behaviour than a code-fence tree |
| **12** | **§7.11 — مهارتان حقيقيتان جنبًا إلى جنب** | 2 cards + note | `s711-concept` | **The load-bearing slide.** `internal-comms` vs `a11y-debugging`, both real, both zero-code |
| **13** | **§7.11 — الخانات الستّ والنوعان** | 1 card (6-item list) + 2 cards + warning card | `s711-slots` | Carries the 238-skill defect-distribution statistic |
| **14** | **§7.11.1 — البوّابة والقائمة** | 2 cards + note | `task-7111` | Seven gate questions + eight-item menu; "write your choice now" pre-commitment |
| **15** | **§7.11.2 — كيف تشتغل عمليًّا** | 1 card (3 steps) + `.promptbox` + note | `task-7112` | Claude Desktop / Local instructions, the `skill-creator` availability check with its `.snipbox` fallback command, and the full starter prompt |
| **16** | **▶ المقطع: مهارة كاملة من الصفر** | **`stepvid --soon`** | `demo-711` | Placeholder, 5 steps across 3 dividers, one `stepvid__step--new` amber row for the real first-run failure |
| 17 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 18 | دورك الآن | 2 × `.sess` nested + note | `your-turn` | "أكمل متطلباتك ورحلتك" (60 د) + "ألّف مهارتك" (26 د) — every task key mirrored from slides 2–3 |
| 19 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 20 | مخرَج اليوم | 3 cards + quote | `day-review` | Quality metrics, journey match, and "your skill ran once for real" |
| 21 | غدًا — اليوم الخامس | `sag-closing` dark | — | Points forward to §12 التصميم, and deliberately hooks it to the "جولة قبل العرض" skill's report as motivation |

---

## What the build caught — worth keeping

- **A planning-stage design was overturned by user review, and the reason was a printed rule, not a
  preference.** The first draft of the comparison exercise asked trainees to open and compare two
  files under `.claude/skills/`. That is not a style choice this project could weigh either way —
  `bootcamp_roadmap_and_curriculum.md` itself tells the trainee, in plain text, that `.claude/` is
  Claude's business and there is no reason for them to open it. **When a design decision touches
  what the trainee is asked to *do*, check it against the curriculum's own printed rules before
  treating it as a judgement call.**
- **"Curriculum-only, not used by the build itself" is a real, reusable category.** Both `skill-creator`
  and Claude Desktop's Code-tab role needed registering in the root project's own `CLAUDE.md` tools
  line, and the existing `Supabase MCP` entry already carried the exact right qualifier
  ("*curriculum default stack only*, not used by the booking build itself") to copy verbatim for both.
- **A menu item can look safe and still break on contact with the real codebase.** "Generate SEO
  metadata" reads as an easy, obviously-useful skill. Checking it against the trainee's actual
  Next.js app (`app/frontend/`) found that 10 of its 11 routes are `"use client"` components, where a
  `metadata` export is not just unsupported but a **build error** — invisible until a non-programmer
  hits a wall of text they cannot parse. **A skill idea that sounds generically safe still needs
  checking against the specific codebase it will run against, not just against the platform's docs.**
- **A permission a service reports is not the same as a permission a feature needs.** "Fetch and
  label email" sounds like one scope. The official Gmail connector's actual OAuth scopes
  (`gmail.readonly` + `gmail.compose`) do not include `gmail.modify`, so label-writing fails — a
  defect confirmed via an open, unresolved upstream bug report, not assumed. **Verify the exact scope
  set behind a "yes, it can do that" before designing a lesson around it.**
- **The "watched, not re-run" pattern generalises past its original case.** It was written for a
  one-time, account-bound deploy (§16). It applies just as cleanly here for a different reason: not
  because repeating it is impossible, but because a second identical skill-build teaches nothing a
  first one didn't. **The test that actually matters is "would a second performance produce new
  information," not "is this section literally about deployment."**
- **A "failure" step in a stepvid needs footage of an actual failure.** Slide 16's
  `stepvid__step--new` row describes the skill not triggering on its first real test. The shot list
  says explicitly not to stage this — capture the genuine first miss, because a scripted failure
  reads as scripted, and this exact lesson (a description is a guess until tested) is the same one
  already sitting in `writing-requirements/SKILL.md` §5.1.1 from the Day-3 video.
