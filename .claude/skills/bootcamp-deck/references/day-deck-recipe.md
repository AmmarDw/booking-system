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
    … §A theory slides …
 ▶  المقطع: §A                  stepvid — the recording of §A's tasks
    (trainer re-runs §A live here — no slide)
    (…unless §A is one-time and account-bound — then it is watched only; see below)
    … §B theory slides …
 ▶  المقطع: §B                  stepvid
 ▸  فاصل: عملك على مشروعك       ← carries the "ticking is your job" line
    دورك الآن                   nested task checklist, LIGHT surface
 ▸  فاصل: مراجعة وعرض التقدم
    مراجعة اليوم
    غدًا — اليوم N+1
```

**Two break slides from Day 2, never three.** «شرح المفاهيم» and «تطبيق مع المدرب» are delivered
interleaved — explain a section, play its recording, re-run it live — so there is no transition to
mark between them. The day also *opens* on شرح المفاهيم, and a "we start now" slide in front of the
first thing is not a transition either. (Day 1 is the exception and keeps three.)

---

## Both sessions run every day — and they run together

The order is fixed and repeats per section:

1. **«شرح المفاهيم»** — the trainer explains that section's concepts from the theory slides.
2. **The recording** — a `stepvid` slide of those same tasks performed for real on a live project.
3. **«تطبيق مباشر مع المدرب»** — the trainer executes the same steps live, in front of the room.

Then the next section repeats all three. They are not alternatives and they are not two blocks: the
deck interleaves them, which is why there is no break slide between them. **Day 1 is the only
whole-day exception** — its first session is course preparation that cannot be re-executed live.

### The one per-section exception: watched, not re-run

**A section whose task is one-time and account-bound is watched, not re-run live.** Step 3 drops for
that section alone; steps 1 and 2 stay.

The test is whether a second live performance would produce anything. Deploying an
already-deployed project does not — the link exists, and the account-level steps (signup, the OAuth
confirmations) happen once per person, ever. Re-running it in the room would be theatre.

Known cases: **§16 first deploy (Day 3)** and **§16.3 final redeploy (Day 10)**. Decided 2026-09-25.

Two obligations when this applies:

- **Say it on the slide.** The recording slide's title or badge must state it is watched, and the
  day-plan slide's session note must match. Silently dropping the live third looks like an omission.
- **Do not touch the minute budget.** The band stays as the curriculum sets it; the time goes to
  watching, explaining and answering, not to a second deploy.

Which project fills which slot, and what material exists per section, is in
[`showcase-strategy.md`](showcase-strategy.md).

---

## When the recording does not exist yet

**Ship the slide anyway.** A day's recordings are usually filmed *after* its deck is built, and the
steps are knowable before the capture is — they come from the curriculum's own numbered steps, which
is what the recording will follow. Waiting is the wrong default, and so is faking timestamps.

Use `stepvid__video--soon`, which exists for exactly this:

```html
<div class="stepvid__video stepvid__video--soon">
  <p class="stepvid__soon"><span class="i i-clock"></span>المقطع تحت التصوير</p>
</div>
…
<li class="stepvid__step">
  <span class="stepvid__mark stepvid__mark--idx">١</span>
  <div class="stepvid__body">…</div>
</li>
```

Three rules while a slide is in this state:

- **No `<video>` element, no `data-t`, no `stepvid__time` button.** Steps carry
  `stepvid__mark--idx` ordinals instead. A dead `0:00` that seeks nowhere is a worse lie than an
  honest dashed box — and `initStepVideos()` is built to skip a step with no `data-t`, so the
  placeholder costs nothing at runtime.
- **Write the steps as the trainee will experience them**, not as a shot list. They are teaching
  content the moment the slide ships, whether or not the video ever arrives; the room can be walked
  through them unaided.
- **Record the planned filename and scope in `deck/MEDIA_SHOTLIST.md`, marked ⬜.** That file is
  where the person holding the camera looks.

> **The icon set is closed — 22 icons in `assets/icons.css`, and there is no video, film, camera or
> play icon.** `i-clock` is the one to use on a تحت التصوير box. A `class="i i-…"` that is not
> defined there renders as **nothing at all** — a CSS mask with no source, silently invisible, and
> `deckAudit()` will not catch it. Grep `icons.css` before using an icon name you have not used
> before.

**After filming**, swap the box for a real `<video>`, convert every ordinal to its `data-t`
timestamp — and re-check each step against **extracted frames, not the transcript**. Auto-generated
summaries have been wrong about the editor, the paste target and an entire edited-out exchange; the
discipline is in [`showcase-strategy.md`](showcase-strategy.md).

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
3. **Grep those sections for «صياغة مقترحة تعطيها لـ Claude» and account for every hit.** Each
   ready-made prompt in the curriculum **must reach a slide** — they are half of the deliberate
   redundancy `CLAUDE.md` §A.5 requires, and the slide is the half the trainee actually reads.
   Count them before building and check the count again after. *§9's two prompts were missed exactly
   this way: they sat in the curriculum while §8's neighbouring pair were on slides, so nothing
   looked wrong.*
4. **Read the matching `project-package/.claude/skills/*/SKILL.md`.** The slides must not teach
   something the skill will contradict when Claude executes it live.
5. **Check where the output lands** in `project-package/PRODUCT.md`. If the slide promises a
   three-column table and PRODUCT.md has two, one of them is wrong — fix it before shipping.
6. Copy the skeleton, then fill it from `day-01.html` component by component.
7. Verify (below), then sync that day's brief in `deck/` and `deck/MEDIA_SHOTLIST.md`.

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
- Register sweeps **on the new file**: و+Latin glue → 0 · «طرفية» → 0 · **the سوي verb family**
  (`يسو`/`تسو`/`نسو`/`سوّ`, not just «يسوّي») → 0 · no task row or title opening with a و-word ·
  singular address throughout. **Sweep the family, never one spelling** — a clean «يسوّي» grep once
  sat next to a «تسوي» in freshly-written slide text and the gate passed it. When the family sweep
  was first run for real (2026-09-25) it found **three live «تسوّي» on Day 1** that every previous
  sweep had passed.
  **One known false positive: «المسوّدة»** (a noun, perfectly fine). Exclude it rather than widening
  the pattern — and read every remaining hit in place, because this sweep is semantic like the rest.
- Every «صياغة مقترحة» in the day's curriculum sections appears on a slide (build order step 3).
- Session durations on slides 2–3 sum to 215 د.
- Commands are `.snipbox`, output is bare `.snip`, `tok-code` only for passing mentions.
- Offline: no remote font, stylesheet, script or image reference.
- Screenshot and actually read the cover, the goals slide, each showcase slide and the checklist.
