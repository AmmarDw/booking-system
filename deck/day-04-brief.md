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
the six slots, suggests answers from `PRODUCT.md`) → **`skill-creator`** (builds the file). The
package skill never constructs `SKILL.md` itself — division of labour, matching the precedent already
in `user-journey/SKILL.md`, which hands off to `drawio` mid-procedure.

**Media: two of two shipped.** `tasks-10.3-11.1-11.2.mp4` landed 2026-10-01 (5:59, frame-verified,
14 steps across 3 dividers) and is live on slide 9. `task-7.11.mp4` landed 2026-10-02 (5:30,
frame-verified, 13 steps across 4 dividers) and is live on slide 16 — see `MEDIA_SHOTLIST.md`'s Day-4
section for the full capture record, including why the originally-planned staged failure was dropped
rather than faked once the real footage turned out clean.

---

## Three decisions this deck encodes

**1. The comparison is presented, not derived — and uses market-standard skills, not course ones.**
Slide 12 puts `internal-comms` (32 lines, Anthropic) and `a11y-debugging` (91 lines, the Chrome
DevTools team — **not** Anthropic, as an earlier draft of this brief and the curriculum both wrongly
claimed) side by side on one screen. Concurrent comparison is the mechanism (Rittle-Johnson & Star);
splitting them across two slides would waste it.

**Rebuilt 2026-10-02, because the first version was a summary pretending to be a comparison.** It
gave two bullets per skill and no evidence, so the single most important question — *what does
`internal-comms` actually do?* — went unanswered. The rebuilt slide dissects each skill against all
six slots from slide 13, and **every answer is a translated quote from that skill's own file**, with
a plain gloss underneath only where a quote alone would not land. Three factual corrections fell out
of reading the real files rather than recalling them:

- `a11y-debugging` is **Google's**, not Anthropic's.
- "Both zero-code" was wrong. `internal-comms` genuinely has zero code fences across all five of its
  files; `a11y-debugging` has two, plus a snippets file. The honest line — *neither is a program;
  one has no code at all, the other embeds a couple of ready-made lines* — disarms just as well and
  survives a trainee opening the file.
