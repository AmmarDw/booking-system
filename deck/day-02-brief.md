# Day 2 — deck brief

The slide-by-slide record of `project-package/slides/day-02.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §2.2 (lines 217–275) plus
§8 (1136–1326) and §9 (1328–1482). If this brief and the curriculum disagree, the curriculum wins.

**19 slides.** Was 21 at first build, then 22 after the 8.1 refactor added the task-8.1 teaching
slide. The 2026-09-25 showcase reversal took it to 19: the «تطبيق مع المدرب» break slide and three
BookIt slides went out, one recording slide came in. The §9 rebuild later the same day **kept it at
19** — slides 12, 13 and 14 were rewritten in place, not added to.

**Day 2 budget:** شرح المفاهيم 48 د · تطبيق مع المدرب 58 د · عمل المتدربين 82 د · مراجعة 27 د = **215 د**
(+ استراحة 25 د), matching the fixed per-day total at curriculum line 68. The first two bands still
exist as *budget*; they are simply **delivered interleaved** rather than back to back.

**Media: two recordings**, both darrisni, both end to end:
`project-package/slides/media/tasks-81-82.mp4` (3:24, tasks 8.1+8.2) and `tasks-91-92.mp4` (1:49,
tasks 9.1+9.2). **As of 2026-09-25 no BookIt content remains on any Day-2 slide.**

---

## Showcase form — the reversal

Day 2 was originally built with **no media at all**, on the reasoning that §8/§9 are pure thinking
work with nothing to film, shown instead through the `chatlog` component replaying BookIt's real
conversation.

**That was wrong on both counts.** Thinking work *does* have a screen — the prompt being written, the
reply arriving, the file changing — and the first recording proves it films fine. And a replay of a
finished project shows a *result*, not a *method*: the trainee has nothing to copy. Per
`references/showcase-strategy.md`, darrisni now supplies recordings for «شرح المفاهيم», BookIt is
retired from the showcase role, and the live session needs a third project that has **not yet been
chosen**.

The `chatlog` component is **dead**: its last instance was slide 14, replaced by the §9 recording on
2026-09-25. Its CSS/JS stay in `deck.css`/`deck.js`, but no deck uses it and no new `chatlog` slides
should be authored.

---

## Slides

| # | Slide | Component | Source | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم الثاني | `sag-title` dark | §2.2 | Same brand opener as Day 1, retitled to the day |
| 2 | مهامّ اليوم: شرح المفاهيم (48 د) + تطبيق مع المدرب (58 د) | 2 × `.sess` | §2.2:225-251 | Both blocks kept, but the footer note now states the interleaved delivery. The §8 row opens on slide 5 (`s8-flow`); **both §8 demo rows point at `demo-8` and both §9 demo rows at `demo-9`** — one recording covers two tasks in each case |
| 3 | مهامّ اليوم: عملك (82 د) + مراجعة (27 د) | 2 × `.sess` | §2.2:253-273 | The two «حفظ ورفع» rows are **different tasks** with different keys |
| 4 | أهداف اليوم | 3 cards | §2.2:221-223 | **Goals last in the block**, per A.6.8 |
| 5 | من كلامك إلى خطة مشروعك | `.stageflow` | §8 | **Self-contained recap** — `resolveRef` cannot cross day files, so Day 1's flow is restated. Block is **byte-identical** to Day-1 slide 28. Anchor `s8-flow` added so slide 2 can open here |
| 6 | القسم 8 — مهمّتان | 2 + 2 cards | §8:1164-1171 | Anchor `s8-tasks`. Title rewritten to name both outputs. Carries the plan-mode reminder |
| 7 | 8.1 — فكرتك في أربعة أسئلة | `.flow--ask` + 2 cards | §8:1187-1216 | Anchor `task-81`. Identical frame to Day-1 slide 48; only the status line differs. Title note names `notebook.txt` |
| 8 | 8.2 — النطاق ثلاث قوائم | 3 + 2 cards + `؟` | §8:1267-1270 | Anchor `s8-scope`. Warning tone lowered, and the amber card now explains that «خارج النطاق» and the future plan legitimately overlap. `؟` defines «الرحلة الأساسية» and names Day 4 |
| **9** | **المقطع: المهمّتان 8.1 و8.2** | **`stepvid`** | recording | Anchor `demo-8`. 12 steps, 2 dividers, one amber competitor-research row with no `data-t`. **Replaces old slides 12–14** |
| 10 | القسم 9 — مين أصحاب المصلحة؟ | 4 cards | §9:1332-1345 | Anchor `s9-concept`. The «كيان» term window was **removed** from here — the slide talks about «الدور» and never uses the word |
| 11 | القسم 9 — مهمّتان + مثال عام | 2 + 1 cards | §9:1347-1363 | Anchor `s9-tasks`. The inventory example is deliberately not BookIt |
| **12** | **9.1 و9.2 — اكتب المهمّتين في دفترك** | 2 cards + note + `؟` | §9:1380-1395 · curriculum prompts | Anchor `task-9`. **Rebuilt.** Carries the ready-made prompt for **both** 9.1 and 9.2 — they existed in the curriculum but had never reached a slide. Keeps the «كيان» window; the darrisni example replaced BookIt's role cards, which also retired «التوفّر»/«التوليد» |
| **13** | **9.1 — سؤال التداخل** | 2 cards + note | §9:1414-1427 | Anchor `s9-overlap`. **Refined.** Lead case is now teacher-opens-a-student-account (darrisni, and what the next slide's video plays out) — it needs no domain setup. The booking case survives only as the «what asking late costs» beat |
| **14** | **المقطع: المهمّتان 9.1 و9.2** | **`stepvid`** | recording | Anchor `demo-9`. 11 steps, 3 dividers, one `stepvid__fix`. **Replaces the last `chatlog`** |
| 15 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | **First of only two breaks now** |
| 16 | دورك الآن | 2 × `.sess` nested tasks + 2 prompt cards | §2.2:253-262 | Anchor `your-turn`. The two definition sub-tasks now carry `data-ref="task-81"` |
| 17 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | Second break |
| 18 | مخرَج اليوم | 3 cards + quote | §2.2:264-273 | Anchor `day-review` |
| 19 | غدًا — اليوم الثالث | `sag-closing` dark | §2.3 | §10 المتطلبات + §16 أول نشر |

---

## Decisions worth keeping

- **No cross-day deep links.** `resolveRef` searches only the current document, so slide 5 restates
  the flow rather than pointing at Day 1. Every future day inherits this constraint.
- **A null `data-ref` used to jump to slide 1.** `resolveRef(null)` matched the first slide *without*
  a `data-anchor`, so all 22 unlinked task rows across both decks silently navigated to the cover.
  Fixed with a one-line guard in `deck.js`. This is what "refers to 1" meant.
- **«خصائص المدرب طلعت ستّ» is gone.** It warned that the trainer broke the 3–5 limit. darrisni
  landed on **five**, inside the limit, so the warning had nothing left to warn about.
- **The out-of-scope / future-plan lists are the same three items** in darrisni (payment ·
  notifications · advanced filters). That is not a defect to hide — slide 8 now explains that the
  difference is intent, not content.
- **The recording shows an older deck's underlying session, edited.** Slide 7's ready-made prompt said
  «فقرة تجمع المشكلة والهدف» when it was filmed; the trainer corrected it to two separate paragraphs
  during that same session — but **cut that correction round out of the published video on purpose**,
  to avoid showing trainees a mistake the deck no longer makes. Slide 9 originally had a step built
  from the written session log describing that correction as if it were on camera; it wasn't, and the
  step was removed. What is actually on screen at that timestamp is the trainer writing one message
  that agrees to the scope, picks option (أ), and approves the last two lists — verified from frames,
  not the transcript. The superseded wording was separately cleaned out of the curriculum (three
  places) and slide 6.
- **Verify recordings against frames, not against a transcript.** An auto-generated summary of this
  video claimed the prompt was typed into `PRODUCT.md` (it was the Claude chat panel), called Notepad
  "Antigravity IDE", and missed the correction round entirely. Frames settled all three.
- **«خصائص», never «مجالات».** ⚠ This entry was wrong when first written — it claimed four files had
  been fixed when only two had. **Lesson: a narrow grep that returns clean is not proof; grep the
  bare term.**
- **§9's ready-made prompts existed but had never reached a slide.** `bootcamp_roadmap_and_curriculum.md`
  carried «صياغة مقترحة تعطيها لـ Claude» for both 9.1 and 9.2 while the deck had none — a straight
  violation of the deliberate-redundancy rule (`CLAUDE.md` §A.5), and invisible because §8's slides
  *did* have theirs. **When a section gets a task slide, grep the curriculum for its prompt.**
- **A §9 step said the video opens on a slide; it opens on Notepad — one second later.** Both are
  true, which is why frame-checking beats trusting either the transcript or a single frame.
- **What the trainee did *not* type is the lesson.** The auto-generated summary claimed an explicit
  «create a Markdown table and update `PRODUCT.md`» instruction. The frames show the opposite: a raw
  notebook paste plus «ask me if you're unsure». The step says so.
- **Claude answered with two questions, not an answer** — and one of them quotes Day-2's own overlap
  slide back. That is the single strongest moment in the recording and the reason slide 13 survives as
  its own slide rather than being folded into 12.
- **Answering §9 edited §8's output.** The trainee's overlap answer added a fourth item to the
  «خطة التطوير» list written in task 8.2 the day before. Worth keeping visible: task outputs are not
  frozen when the task ends.
