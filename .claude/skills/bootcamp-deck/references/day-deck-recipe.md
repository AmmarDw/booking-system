# Day-deck recipe

How to build `day-NN.html` for days 2–10 without re-deciding anything Day 1 already settled.

**Day 1 is not the template.** It carries one-time onboarding — the package tour, the legend, Claude
Code basics, the skills map, the 29-task map — roughly 18 slides that never recur. Days 2–10 are
much smaller and all share the skeleton below.

---

## The skeleton

```
 1  الغلاف                      sag-title, dark
 2  مهامّ اليوم — شرح المفاهيم + تطبيق مع المدرب      2 × .sess
 3  مهامّ اليوم — عملك على مشروعك + مراجعة            2 × .sess
 4  أهداف اليوم                 ← goals LAST, never first
    … شرح المفاهيم content slides …
 ▸  فاصل: تطبيق مع المدرب       sag-quote, dark, badge-only footer
    … showcase slides (chatlog or stepvid) …
 ▸  فاصل: عملك على مشروعك       ← carries the "ticking is your job" line
    دورك الآن                   nested task checklist, LIGHT surface
 ▸  فاصل: مراجعة وعرض التقدم
    مراجعة اليوم
    غدًا — اليوم N+1
```

Three break slides, never four: the day *opens* on شرح المفاهيم, and a "we start now" slide in front
of the first thing is not a transition.

---

## Both sessions run every day

- **«شرح المفاهيم»** — explanation and tutoring. Carries the **showcase**: a recording, or a
  conversation replay, of the same tasks being done for real.
- **«تطبيق مباشر مع المدرب»** — the trainer opens Claude Code and executes *that day's* steps live.

They are not alternatives; every day 2–10 has both. **Day 1 is the only exception** — its first
session is course preparation that cannot be re-executed live.

Which project fills which slot, and what material exists per section, is in
[`showcase-strategy.md`](showcase-strategy.md).

---

## The fixed numbers

**Every day totals 215 minutes** plus a 25-minute break — stated at
`bootcamp_roadmap_and_curriculum.md:68` as fixed for *every* day, not just day 1. The four session
durations on slides 2–3 must add up to it. Never inflate a total to fit new content in; reallocate
inside a band instead.

Day 2, for reference: شرح 48 · تطبيق 58 · عملك 82 · مراجعة 27 = 215.

---

## Build order

1. **Read the curriculum's `### 2.N` block first** and copy the task rows verbatim — section number,
   duration, parenthetical note. These become slides 2–3 and the «دورك الآن» checklist, and they are
   the source of truth. The deck never invents a task.
2. **Read that day's `## N` curriculum sections in full** (e.g. Day 2 = §8 + §9). The «ما كتبه
   المدرب» collapsibles in them are *already curated* showcase excerpts — use them rather than
   re-mining `conversation_history.md`.
3. **Read the matching `project-package/.claude/skills/*/SKILL.md`.** The slides must not teach
   something the skill will contradict when Claude executes it live.
4. **Check where the output lands** in `project-package/PRODUCT.md`. If the slide promises a
   three-column table and PRODUCT.md has two, one of them is wrong — fix it before shipping.
5. Copy the skeleton, then fill it from `day-01.html` component by component.
6. Verify (below), then sync `deck/DECK_BRIEF.md` and `deck/MEDIA_SHOTLIST.md`.

---

## Task keys

The day-plan rows (slides 2–3) and the «دورك الآن» checklist are **the same tasks in two places**.
Give each an explicit `data-task-key` so ticking either moves both, and hang the checklist's subtasks
off the parent key with `data-parent`.

`localStorage` is namespaced by filename (`sag-deck:day-02.html:tasks`), so keys never collide
across days. Reuse the same key names day to day if you like.

---

## What does not carry across days

- **`data-ref` cannot cross files.** Day 2 cannot deep-link to a Day-1 slide. Anything a later day
  depends on must be **restated briefly in that day's own deck** — a short recap slide, not a
  pointer. Day 2's الغاية/الخاصية recap exists for exactly this reason.
- **Checkbox state** is per-file, by design.
- **The `؟` term window** reads one `<template class="terms">` per slide, so a term explained on
  Day 1 must be re-explained if Day 2 needs it.

---

## Verification (same gate as Day 1)

- `window.deckAudit()` → `N slides, none overflow`, live via chrome-devtools. The nested checklist
  slide is always the highest overflow risk.
- `window.deckRefAudit()` → `[]` — also proves no ref is pointing at a Day-1 anchor that does not
  exist in this file.
- Checkbox behaviour exercised in the browser: parent cascades down, children roll up to `partial`
  then to a check, the same key agrees on both slides, state survives reload, Ctrl+click navigates
  without ticking.
- Register sweeps **on the new file**: و+Latin glue → 0 · «طرفية» → 0 · «يسوّي» → 0 · no task row or
  title opening with a و-word · singular address throughout.
- Session durations on slides 2–3 sum to 215 د.
- Commands are `.snipbox`, output is bare `.snip`, `tok-code` only for passing mentions.
- Offline: no remote font, stylesheet, script or image reference.
- Screenshot and actually read the cover, the goals slide, each showcase slide and the checklist.