- **Each skill leaves a different slot empty**, and that is now the slide's payoff rather than a
  footnote: `internal-comms` has the human gate but no success criterion; `a11y-debugging` has a
  measurable success criterion but no human gate. Two official published skills, neither complete —
  which is the 238-skill statistic on slide 13 made concrete in two real cases.

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
| 7 | §11 — الصيغة الموحّدة ومهامّ القسم | 11.1 card (stacked, full-width) with 2 internal reference boxes + 11.2 card | `s11-tasks` | **Rebuilt 2026-10-01.** The template is reference only now — no copy button, since the trainee writes free-form, Claude returns this shape. Its sibling box is the real 22-step `darrisni` journey (`trainee-test/PRODUCT.md:419`), RTL, scrollable |
| 8 | المهمة 11.1 ثم 11.2 — نفّذها أنت | 1 card (5 steps) + prompt | `task-111` | "Your journey is already written — just reordered" framing, matching the curriculum's own lesson |
| **9** | **▶ المقطع: 10.3 ثم 11** | **`stepvid`, real video** | `demo-103-11` | **Shipped 2026-10-01.** `tasks-10.3-11.1-11.2.mp4`, 14 frame-verified steps across 3 dividers |
| 10 | §7.7 — القواعد والمهارات | 2 cards + 2 plain-note cards | `s77` | Existing curriculum content, unchanged in substance |
| 11 | §7.9 — بنية ملفات Claude Code | 2 cards (عامّ / محلّي) | `s79` | File-tree rendered as two cards rather than raw ASCII — cleaner RTL behaviour than a code-fence tree |
| **12** | **§7.11 — مهارتان حقيقيتان على نفس الأسئلة الستّة** | 2 × `.card--scroll` (`.slots` inside) + note | `s711-concept` | **The load-bearing slide.** Rebuilt 2026-10-02: each skill is dissected against all six slots, every answer a **translated quote from the skill's own file**. Amber slot numbers mark the slot each one leaves empty |
| **13** | **§7.11 — الخانات الستّ والنوعان** | 1 card (6 slots in 2 columns) + 2 cards w/ install commands + warning card | `s711-slots` | **Install commands corrected 2026-10-02.** `internal-comms`: swapped the 13MB `/plugin install example-skills@...` bundle for a verified `npx giget@...` one-liner that pulls only the skill's own 36KB folder from the public repo — no unrelated skills. `chrome-devtools-mcp`: same `/plugin install` command kept, but now framed as "already installed since Day 1" rather than a new step, since a trainee who followed the course has it from §7.10 |
| **14** | **§7.11.1 — البوّابة والقائمة** | 1 full-width gate card (7 questions in 2 cols) + 1 menu card (2 × `.pick` tables) + `<template class="terms">` × 8 | `task-7111` | **Rebuilt 2026-10-02.** The gate now says what it judges (*does it finish today*, not *is it good*) and every question carries its own why. The menu is a real table, and **each of the eight ideas has a `؟` opening its own six-slot sketch** — the same framework slide 13 teaches, pre-answered as a starting point the trainee extends. «نصّ العرض التقديمي» renamed «نصّ كلامك يوم العرض» (it reads as *slide text*, which it is not). «بطاقة المشاركة» carries a clickable description of `assets/Open-Graph-tags.png` ending «اضغط لعرض الصورة». **Image swapped 2026-10-03**: the original screenshot showed a real actor's photo under a real, sensitive news headline — inappropriate for the deck. Replaced with a generic "Open Graph Tester" tool screenshot (placeholder content only), and the description rewritten to match it |
| **15** | **§7.11.2 — كيف تشتغل عمليًّا** | 1 card (3 steps) + `.promptbox` + note | `task-7112` | **Corrected 2026-10-02 (second pass).** `skill-creator` ships by default with Claude Desktop — no install step. States that plainly, names the explicit-attach path (`+ → Plugins`) as an alternative to just describing the task, and flags that `/skill-creator` typed as text does nothing (skills are used, not called). Full starter prompt unchanged |
| **16** | **▶ المقطع: من الفكرة إلى مهارة تشتغل** | **`stepvid`, real video** | `demo-711` | **Shipped 2026-10-02.** `task-7.11.mp4`, 13 frame-verified steps across 4 dividers — the six-slot elicitation with multi-select stop-points, `skill-creator`'s own live-site eval loop, a clean unnamed trigger in a second tool (Antigravity, not Claude Desktop), both real stop-gates firing, the one genuine finding, and the trainee's own follow-up fix request closing it out |
| 17 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 18 | دورك الآن | 2 × `.sess` nested + note | `your-turn` | "أكمل متطلباتك ورحلتك" (60 د) + "ألّف مهارتك" (26 د) — every task key mirrored from slides 2–3 |
| 19 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 20 | مخرَج اليوم | 3 cards + quote | `day-review` | Quality metrics, journey match, and "your skill ran once for real" |
| 21 | غدًا — اليوم الخامس | `sag-closing` dark | — | Points forward to §12 التصميم, and deliberately hooks it to the "جولة قبل العرض" skill's report as motivation |

---

## What the build caught — worth keeping

- **A pasted AI conversation with real-looking citations can be entirely fabricated — check the
  domains before trusting the claims.** The user pasted a conversation citing `skills-hub.ai`,
  `claude-world.com`, `astromvp.com`, `systemprompt.io`, `skillsllm.com` and an invented
  `/install-skill` command. None of those are real Anthropic properties. The confident tone plus
  plausible-looking footnotes is exactly the fabricated-citation failure mode — the fix was not
  reasoning about the claims, it was opening the real `marketplace.json` and plugin cache on disk and
  checking directly.
- **"Is there a lighter install path" is answerable by testing, not by declaring there isn't one.**
  The first instinct was to fall back to a Claude-Desktop-only workaround once `/plugin install`
  was confirmed to pull the full 12-skill, 13MB bundle. Testing `npx giget@latest
  gh:anthropics/skills/skills/internal-comms <dest>` first confirmed a real, single-command,
  bundle-free path exists and is officially sourced from the same public repo — verified by actually
  running it (36KB, 3 files, nothing else) before putting it on a slide.
