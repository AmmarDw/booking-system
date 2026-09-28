# TODO — the «توليد المهارات» block (Day 4, 56 د)

**Status: not designed. This file records the brief and the open questions; it answers none of
them, and no research has been done yet.** The teaching model is to be settled in a dedicated
discussion between the user and Claude, and only then do the Day-4 task rows get written.

> **Do not start building from this file.** It is the input to that discussion, not its output.

---

## What is already fixed

| | |
|---|---|
| **Day** | 4 — §2.4 «إكمال المتطلبات ورحلة المستخدم» |
| **Budget** | **56 دقيقة**, unallocated |
| **How the 56 د arose** | Day 4 vacated 71 د when §10's formats theory + task 10.2 moved to Day 3; 15 د came back from Day 5 (7.7 + 7.9 + its 3 د Q&A, merged into Day 4's existing Q&A row → 7 د). 71 − 15 = 56. |
| **Session split** | **Undecided** — the block may span شرح / تطبيق / عمل / مراجعة in any proportion. This is exactly why no placeholder rows were written into §2.4. |
| **Current Day-4 state** | شرح 39 · تطبيق 40 · عمل 60 · مراجعة 20 = **159 د**. Returns to 215 د once this block is designed. A blockquote under the §2.4 heading says so and points here. |

**Already moved into Day 4 and available to build on:** 7.7 القواعد (rules) والمهارات (skills) — 6 د,
and 7.9 بنية ملفات Claude Code — 6 د. Both now sit in Day 4's شرح session. **7.8 نافذة السياق والضغط
went to Day 5, not Day 4** — so context-window economy is *not* available as a lead-in on this day.

---

## Why the block exists — the user's framing

> "I was trying to look for time to teach trainees how to generate their own skills not just using
> them **because this course is primarily to learn how to use claude code not only to produce an MVP
> with it**."

> "My prepose is to teach them this by **generating a useful skill that they would actually benefit
> from**, but IDK exactly yet how to do this."

---

## The starting notes — the user's proposed shape

Recorded as given. This is a sketch, not a decision:

> "The notes that come to my mind is to **do a research on what skill will be useful for the
> trainees** considering both the what we are teaching in this course and what might such targeted
> audience of trainees need **so that I pick something based on this research** and demo generating
> a skill on it **after explaining the theoretical part** of it and **performing the practical part
> on this chosen skill**."

So the sketch is, in order: research candidate skills → user picks one → teach the theory → do the
practical on the chosen skill. **The research has not been done.** Doing it is the first action item
of the discussion, not of this file.

---

## Open questions

These are the user's questions, verbatim in substance, grouped. **None are answered here.**

### Q1 — Recorded, live, or both?

> "Knowing that I still don't know if **I would only record a tutorial on doing one skill or to
> generate a skill live as well**."

Bears on `showcase-strategy.md`'s interleaved «explain → play the recording → trainer re-runs live»
cycle, and on whether this block gets one media slide, two, or none.

### Q2 — How to teach the *generic* process, when the process varies by skill type

> "**How can I showcase the generic process of building a skill with claude which extends far more
> than just using claude skills generator skill** because it depends on what type of skill do we
> want to generate such as:
> - a skill to **use a specific MCP tool** to perform something,
> - **generating code to perform a task** where this skill is the one that knows how to use this
>   code and how to finish this task,
> - **generating code that is used in the skill alongside MCP tools** to perform a task,
> - **or even something else**."

The difficulty named here is the core one: a single worked example teaches one *type*, but the
trainee needs the general method. Whatever model is chosen has to resolve that tension explicitly.

### Q3 — Fixed menu of skill ideas, or trainee's own choice?

> "**Should I suggest a stack of skills ideas that trainees should choose from, or give them the
> freedom to decide on what idea or problem do they want to generate a skill to fulfil** — and if so
> **what are the rules I should provide them to insure that the chosen skill can be generated with
> the allocated time?**"

Note the second half is conditional on the first: the "rules that guarantee buildability inside the
budget" are only needed if trainees choose freely.

### Q4 — Where does it live in the curriculum?

> "**Where should this be added to the curriculum? Can we just extend 7.7 to include it? Should we
> make section 7.7 like sections 8 to 16** with for example **a table of tasks and divide the
> section** to organize the content?"

### Ordering constraint — stated by the user

> "Of course **those questions are to be answered after we answer the earlier questions and
> determine how are we going to teach the skill generation**."

So **Q4 (placement) is downstream of Q1–Q3 (teaching model)**. Do not restructure §7.7 before the
model is settled.

---

## Knock-on effects to check once the block is designed

Not part of the design, but they fall out of it and will be missed otherwise:

- **§2.4 must return to 215 د** — the block's rows are added and the reserved-time blockquote under
  the heading is deleted.
- **The §1.1 ranges table** (شرح 40–65 · تطبيق 56–64 · عمل 72–90 · مراجعة 22–33) currently **excludes
  Day 4** as provisional, with a note saying so. Once Day 4 is whole, re-run the spread across all
  ten days and either confirm it fits or widen again, then delete the note.
- **Day 4's أهداف** already carries «استخدام MCP / Skills / Rules ضمن بيئة العمل» (moved from Day 5).
  A skill-*authoring* block probably wants its own goal line beyond "using" them.
- **`MEDIA_SHOTLIST.md`** needs entries if Q1 lands on recording anything.
- **The trainee package's own `.claude/skills/`** is the live worked example sitting in front of
  every trainee — ten skills they have been *using* since Day 1. Whether the block points at them is
  a teaching-model question (Q2), not a given.
- **No Day-4 deck exists yet.** Slides are built from the curriculum after it settles, never before.
