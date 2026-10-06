---
name: bootcamp-deck
description: Build and revise the SAG Lab Arabic bootcamp presentation decks (project-package/slides/day-NN.html) — the slides ARE the curriculum and the only thing trainees read. Use this for EVERY touch to a slide, new or existing — creating a slide, inserting a missing step, fixing one line of wording, restyling a command, reordering, or deleting one. There is no edit too small to invoke it for; a one-line fix on an already-shipped slide is the same trigger as building a new one. Use this whenever the user asks to add, fix, decompress, reword, restyle, or reorder a slide, add a day to the deck, touch project-package/slides/assets/*, or sync DECK_BRIEF.md / MEDIA_SHOTLIST.md. Also use it when they mention curriculum sections, task rows, the overflow guard, slide numbering, command/output styling, or the Arabic register of trainee-facing text — even if they never say the word "deck" or name a file.
---

# Bootcamp deck

The deck at `project-package/slides/day-NN.html` is a self-contained, offline, RTL Arabic slide system. There is no
build step and no framework: plain HTML sections, one shared stylesheet, one shared script.

**The single most important fact:** trainees read *nothing else*. The slides ship *inside* the
trainee package (`project-package/slides/`), alongside `PRODUCT.md`. Everything else in the
package — `CLAUDE.md`, `.claude/`, `bootcamp_roadmap_and_curriculum.md` — is addressed to Claude,
not to a person. So any trainee-facing content must be **on a slide, complete**, with no "see
section N of the guide" dependency.

**Any edit counts, not just new slides.** Fixing one command's styling, inserting a missed step, or
rewording a sentence on an already-shipped slide goes through everything below exactly like building
one from scratch — read this file before the edit, not after a review catches what it would have
caught. A slide edited without it is how the chrome-devtools slide shipped with commands and output
both wrapped in a plain `tok-code` span instead of the components §4 below documents.

---

## Before you touch a slide

| Reference | Read it when |
|---|---|
| `references/deck-anatomy.md` | **Always.** Every component, with the `day-01.html` line range to copy from. Nothing here should be authored from scratch — Day 1 already built it |
| `references/day-deck-recipe.md` | Building or extending a `day-NN.html` for days 2–10 |
| `references/showcase-strategy.md` | Deciding what fills «شرح المفاهيم» — which project supplies the recording, and what already exists per section |
| `references/archived-plan-2026-09-08.md` | Only for historical *why* — an unvetted dump with known errors, flagged in its own header |

**Day 1 cost ~47 turns of iteration. Days 2–10 should not.** The single biggest time sink is
re-inventing a component that exists. Before writing markup, find it in `deck-anatomy.md` and copy
the real thing.

Then hold these four in mind, because they are what reviews actually fail on.

### 1. The overflow guard is the gate, not a formality

Slide frames are `overflow: hidden`, so content that exceeds the frame is **silently clipped** — the
presenter finds out in the room. `deck.js` measures every slide and `window.deckAudit()` prints the
verdict. Nothing is done until it says `N slides, none overflow`.

It measures **border boxes** and skips inline boxes on purpose. Cairo's glyph box is taller than its
em, so `scrollHeight > clientHeight` on any heading even when nothing is clipped. That is ink bleed;
no amount of splitting a slide clears it. Do not "fix" the guard to use `scrollHeight`.

**And the guard has a second, opposite blind spot: it has no opinion about a slide that is too
empty.** Day 5 shipped two slides — a bare `.flow` ordered list and a two-card row — that were both
legal and both `deckAudit()`-clean, and both visibly used under a third of the frame when
screenshotted. The guard only flags overflow; density is invisible to it either way. **Screenshot
every new slide and judge it by eye**, not just by what the audit prints.

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

### 4. Commands and their output ride on fixed components — never a bare `tok-code` span

A trainee is meant to **paste** a command and to **recognise** output when it appears on their own
screen; an inline `<span class="tok-code">` mid-sentence serves neither, and gives a full command no
copy affordance at all. Two components exist for exactly this, side by side in the same step:

**Something the trainee types or pastes** — a full `.snipbox`, copy button included, built exactly
like slide 34's `git config --global user.name "Your Name"`:

```html
<div class="snipbox">
  <pre class="snip" dir="ltr">claude mcp list</pre>
  <button class="snipbox__copy" type="button" aria-label="نسخ الأمر"><span class="i i-copy"></span></button>
</div>
```

**Output the trainee reads and matches against, but never copies** — the same `.snip` box, with
**no** `.snipbox` wrapper and **no** copy button, exactly like the tool-description and pricing
blocks already on the deck:

```html
<pre class="snip" dir="ltr">chrome-devtools … ✔ Connected</pre>
```

The test is "does this step ask the trainee to reproduce this string," not length or how code-like it
looks — a single bare word the trainee must find inside a longer list (`claude-plugins-official`) is
still output, not a command, and gets the bare `.snip`. Reserve inline `tok-code` for a short, passing
*mention* of a name — a file, a flag, a command referred to but not being issued right in this step —
never for a string the step is actually asking the trainee to type or locate.

A conditional action the recording doesn't show (an "if it isn't listed, add it" branch) still gets
its own full `stepvid__step--new` row — amber "مضافة" mark, no `data-t`, in its correct sequence
position — never folded as a parenthetical into the step before or after it. See
`references/deck-anatomy.md` for the exact markup and why an omitted `data-t` is enough for
`initStepVideos()` to skip it safely.

This is not a one-time fix: **after any command- or output-bearing edit, grep the slide you just
touched for `tok-code` and confirm every remaining hit is a passing mention, not a command or an
output string that should be a `.snip` block.**

### 5. A stepvid's timestamps are a claim about the video — verify each one against an actual frame

A `data-t` value and the step text next to it assert "at this second, the recording shows this."
That claim is either true or it is not — there is no estimating it. This has gone wrong twice already
and been caught both times by the same fix, so treat it as a recurring hazard, not a one-off:

- **`deployment.mp4`** — an early pass built its step list from a transcript instead of the video
  itself.
- **`tasks-10.3-11.1-11.2.mp4` (slide 9)** — a later pass sampled the video on a fixed 8-second grid
  and eyeballed the thumbnails to place steps. The user's exact words: *"Your timing is completely
  wrong!!"* Rebuilding it against frames extracted at the user's own corrected timestamps fixed it.
- **`tasks_12.1_12.2.mp4` (slide 13)** — a third, more insidious variant: **`ffmpeg -ss <t> -i …`
  (seeking, either before or after `-i`) silently resets the decoded frames' PTS to ~0 on this file**,
  confirmed with `showinfo` (`pts_time:0` for every non-zero requested offset). A `drawtext` overlay
  burned onto a seeked contact sheet can still show plausible-looking, strictly-increasing labels —
  they are just **wrong**, offset from the true time by an amount that drifts between invocations
  depending on filter chain and tile size. Several sheets built this way *looked* internally
  consistent and were read with confidence before a deliberate `showinfo` cross-check caught it. The
  fix: use **`trim=start=X:end=Y`** in the filter graph instead of `-ss` for any sub-range read whose
  labels matter — `trim` operates on the normal decoded stream with no seek discontinuity, so PTS stay
  true (verified: `trim=start=188:end=192` reported `pts_time:188, 188.03, …`, exactly right). **Never
  trust a seeked timestamp label again on any file without first spot-checking it against `showinfo`
  or a `trim`-based re-extraction** — a label that "looks consistent across a whole sheet" is not
  evidence it is correct, since a constant drift looks exactly as consistent as the truth.

**The failure mode in both cases is the same: a low-resolution, widely-spaced sample stands in for
the actual frame.** A coarse contact sheet (one frame every 5–10 seconds, scaled down to fit a grid)
is a fine tool for finding *where* something happens, but its thumbnails are too small and too sparse
to read Arabic UI text reliably — a blurry cell can be misread as content that was never on screen at
that second. One such misreading surfaced while building `task-7.11.mp4`'s step list: a contact-sheet
thumbnail looked like it showed a "test the login with a wrong password" prompt, which would have
contradicted the skill's own documented rule against ever typing a password. A full-resolution frame
extracted at that exact second showed something else entirely, and the step was written correctly
instead — but only because the full-resolution check happened *before* the step was written, not
after.

**So the procedure is always two passes, never one:**

1. **Coarse pass** — a contact sheet (`tile=NxN` at `fps=1/N`) to find the rough shape of the
   recording and the approximate second each beat happens.
2. **Verification pass** — for every timestamp that will actually be written into `data-t`, extract
   that one second as a full-resolution single frame (`ffmpeg -ss <t> -frames:v 1`, no heavy
   downscale) and read it before typing the step's title or description. Never promote a coarse-pass
   guess straight into a `data-t` value.

If a transcript, a prior summary, or your own memory of "about a minute in" is the only source for a
timestamp, that timestamp is not yet verified — extract the frame first.

---

## Writing the Arabic

Pitch to a trainee who has **heard** the words backend, frontend, server, hosting and does not know
how any of them work. For each such term give only **what it is · what it does · when you'd use it**,
then stop. Depth beyond that is Claude's job; on a slide it costs comprehension and buys nothing.

- **Plain, spoken-leaning, never compressed.** Write it the way you would say it out loud. Short
  sentences. The failure mode to avoid is telegraphic phrasing where each word is meant to carry a
  paragraph — that reads as obfuscated, not concise. «تطبيق، فعملك، فمراجعة» is the canonical
  example of what not to ship.
  **"Never compressed" is not only about register — a compressed sentence can hide an undefined
  test, not just read awkwardly.** Slide 11's addition rule («إن خدم شاشة موجودة فأضِفه قسمًا لها…»)
  sounded reasonable on a fast read, but never stated *how* to tell whether something "serves" an
  existing screen — the actual distinguishing test (does it open at its own URL, or does it just add
  to a screen that's already there?) was missing entirely, not merely stated badly. Reading a
  sentence back and asking **"could I apply this rule to a new case right now"** catches a missing
  test that reading it for tone alone does not.
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
- **An example that assumes a domain the deck never established is not concrete — it only looks it.**
  A Day-2 slide explained role overlap through «مقدّم الخدمة حجز مواعيده الخاصّة», which is vivid only
  if you already hold a booking domain the deck had never set up — and the trainee does not. It read
  as "assumes I know what we are talking about". **Test:** could a trainee who has read only this
  deck, to this slide, picture the situation? If not, the example is borrowed scenery.
  **Prefer the example that day's own recording is about to play** — the trainee is two slides from
  watching it happen, so it costs no setup and pays twice.
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
| سطر الأوامر (the concept) · موجّه الأوامر (a window you open) · `Terminal`/`PowerShell` (a named program) | الطرفية | reads as stilted; it was hand-corrected out of the deck repeatedly before the rule was written down |
| مجموعة شرائح | بلوك | no English words spelled in Arabic letters |
| ملفات تشغيل الشرائح | ما يخصّك | never phrase something as beneath the trainee |
| خصائص | مجالات · نقاط · عناصر نطاق | the scope list is **خصائص** derived from **غايات** — the terminology box bans every synonym |
| مشروع الأولي — **except** «المنتج التقني الأولي (MVP)» | منتج, anywhere else | منتج survives only as the *P* in Minimum Viable Product, and in the programme's own name |
| ربط / يربط, until §7.5 defines التكامل | التكاملات, before slide 23 | ربط is the plainer word, and the noun is not introduced yet |
| موعد · مواعيد متاحة · يفتح مواعيد دفعة وحدة | التوفّر · التوليد الجماعي | **the concrete everyday noun beats the abstract derived one** — see the rule below the table |

**Prefer the concrete everyday noun over the abstract derived noun.** التوفّر and التوليد الجماعي
are not wrong Arabic — they are *nominalisations*, and a trainee has to unpack each one back into the
thing it stands for before the sentence means anything. مواعيد متاحة needs no unpacking. The tell is a
تفعّل/تفعيل-pattern noun where a plain one exists: reach for the plain one. (Reported on Day-2
slide 12, 2026-09-25.)

That row about خصائص is why terminology sweeps are **semantic, never `sed`**. Read every candidate in
place before changing it. A blind swap on «صمّم محتوى الدورة ومنهجه» yields «صمّم منهج الدورة
ومنهجه».

«ايش» is the one that keeps being got wrong. It is **و + ايش**, two words. Write «ايش» unless a conjunction is genuinely needed at that point in the sentence — in a list («مين هو، وايش دوره، ووين وصلتم») or joining two clauses («ايش يقدّمه وايش ما يقدّمه»). After an em-dash, after a colon, or at the start of a title or clause there is nothing to join, so the و is simply wrong. Audit with `/وايش/` and read every hit in place; the correct count is small.

**Never label a task by who performs it.** The trainee works on all 29 — the source table's «مَن ينفّذها» column needed a whole footnote to stop it reading as «I am not involved in nineteen of these», which is the tell that the column was wrong. The deck's version says **«دورك فيها»** and names a trainee action in every row: تقرّر وتوصف (10) · تراجع وتصحّح (7) · تجرّب وتعدّل (12). Same grouping, no false implication. Apply the same test to any new who-does-what split.

**تكامل and ربط are not synonyms** — تكامل is the *thing* (an MCP connection, the subject of §7.5's
own title) and ربط is the *act* of connecting one. Do not unify them. The rule that matters is
ordering: a slide before §7.5 must say ربط الأدوات الخارجية, because a trainee meeting «التكاملات»
cold has been given a term nobody defined.

### Four more that keep being got wrong

- **Every task row opens with a verb.** «المشكلة والهدف والغايات» is a label, not a task —
  «**تحديد** المشكلة والهدف والغايات» is. A vague row gets rewritten to name its actual output:
  «بقيّة أصحاب المصلحة» → «تحديد الخدمات الخارجية والأطراف المتأثّرة بمشروعك».
- **A title states the takeaway, in spoken Arabic.** A compressed فصحى title is a register failure:
  «حدّان يتجدّدان — لا رصيد لا نهائي» became «رصيدك يتجدّد لحاله، بس فيه حدّين لازم تعرفهم». And a
  title must still describe the slide *after* the slide changes — two went stale unnoticed.
- **A `؟` term window belongs on the slide that *uses* the term — not near it.** Defining «كيان» on a
  Day-2 slide whose cards only ever said «الدور» was reported as actively confusing: the trainee reads
  a definition, hunts the slide for the word, and does not find it. Before shipping a `؟`, grep its
  own slide for the term. If the term is not there, the window is on the wrong slide — move it to
  where the word is actually said, and rewrite the sentence around it so it *introduces* the idea
  rather than assuming it.
- **Never use a term before the slide that defines it.** «التكاملات» appeared 15 slides before §7.5
  defined it; «متطلّب» belongs to §10 and must not leak into §8. If the concept is genuinely needed
  earlier, that is a signal to reorder — not to define it twice. A **gateway example's badge and
  title can spoil its own reveal**: slide 24 withholds "MCP" until its last line, so its badge had
  to change too.
- **No invented quantitative anchors.** «45 رسالة قصيرة» was fabricated. If a number cannot be
  sourced, delete it and record why so it cannot drift back. Prefer a measurable anchor (a 300-line
  file ≈ 4k tokens) over a rate.

### Bidi: four mechanical rules

- **End an Arabic sentence with an Arabic word.** A sentence ending in a Latin word puts the full
  stop at the wrong end (`. read_email`).
- **A neutral character after an isolated Latin run jumps to the other end.** Reorder so the Latin
  token lands last in its clause.
- **Never chain `A ← B` inside one `tok-lat`** — it reads left-to-right and reverses the order for
  an Arabic reader. Use two elements joined by an Arabic verb: «افتح **Settings** ثم اختر **Usage**».
  An arrow cannot fix this; a verb can.
- **An LTR number box in an RTL table cell glues to the Arabic** («8.1المشكلة») — needs
  `text-align: end` and a `min-width`.
- **A dimension pair joined by `×` flips inside Arabic text even when both numbers are plain Latin
  digits.** «1200×630» between two Arabic runs renders backwards — the `×` sits at the RTL paragraph
  level between two LTR runs, so bidi reordering reverses the pair. An isolating span around the whole
  token does not reliably fix this either. The working fix is to not write it as a joined pair at all:
  say it in words instead — «عرضها 1200 وارتفاعها 630» — which sidesteps the hazard rather than
  patching it. Same risk applies to any `A×B`-shaped token inside Arabic prose (resolutions, ratios,
  coordinate pairs); word it out the same way.

### Numerals: Latin digits only, everywhere — never ١٢٣

Write every digit as `1 2 3` — never as Arabic-Indic `١ ٢ ٣`. This applies to step badges
(`<span class="stage__n">1</span>`, not `١`), ordinals inside card titles («1 · عام» not «١ · عام»),
timestamps in captions, durations, IDs — every digit on every slide. Mixed scripts on the same page
read as inconsistent, and Arabic-Indic digits also reorder unpredictably next to Latin tokens in RTL
text, which the bidi rules above already have to fight. One script, one set of digits, always.

Audit with `/[٠-٩]/` over the HTML; found on Day 1 and Day 2's `stage__n` badges and Day 3's EARS
card ordinals as of 2026-09-29 — fix on next touch of those slides, not proactively.

### Never glue an Arabic و to a Latin word

`وpush` and `وSupabase` render as one run and read as a typo. Either use `&` when the و joins two
Latin tokens that form a pair (`commit & push`), or put a space after it (`و Supabase`) when it is
an ordinary sentence conjunction. This holds even where the و is part of an Arabic word.

Audit it with `/و(?:<[^>]+>)*[A-Za-z]/` over the HTML, and again over each slide's rendered text —
the markup form misses cases that only glue after tags are stripped.

---

## Days 2–10 have two session-break slides

A day runs four sessions — شرح المفاهيم · تطبيق مع المدرب · عملك على مشروعك · مراجعة وعرض التقدم —
but from Day 2 the **first two are delivered as one interleaved block**, section by section: the
trainer explains a section, the recording of that same section plays, then the trainer executes it
live. Nothing transitions between them, so only **«عملك على مشروعك»** and **«مراجعة وعرض التقدم»**
open with a break slide. Not the first either: the day opens on شرح المفاهيم, and a "we are starting
now" slide in front of the very first thing is not a transition.

**Day 1 keeps three, and that is correct.** Its «تطبيق مع المدرب» is a separate device-setup
walkthrough, not a re-run of what was just explained. Do not "fix" it down to two.

Without these slides a trainee following the deck cannot tell the session changed, because nothing
else on screen marks it. This is a per-day structural requirement, not a Day-1 detail.

The component is fixed — a full-bleed quote frame, footer carrying **only** the session badge (no
logo, no day label):

```html
<section class="sag-slide sag-quote deck-slide" data-tone="rule" data-surface="dark">
  <div class="sag-quote__inner">
    <div class="sag-quote__mark"></div>
    <p class="sag-quote__text">من هنا نبدأ: عملك على مشروعك</p>
    <p class="sag-quote__attr">…one plain line saying what actually happens in this session…</p>
  </div>
  <footer class="sag-slide__foot">
    <div class="deck-foot">
      <div class="deck-foot__side"><span class="sag-badge">عملك على مشروعك</span></div>
      <span class="deck-foot__num">44</span>
    </div>
  </footer>
</section>
```

These break slides are the only legitimate `sag-quote` use that is not a real pull-quote. The `__attr` line
is the place to say something the session needs and nothing else covers — the عملك على مشروعك break
is where the trainee is told that ticking the finished tasks is **their** job.

---

## Task rows: keys, nesting, and cross-slide sync

`.task` rows are checkboxes (A.6.9). Three attributes drive everything, and the markup stays a
**flat** list — nesting `.task` elements would break the `.tasks` flex column and the `.task` grid:

| attribute | meaning |
|---|---|
| `data-task-key` | explicit id. Omit it and the row keys off its own label text, as rows always have |
| `data-parent` | the key this row rolls up into |
| `class="task--l2"` / `task--l3` | indent + compact sizing for depth 2 and 3 |

**State is keyed, and every element sharing a key repaints together.** That is the whole point: the
day-plan slide lists «7.10 · تجهّز جهازك أنت» as one line and the work-session slide breaks the same
task into eleven rows — one task, two places, and ticking either moves both. The parent/child maps
are built over **keys**, not elements, so a parent ticked on one slide cascades into children that
live on a different slide entirely.

A parent is never ticked by the rollup alone: it shows `partial` (a dash) while some children are
done and flips to a check only on a full house. Clicking a `partial` parent fills it in.

Two traps:

- **Give rows that must sync an explicit `data-task-key`.** Matching on label text across slides is
  brittle — a `؟` qmark button's text is part of the label, so two rows that *look* identical are
  not. Adding a key to an existing row orphans whatever was stored under its old label-derived key;
  harmless between cohorts, but know that it happens.
- **Two rows can look alike and be different tasks.** Day 1 carries «7.10 · نستعرض خطوات تجهيز
  الجهاز أمامك» (trainer demos) and «7.10 · تجهّز جهازك أنت» (trainee does it). Same section, two
  tasks, two keys — never merge them.

Task rows assume a **light** surface: `[data-done="true"]` paints a pale teal that white
`--text-heading` would vanish into. Put a checklist on a light slide, and let the break slide before
it carry the dark.

---

## The three surfaces that must stay in sync

A wording change on a slide usually lives in more than one file. After any content edit, grep all of
these and report what you found:

1. `project-package/slides/day-NN.html` — the slides, including the `<!-- ═══ N — title ═══ -->` banner above each one
2. `project-package/bootcamp_roadmap_and_curriculum.md` — the authoring source. Headings here own
   GitHub anchors, so **renaming a heading breaks every link to it** unless the TOC entry and every
   cross-reference move with it.
3. **One brief per day** in `deck/` — `DECK_BRIEF.md` is Day 1's (named before the convention
   existed), then `day-02-brief.md` and so on. Plus `deck/MEDIA_SHOTLIST.md`, which **covers every
   day, not just Day 1**: Day 1 is still the bulk of it, but the 2026-09-25 showcase reversal gave
   days 2–10 recordings of their own, and each gets a section there — including shots not yet filmed,
   marked ⬜. `deck/` holds *only* these planning docs; the slides themselves live in the package. All
   of them carry slide numbers that go stale the moment a slide is inserted.

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
- [ ] Every new or touched slide **screenshotted and judged by eye for density** — a clean audit
      only proves no overflow, not that the frame isn't under-used
- [ ] Every `class="qmark"` button grepped: nothing but the `؟` glyph between its tags
- [ ] Interactive behaviours exercised in a browser, not reasoned about
- [ ] No task row opens with a و-word
- [ ] Register sweep by **verb family, not one spelling** — `يسو`/`تسو`/`نسو`/`سوّ`, not just «يسوّي».
      A clean single-spelling grep once passed a «تسوي» written minutes earlier, and the family
      sweep's first real run found three more on Day 1. Exclude the noun «المسوّدة»; read the rest
      in place
- [ ] Every «صياغة مقترحة تعطيها لـ Claude» in the day's curriculum sections reaches a slide — count
      in the curriculum, count on the deck, compare
- [ ] Every `؟` term window sits on a slide that actually says its term
- [ ] Every typed command is a `.snipbox` with a copy button; every output line is a bare `.snip`
      with none; grep the touched slide(s) for `tok-code` and confirm no hit is really a command or
      output string in disguise
- [ ] Break slides: days 2–10 carry exactly two («عملك على مشروعك» and «مراجعة وعرض التقدم»),
      and **no** «تطبيق مع المدرب» break; Day 1 keeps its three
- [ ] Checkbox hierarchy exercised in the browser: parent cascades down, children roll a parent up
      to `partial` then to a check, the same key agrees on **both** slides it appears on, state
      survives a reload, and Ctrl+click navigates without ticking
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

**A reported defect is a sample, not the bug.** Named one badly-styled slide → five more had the
same fault. Named three bad task rows → eleven were wrong. Fix the instance, then enumerate the
whole class and report both counts: how many you checked, how many you found.

**Verification scope tracks edit scope.** `deckAudit()` and `deckRefAudit()` are whole-deck and
free — always run them. Full *text* sweeps across every slide are for deck-wide changes only:
a terminology unification, a new styling rule, a `deck.css` edit. Opening every reply with a
50-slide verification after touching one slide is waste, and it was called out as waste.

**But a new styling rule earns one deck-wide sweep** — the rule is new, so nothing before it was
built to comply. Then record what deliberately stays as-is, so the next sweep does not re-flag it.

**Redundant content gets deleted, not reworded.** When told something is already covered elsewhere,
delete it; do not rescue it with a rewrite and a distinction. Then fix the grid's `data-cols` and
hunt the orphaned sentences that referenced it.

**Bump banner numbers before inserting, never after.** Renumber every `<!-- ═══ N — … -->` at or
above the insertion point *first*, then splice the new slide in with its own hardcoded banner.
Doing it the other way round catches the new slide's own banner in the same pass. Back up before
the splice. Deletions are the mirror operation.

**Validate the validator.** Before trusting a custom audit script, prove it fails on a
deliberately-broken input. One reported 55 phantom broken links because its slug rules did not match
GitHub's; the real count was zero.

**ffmpeg exit code 0 is not success.** Verify by duration, frame count or pixel comparison. A
mangled path once produced a silently truncated file at exit 0, and a bad flag produced two empty
frames that compared as "identical".

**A standing "leave it alone" decision is not permanent — it was made under a specific scope, and a
later explicit instruction can override it without contradicting the earlier note.** The handout was
once deliberately left stale for three days because reconciling it sat outside that session's scope;
a later session was explicitly asked to reconcile it, and did — that is a new, in-scope decision
superseding an old out-of-scope one, not a reversal to flag as inconsistent. Read an old "leave it"
note for what scope it was actually made under before assuming it still controls.

**A reversed rule needs its trigger restated, not just its content — and this can go wrong twice in
a row.** "Every screen needs an origin" kept its exact wording across a reshape, but its effective
meaning flipped: before, it was a live check on every screen the trainee wrote; after Claude started
extracting first, it became dead weight unless re-scoped to screens the trainee *adds*. A rule can
look unchanged in a diff and have silently stopped doing anything — check **what population a rule
actually fires against**, not just its text, whenever the step producing its inputs changes. This
exact mistake shipped again one turn later, inside the very fix meant to correct the first instance
of it: a review pass's wording ("did you add this screen") was carried straight through to a new flow
without checking whether the trainee had actually done any adding yet at that point in it. Catching
the pattern once does not inoculate against writing it again — ask fresh, every time a flow is
restructured, "what has actually happened by this step," not "does this match what I already know to
avoid."

**Reviewing an AI's output and stating what only the trainee knows are different kinds of value — a
task can satisfy the first completely and still omit the second entirely.** A review-structure
reshape (passes, a gap list, an origin field) can genuinely improve a task while every bit of it stays
about checking Claude's work; nothing in it asks the trainee to say what was never in the source data
to begin with, which is the one thing no amount of extraction quality can produce. When a task's
stated purpose is "the trainee's input matters here," counting review steps is not the same as
checking for an actual elicitation prompt.

**A list produced for someone to act on later is not the same as acting on it with them now — even
when the list itself was the right thing to produce.** A gap list (steps or requirements with no
matching screen) can be entirely correct and still hand the resolution work back to the trainee by
being displayed and left — exactly the manual-matching burden an automated extraction step exists to
remove. The fix is not a better list; it is asking what happens to each item immediately, in the same
turn, instead of after.

**The affordance a plain-language request describes often already exists under a different name.**
Asked for "an icon that explains RTL and LTR," the literal reading suggests a new UI element; the
actual need — click a marker next to a term, see its definition — was already the `.qmark` +
`<template class="terms">` component (`references/deck-anatomy.md`), used earlier the same day.
Before adding a new component for a described interaction, check whether an existing one already
produces it under different words.

Report honestly. If a measurement contradicts something you said earlier, say so plainly and move on.
