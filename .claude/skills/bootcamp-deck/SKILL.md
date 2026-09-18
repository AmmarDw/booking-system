---
name: bootcamp-deck
description: Build and revise the SAG Lab Arabic bootcamp presentation decks (project-package/slides/day-NN.html) — the slides ARE the curriculum and the only thing trainees read. Use this whenever the user asks to add, fix, decompress, reword, restyle, or reorder a slide, add a day to the deck, touch project-package/slides/assets/*, or sync DECK_BRIEF.md / MEDIA_SHOTLIST.md. Also use it when they mention curriculum sections, task rows, the overflow guard, slide numbering, or the Arabic register of trainee-facing text — even if they never say the word "deck" or name a file.
---

# Bootcamp deck

The deck at `project-package/slides/day-NN.html` is a self-contained, offline, RTL Arabic slide system. There is no
build step and no framework: plain HTML sections, one shared stylesheet, one shared script.

**The single most important fact:** trainees read *nothing else*. The slides ship *inside* the
trainee package (`project-package/slides/`), alongside `PRODUCT.md`. Everything else in the
package — `CLAUDE.md`, `.claude/`, `bootcamp_roadmap_and_curriculum.md` — is addressed to Claude,
not to a person. So any trainee-facing content must be **on a slide, complete**, with no "see
section N of the guide" dependency.

---

## Before you touch a slide

Read `references/deck-anatomy.md` for the component, token and interaction inventory. Read
`references/archived-plan-2026-09-08.md` only if you need the historical *why* behind a structural
decision — it is an unvetted dump with known errors, flagged in its own header.

Then hold these three in mind, because they are what reviews actually fail on.

### 1. The overflow guard is the gate, not a formality

Slide frames are `overflow: hidden`, so content that exceeds the frame is **silently clipped** — the
presenter finds out in the room. `deck.js` measures every slide and `window.deckAudit()` prints the
verdict. Nothing is done until it says `N slides, none overflow`.

It measures **border boxes** and skips inline boxes on purpose. Cairo's glyph box is taller than its
em, so `scrollHeight > clientHeight` on any heading even when nothing is clipped. That is ink bleed;
no amount of splitting a slide clears it. Do not "fix" the guard to use `scrollHeight`.

### 2. The scaled-unit trap

The whole 1920×1080 frame is `transform: scale(--deck-scale)`. So `getBoundingClientRect()` returns
**scaled device px**, while `getComputedStyle().lineHeight` returns **unscaled CSS px**. Comparing
them directly is a silent, confident lie — it once produced a reported "0 wrapped task labels" that a
single screenshot disproved. Divide by `--deck-scale` before comparing:

```js
var scale = parseFloat(getComputedStyle(document.documentElement)
  .getPropertyValue('--deck-scale')) || 1;
var layoutPx = el.getBoundingClientRect().height / scale;
```

### 3. Growing a slide is not splitting a slide

Slide count is a budget. Making a slide self-contained means richer cards, a real example, a flow
line — *inside its existing frame*. Splitting into ١/٢ + ٢/٢ is a last resort, and adding a slide is
a deliberate, requested change, never a side effect of filling content in.

When a slide overflows after an addition, the fixes that have actually worked: fold an instruction
line into a card title, convert a lead paragraph to a compact callout, tighten a gap from `--sp-3` to
`--sp-2`, or reclaim dead space with `align-content: safe center`. The `safe` keyword is
load-bearing — plain `center` overflows equally in both directions, pushing content out through the
*top* of the frame where trimming below can never recover it.

---

## Writing the Arabic

Pitch to a trainee who has **heard** the words backend, frontend, server, hosting and does not know
how any of them work. For each such term give only **what it is · what it does · when you'd use it**,
then stop. Depth beyond that is Claude's job; on a slide it costs comprehension and buys nothing.

- **Plain, spoken-leaning, never compressed.** Write it the way you would say it out loud. Short
  sentences. The failure mode to avoid is telegraphic phrasing where each word is meant to carry a
  paragraph — that reads as obfuscated, not concise. «تطبيق، فعملك، فمراجعة» is the canonical
  example of what not to ship.
- **… and never heavily dialectal.** That is the other edge, and it is the one reviews keep catching.
  Lean closer to colloquial than to فصحى, but stay inside **المحكية البيضاء** — spoken words any
  Arabic reader parses, not Gulf-only ones: يقدّم / يعمل / ينفّذ not يسوّي, ايش not وش,
  يحتاج / يبي not يبغى, «كل ما احتجت» not «وقت ما التبس». Colloquial *connectives* stay
  (اللي، عشان، بس، مو) — they are what keeps the register spoken; the dialect *verbs* are what
  shuts a non-Gulf reader out.
- **Never open a task row — or a slide title — with a و-word** — not the conjunction, and not «وايش» / «ووين» either. They
  read as a fragment continuing something that isn't there. Mid-sentence the same words are fine.
- **One trainee, singular, always.** Each trainee builds their own project alone. A second-person plural reads as «me and the other trainees» even when you meant «me and Claude» — and «me and Claude» is wrong too, because Claude is a tool the trainee operates, not half of a team. Never «تشتغلون» / «وصلتم» / «توصلون» / «أنتم» / «سوا» with Claude as the other party. Name the two sides instead: «في كل مهمّة عليك شغل، وعلى Claude شغل». The exception is the **trainer** plus the room in a live session («ننجزها معًا الآن», §7.10), which is genuinely collective.
- **Concrete examples only.** «لو عندك متجر وتبغى تعرف كم طلب وصلك اليوم» beats «مثال على استعلام
  البيانات». If an example cannot be made concrete, it is not understood well enough to teach.
- **Calibrate how much of a topic rides on its example.** Examples always beat abstraction, but the
  dose is a judgement. Most content wants a *clarifying* example — one line, one card, a real number,
  inside the explanation. A topic that is heavy or technical relative to the trainee's level wants a
  *gateway* example instead: open on a situation the trainee already lives, walk it as a sequence,
  **never name the concept while the story runs**, and reveal in the closing line that what they
  just watched is what the term means — then explain the concept on the next slide by pointing back
  at it. Test: could the trainee understand the definition cold? Then clarifying. Would the
  definition land as noise first? Then gateway, and it earns a slide. §7.5 (MCP) is the worked case;
  most topics do not clear the bar, and over-dosing a light one buys nothing. (CLAUDE.md A.6.11.)
- **Show the flow before the work.** Never drop trainees into a sequence of steps without first
  saying plainly what the sequence is for and what order it runs in. Be neutral about the medium —
  some of these framings belong on a slide, others are just something the trainer says. Decide per
  case and say which you chose.
- **Person matters.** «ن-» verbs mean *we do this together* — right for «تطبيق مع المدرب», wrong for
  «مراجعة وعرض التقدم» where reviewing is the trainee's own job, and wrong for anything the trainee
  does alone on their own machine. A row that says «نجهّز جهازك» when the trainer only demonstrates
  is a promise the session does not keep.

### Fixed vocabulary

| Use | Never | Why |
|---|---|---|
| مشروع · مشروعك | منتج · منتجك | trainees build projects, not products |
| الدورة · القسم N · الحزمة | دليل | the deck *is* the curriculum; there is no separate guide |
| منهج (= curriculum) | محتوى, where curriculum is meant | — |
| محتوى الملفات · فهرس المحتويات | منهج | these are *file contents* and a *table of contents* |
| ايش | وش · ويش · ووش · وايش *as the default* | the colloquial "what" is **ايش**; the و is a separate conjunction, not part of it |
| يقدّم · يعمل · ينفّذ | يسوّي | Gulf-only verb; the register stays spoken without it |
| مشروع الأولي — **except** «المنتج التقني الأولي (MVP)» | منتج, anywhere else | منتج survives only as the *P* in Minimum Viable Product, and in the programme's own name |
| ربط / يربط, until §7.5 defines التكامل | التكاملات, before slide 23 | ربط is the plainer word, and the noun is not introduced yet |

That fourth row is why terminology sweeps are **semantic, never `sed`**. Read every candidate in
place before changing it. A blind swap on «صمّم محتوى الدورة ومنهجه» yields «صمّم منهج الدورة
ومنهجه».

«ايش» is the one that keeps being got wrong. It is **و + ايش**, two words. Write «ايش» unless a conjunction is genuinely needed at that point in the sentence — in a list («مين هو، وايش دوره، ووين وصلتم») or joining two clauses («ايش يقدّمه وايش ما يقدّمه»). After an em-dash, after a colon, or at the start of a title or clause there is nothing to join, so the و is simply wrong. Audit with `/وايش/` and read every hit in place; the correct count is small.

**Never label a task by who performs it.** The trainee works on all 29 — the source table's «مَن ينفّذها» column needed a whole footnote to stop it reading as «I am not involved in nineteen of these», which is the tell that the column was wrong. The deck's version says **«دورك فيها»** and names a trainee action in every row: تقرّر وتوصف (10) · تراجع وتصحّح (7) · تجرّب وتعدّل (12). Same grouping, no false implication. Apply the same test to any new who-does-what split.

**تكامل and ربط are not synonyms** — تكامل is the *thing* (an MCP connection, the subject of §7.5's
own title) and ربط is the *act* of connecting one. Do not unify them. The rule that matters is
ordering: a slide before §7.5 must say ربط الأدوات الخارجية, because a trainee meeting «التكاملات»
cold has been given a term nobody defined.

### Never glue an Arabic و to a Latin word

`وpush` and `وSupabase` render as one run and read as a typo. Either use `&` when the و joins two
Latin tokens that form a pair (`commit & push`), or put a space after it (`و Supabase`) when it is
an ordinary sentence conjunction. This holds even where the و is part of an Arabic word.

Audit it with `/و(?:<[^>]+>)*[A-Za-z]/` over the HTML, and again over each slide's rendered text —
the markup form misses cases that only glue after tags are stripped.

---

## The three surfaces that must stay in sync

A wording change on a slide usually lives in more than one file. After any content edit, grep all of
these and report what you found:

1. `project-package/slides/day-NN.html` — the slides, including the `<!-- ═══ N — title ═══ -->` banner above each one
2. `project-package/bootcamp_roadmap_and_curriculum.md` — the authoring source. Headings here own
   GitHub anchors, so **renaming a heading breaks every link to it** unless the TOC entry and every
   cross-reference move with it.
3. `deck/DECK_BRIEF.md` and `deck/MEDIA_SHOTLIST.md` — the slide-by-slide plan and the capture
   list. `deck/` now holds *only* these planning docs; the slides themselves live in the package.
   Both carry slide numbers that go stale the moment a slide is inserted.

### The `.docx` is retired

`bootcamp_roadmap_and_curriculum.docx` was a Word mirror of the curriculum, hand-edited and
painful to patch. Trainees never read it, so it now sits in `archive/` and is **not maintained**.
Do not edit it, and do not re-add it to the sync list.

---

## Slide numbering

Footer page numbers are written by `deck.js` from each slide's own index, so inserting a slide does
**not** mean touching dozens of hardcoded spans. The day label
(`.deck-foot__side .deck-foot__num`) is a different element and is authored by hand.

`DECK_BRIEF.md` and `MEDIA_SHOTLIST.md` still carry hand-written slide numbers. Renumber them
bottom-up — top-down collides — and assert each row matches exactly once before replacing it.

---

## Verification checklist

Run all of these and report each result rather than asserting success.

- [ ] `window.deckAudit()` → `N slides, none overflow`, on the real page via chrome-devtools
- [ ] Interactive behaviours exercised in a browser, not reasoned about
- [ ] No task row opens with a و-word
- [ ] `.md` anchor check → 0 broken links
- [ ] `.docx` structure: table / heading / bookmark / hyperlink counts unchanged, all TOC anchors
      resolve, `jc=right` = 0, 14 of 15 zip entries byte-identical
- [ ] Grep sweep for the exact strings you claimed to remove **and** the ones you claimed to keep
- [ ] **Offline**: no remote font, stylesheet, script or image reference anywhere. The training room
      may have no wifi, and a deck that loses its icons on stage is a failed deck.

---

## Working method

Slides are revised **gradually, a few at a time**. When asked to fix a slide, fix *that* slide
against everything above and leave the rest alone — then say which slides most need the same
treatment next. That closing recommendation is part of the deliverable.

Report honestly. If a measurement contradicts something you said earlier, say so plainly and move on.