- **A command's real payload can differ from what the plugin manifest implies.** `chrome-devtools-mcp`'s
  cached plugin directory is a full git clone of the upstream repo (`node_modules` alone: ~396
  packages, ~29,400 files) — but the plugin's own `plugin.json` shows the actual MCP server runs via
  `npx chrome-devtools-mcp@1.9.0`, fetched fresh from npm at startup, entirely separate from the
  cloned source tree. The large download is incidental packaging, not a deliberate "full install"
  option with a tradeoff behind it — worth knowing before describing it as a choice.
- **When the user defers a decision with explicit conditionals ("do X, or if X isn't possible, do
  Y"), resolving the condition is enough — no need to re-ask.** The user's instruction named exactly
  this branching logic for both commands; once verification resolved which branch applied, the edit
  followed without another round of questions.

- **A menu of options is not teaching until each option is explained to the same depth as the
  framework that judges it.** Slide 14 listed eight skill ideas as one-line labels right after slides
  12–13 had taught a six-question framework — so the trainee was asked to *choose* using a tool the
  slide never applied. The fix was not more prose: it was answering all six questions for all eight
  ideas, behind a `؟` per row, so the list and the framework are the same object. **When a slide asks
  for a decision, check that everything needed to make it is reachable from that slide.**
- **A name that reads as a different artifact is a defect even when it is literally accurate.**
  «نصّ العرض التقديمي» means the *script you speak* while presenting, but it parses as *the text on
  the slides* — and did, on review. Renamed to «نصّ كلامك يوم العرض» everywhere (deck, curriculum,
  `authoring-skills/SKILL.md`). **Read every label as someone who does not already know what it
  refers to.**
- **Scrolling was the requested fix; fitting was the better one.** The ask was to make the menu
  scrollable so length would stop being a constraint. One table scrolled showed 4 of 8 rows. Splitting
  it into two `.pick` tables side by side showed all 8 with 12px to spare — the scroll container stays
  as a guard, but nothing scrolls. **A means-to-an-end instruction is satisfied better by reaching the
  end; say which you did.**
- **`.card--scroll` + `position: sticky` on `th` compose for free.** The card is the scroll container,
  so the table header sticks to it with no JS and no extra wrapper — worth remembering the next time a
  long table has to live inside a frame-height card.
- **The `؟` window renders *all* of a slide's terms, which makes it the right component for a menu.**
  `openTerms` builds every `[data-term]` entry and scrolls the clicked one into view. For eight
  comparable options that is exactly the desired behaviour — the trainee lands on the one they asked
  about and can scroll the other seven without closing anything. Not a workaround; the component's
  actual design.
- **An LTR dimension pair inside RTL text reverses visually.** `1200×630` renders so a Latin eye reads
  `630×1200` (the `×` resolves to the paragraph's RTL level between two LTR number runs). Rewritten as
  «عرضها 1200 وارتفاعها 630» — plainer for a non-technical trainee *and* bidi-proof, which is the
  better fix than an isolating span.
- **Validating an edit's anchor risk beats validating the anchor checker.** Rather than trust an
  ad-hoc slugifier (which reported 6 phantom breaks on و+Latin headings, identical in `HEAD`), the
  check that settled it was diffing the heading list and the `](#…)` link list against `HEAD`:
  both byte-identical, so the edit could not have broken an anchor. **Compare to a baseline when the
  tool itself is unproven.**

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
- **A "failure" step in a stepvid needs footage of an actual failure — and if the footage doesn't
  show one, the step comes out, not stays in as fiction.** Slide 16 was built with a placeholder
  `stepvid__step--new` row for a first-run trigger miss, on the same reasoning already in
  `writing-requirements/SKILL.md` §5.1.1 (a description is a guess until tested). The real recording
  triggered correctly — an unnamed, plain-language request, in a different tool than the one that
  built the skill — so the placeholder row was dropped entirely rather than kept to match a plan the
  footage didn't support. **The instruction to capture reality cuts both ways: don't stage a failure,
  and don't narrate one that didn't happen either.**
- **A copy button is a claim about what the trainee should do with the box, not just a UI nicety.**
  Slide 7's unified-format template had one, which silently told the trainee to reproduce that exact
  shape in their own notes — backwards from §11.1, where the trainee writes free-form and Claude
  returns the shape. Fixed by dropping the button on both reference boxes, not just rewording the
  lead sentence; the affordance itself was half the bug.
- **An element's own `dir="rtl"` attribute can lose to an author stylesheet silently.** `.snip`'s base
  rule forces `direction:ltr` for its real job (a machine-facing command); it beats a plain `dir`
  attribute on specificity-tie-plus-cascade-order, so a reused `.snip` box asked to hold a human's
  Arabic text needs its own override class, not just the attribute. Caught only by reading the
  rendered slide, not by any audit script.
- **In an equal-height bento row, shrinking one column has a floor set by its sibling.** Capping a
  scrollable box's `max-height` stopped moving the needle on slide 7's overflow once it dropped below
  its non-scrolling neighbor's natural height — the real fix was trimming surrounding prose, not the
  box everyone's eye goes to first.
- **`ffmpeg -ss` before `-i` drifts to the nearest keyframe on sparse-keyframe screen recordings —
  verify timestamps with fast-seek-then-accurate-seek instead.** The first cut of slide 9's steps used
  single-`-ss` sampling and produced frames that looked chronologically consistent but weren't; a
  self-correction the trainer made at 3:42 appeared, from the drifted frames, to happen *before* the
  bug it was fixing. Re-extracting with `-ss <t-10> -i file -ss 10` (seek close, then decode
  accurately from there) resolved the real order. When a recording's beats must be timestamped to the
  second — not just approximately located — accurate seeking is the only reliable method.
- **A self-correction moment can be real footage and still be mis-timestamped.** The "Claude catches
  and fixes its own mistake" beat is genuine — it just sits earlier (3:15–3:42) than a first pass
  placed it. The user's own frame-accurate timing caught this; it's a reminder that claiming
  "frame-verified" from an approximate sampling grid is not the same as actually having verified the
  frames at their true timestamps.
- **A comparison slide is only as good as its evidence — summarise and it stops being a comparison.**
  Slide 12's first version described two skills in two bullets each and left the most basic question
  (*what does this one actually do?*) unanswered. Quoting each skill's own sentences, slot by slot,
  took the same screen area and produced something a trainee can check. **When a slide's whole job is
  to compare, the comparison axis must be explicit and the cells must be sourced.**
- **Reading the artifact beats recalling it — three wrong facts shipped from memory.** `a11y-debugging`
  was attributed to Anthropic (it is Google's), both skills were called zero-code (one is not), and
  the fact that each leaves a *different* slot empty — the most teachable thing about the pair — was
  missed entirely. All three surfaced within minutes of actually opening the two `SKILL.md` files.
- **"Where does this come from and how do I install it" is part of teaching a skill, not a footnote.**
  The pair sits on opposite ends of the install-cost axis and that is itself instructive:
  `internal-comms` is five small markdown files from a public repo, while `a11y-debugging` arrives
  only as part of a plugin whose cache is the entire `chrome-devtools-mcp` Node repo — `node_modules`,
  a 271KB lockfile, a 132KB changelog — because the plugin's real payload is the MCP server. Verified
  against the installed cache and both marketplace manifests, not assumed.
- **Skills are not slash commands, and that confusion is worth pre-empting on the slide.** The
  `description` field is the entire trigger mechanism: Claude reads it and loads the skill when a
  request matches. Typing `/a11y-debugging` and getting nothing is the expected outcome, not a broken
  install — and availability additionally differs per environment, since the CLI, the Desktop Code
  tab and the editor extension each read a different plugin registry. Slot 1 on slide 13 now says
  this outright.
- **An element can overflow its own card without `deckAudit()` noticing.** The guard measures each
  slide's body, so a paragraph spilling out through a card's bottom border — visibly broken, text
  sitting on the slide background below the card — passes clean. Caught here only by reading the
  screenshot. **Worth running a per-card child-bottom check after any edit that grows a card inside a
  `.bento`**; the snippet is a dozen lines and found two real spills on slide 13 that the audit
  reported as fine.
