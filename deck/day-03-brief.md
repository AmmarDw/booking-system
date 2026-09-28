# Day 3 — deck brief

The slide-by-slide record of `project-package/slides/day-03.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §2.3 plus §16 and §10.
If this brief and the curriculum disagree, the curriculum wins.

**22 slides.** Built 2026-09-25 against the hardened `day-deck-recipe.md`; **rebalanced and
extended 2026-09-28** when §10's formats theory and task 10.2 moved in from Day 4.

**Day 3 budget:** شرح المفاهيم 65 د · تطبيق مع المدرب 56 د · عمل المتدربين 72 د · مراجعة 22 د =
**215 د** (+ استراحة 25 د). Verified live: every session's declared duration equals the sum of its
own task rows, slides 2+3 total exactly 215, and slide 19's two `.sess` totals (25 + 47) re-split
the same 72 د.

> **The rebalance.** §16 was massively over-budgeted: 52 د to *watch* a 3:21 recording with 13 steps,
> and 67 د for a trainee to run one-time account-bound setup. Cut to **26 د** and **30 د**, freeing
> 63 د. Day 4 then handed over 71 د (formats 26 · 10.2 live 18 · 10.2 trainee work 22 · 10.2 review
> 5), and the 8 د difference came off the two commit&push rows (−5, "most but not all" as
> instructed), §10's concept row (−2, since the formats section now follows it immediately) and Q&A
> (−1). **Day 3 is now the day functional requirements finish**, not merely start.

**Two sections, in agenda order not numeric order: §16 النشر first, then §10 المتطلبات.**

**Media: both §16 and §10.1 are filmed and embedded.** `deployment.mp4` (3:22) on slide 9;
`task-10.1.mp4` (6:16) on slide 15, 15 steps across 4 dividers, every timestamp confirmed against
its own extracted frame. Slide 17 is a new `stepvid__video--soon` placeholder for the 10.2 review
round — see `MEDIA_SHOTLIST.md`.

---

## Three decisions this deck encodes

**1. §16 is watched, not re-run live.** Deploying an already-deployed project produces nothing, and
the account steps (signup, the two OAuth confirmations) happen once per person ever. So §16 runs
*explain → watch* and stops; §10 keeps the full *explain → watch → re-run* cycle. The deck says so
out loud on slide 2's session note and in slide 9's badge («نشوفه بس، ما نعيده») — a silently
dropped live third reads as an omission. This is the general rule now written into
`day-deck-recipe.md`, so §16.3 on Day 10 inherits it.

**2. ~~§10 never names its formats~~ — REVERSED 2026-09-28.** The old decision deferred EARS and
Gherkin to Day 4. Day 4 no longer teaches them: the whole 26 د formats block moved to Day 3, because
a trainee who *writes* their requirements today cannot review what Claude produced without knowing
what its parts are called.

The term-ordering rule still holds, and drives the slide order: **slide 11 stays unnamed** (it comes
before the definition), and its closing line changed from «تشوفها بكرة اسمًا اسمًا» to «نسمّيها وحدة
وحدة في الشريحتين الجايتين». Slide 12 then names EARS and expands it —
**Easy Approach to Requirements Syntax**, which is expanded nowhere else in the repo — using day-01's
MVP pattern (Arabic name · `tok-lat` acronym · `sag-slide__title--note` expansion). Slide 13 names
the other three parts. Slide 10 gained an `SRS` `.ttip`, since day-01's gloss cannot cross decks.

**3. The §16 recording will film everything, with the key values blurred.** It is the first
recording in the course where a real secret appears on screen. Step 8 of slide 9 carries a
`stepvid__fix` note telling the room the blur is deliberate and that they are seeing *where* the
keys go, not their values — which doubles as the lesson about how Claude treats their own keys.

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم الثالث | `sag-title` dark | — | |
| 2 | مهامّ اليوم: شرح (65 د) + تطبيق (56 د) | 2 × `.sess` | — | Rows verbatim from §2.3. Gained the 26 د formats row and the 18 د 10.2 row; §16's two rows cut 42→21 and 10→5 |
| 3 | مهامّ اليوم: عملك (72 د) + مراجعة (22 د) | 2 × `.sess` | — | **Note rewritten:** the longest row is no longer the deploy (15 د) but 10.1+10.2 at 44 د, so «أطولها نشرك أنت» became «أطولها متطلباتك». New `d3-rev-reqs` review row |
| 4 | أهداف اليوم | 4 cards | — | **Goals last in the block.** Card 2 now promises متطلباتك الوظيفية **كاملة**, not «نبدأ اليوم ونكمّل بكرة» |
| 5 | §16 — رابط يفتحه أي أحد | 3 cards + warning | `s16-concept` | Carries the honest admission: the trainer's own project shipped only at the end |
| 6 | §16 — مين يعمل ايش، وبأي أداتين | 2 + 2 cards + note | `s16-who` | You = account + two confirmations. Tools note explains *why two* |
| 7 | 16.1 — تهيئتك | 1 `.card` + `.flow flow--tight`, 4 steps | `task-161` | Rebuilt 2026-09-26 into one container with the combined `.promptbox` prompt (CLI install + MCP link in one paste, 4 nested `.snipbox` commands). Closed a ~97 px overflow with a scoped `.flow--tight` + `.snip--sm` rather than shrinking base components |
| 8 | 16.2 — أوّل نشر | `.flow` + prompt + 2 cards | `task-162` | Prompt opens with the verification clause slide 7's step 4 points at. **Four `.ttip`s** carry the vocabulary a non-engineer cannot infer |
| **9** | **▶ المقطع: §16 — `deployment.mp4`** | **`stepvid`** | `demo-16` | 13 steps, 2 dividers, 2 `stepvid__fix`. Step 1's note says the filmed manual CLI install is the *fallback*; slide 7 teaches Claude doing it |
| 10 | §10 — وثيقة تقول ايش يعمله مشروعك | 2 cards + note | `s10-concept` | FR = *ايش* · NFR = *كيف*. **Gained an `SRS` `.ttip`** — day-01 has one but `data-ref` cannot cross decks |
| 11 | §10 — من جملتك إلى متطلّب مكتمل | before → after | `s10-parts` | **The worked example, still unnamed** — it precedes the definition. Closing line now points two slides ahead, not to tomorrow |
| **12** | **§10 — صيغة `EARS`: أربعة قوالب** | 4 cards + note | `s10-ears` | **NEW.** Expands **Easy Approach to Requirements Syntax** in a `sag-slide__title--note`, MVP-style — the acronym is expanded nowhere else in the repo. One concrete store example per pattern; the warning-bordered 4th card is the unwanted-behaviour one, flagged as the most-forgotten |
| **13** | **§10 — القصة والقبول والأولوية** | 2 + 2 cards + warning | `s10-story` | **NEW.** The other three parts. Closes on «لو طلعت كلها 10/10 فما رتّبت شي» |
| 14 | 10.1 — ملاحظاتك الحرّة | `.flow` + prompt + note | `task-101` | **Gained the options lesson:** what comes back is questions *with options* — you pick, you don't compose — plus the exact sentence to send if it comes back as prose |
| **15** | **▶ المقطع: 10.1 + صياغة 10.2 — `task-10.1.mp4`** | **`stepvid`** | `demo-10` | **Filmed and embedded (2026-09-28).** 6:16, 15 steps, 4 dividers, 1 `stepvid__fix`. Covers 10.1 end-to-end **and** the FR-writing half of 10.2. Opens on a manual `/compact` — glossed inline in step 1 since 7.8 is now Day 5 |
| **16** | **10.2 — صياغة المتطلبات** | 2 + 2 cards | `task-102` | **NEW.** The ready-made prompt, فحص الجودة as the four review questions, the three-conflicts story, and «توقّع جولتين أو ثلاث» |
| **17** | **▶ المقطع: جولة المراجعة** | **`stepvid --soon`** | `demo-102` | **NEW placeholder.** 6 ordinal steps + 1 amber row (the priority sweep). Filmed only if the review half gets its own take |
| 18 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 19 | دورك الآن | 2 × `.sess` nested + note | `your-turn` | Sessions re-split 25 / 47. Two new L2 rows under `d3-notes` for the 10.2 half; `d3-push` finally got the `data-ref` it was missing, so the slide's own «Ctrl + نقرة على أي مهمّة» promise is true for every row |
| 20 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 21 | مخرَج اليوم | 3 cards + quote | `day-review` | Middle card is now «متطلباتك مكتوبة ومراجَعة», not just notes coverage |
| 22 | غدًا — اليوم الرابع | `sag-closing` dark | — | **Rewritten:** tomorrow is §10.3 صفات الجودة + §11 رحلة المستخدم. The old card promising «نسمّي الصيغ اللي شفتها اليوم بأسمائها» is gone — that happens today now |

---

## What the build caught — worth keeping

- **The verb-family sweep found 12 violations in this file's own first draft.** Every one was a
  `سوي` form («ايش يعمله» was written «ايش يسويه» throughout). The old single-spelling grep for
  «يسوّي» would have passed all 12. The rule earned itself on its first use.
- **Slide 15 overflowed by 625 px** — the nested checklist, exactly the risk the recipe names.
  The fix was not splitting it: the two full prompt cards were the wrong content for that slide in
  the first place. §4.1 redundancy control says the summary location carries a **teaser** and the
  dedicated page carries the full text, and slides 7/8/12 are the dedicated pages. They became one
  teaser line, and two sub-tasks merged. Now fits with room to spare.
- **`scrollHeight` lied about it afterwards.** After the trim `deckAudit()` reported clean while a
  raw `scrollHeight` reading still claimed 571 px of overflow. That is the Cairo ink-bleed trap the
  skill documents — `deckAudit()` is the authority, and a screenshot settled it.
- **A 61-character command cannot live in a half-width card.** `.snip` is `white-space: pre;
  overflow-x: auto`, so `claude mcp add --transport http vercel …` scrolled out of view and took the
  absolutely-positioned copy button with it. Moved to a full-width row. **Check any command over
  ~40 chars against its container width.**
- **"We don't deploy the project, we deploy the path to it" was simply false.** Slide 5 said it to
  make the early-deploy argument land. We *do* deploy the project — an empty version of it — and what
  the first deploy establishes is the pipeline, which is set up, not published. Rewritten to
  «ننشره فعلًا، بس وهو لسه شبه فاضي». **A memorable framing that misstates the mechanism is worse than
  a plain one.**
- **A note may not open on a question the slide has not earned.** «وليش صارت هذي قاعدة؟» presupposed
  that the trainee already knew a rule existed and was only missing its reason — nothing before it
  had said so. Reframed as «ليش قدّمنا النشر لليوم الثالث؟», which asks about a decision the slide has
  just made. (The leading و was wrong too.) **Check that a rhetorical question's presupposition is
  something an earlier slide actually established.**
- **Name a tool as its makers name it.** «وسطر الأوامر» sat beside «أداة Vercel (MCP)» in a pair of
  cards both described as أدوات, so the second read as a generic concept rather than the other tool.
  It is the Vercel CLI → «وأداة سطر الأوامر التابعة لـ Vercel», and the note below now distinguishes
  «أداة MCP» from «أداة سطر الأوامر» instead of saying «الأداة».
- **A slide can be internally coherent and still describe a flow that does not exist.** Slide 7 said
  «Claude يعطيك رابطًا، تفتحه وتؤكّده» for the MCP login. The recording shows something else entirely:
  the trainee opens a **separate `PowerShell`**, runs `claude`, types `/mcp`, picks `vercel` →
  `Authenticate`, and the browser opens by itself. The slide also invented a browser consent at
  `claude mcp add`, where the recording shows none. Neither error was catchable by reading the deck —
  only by checking it against the footage. **When a recording lands, re-verify every slide that
  narrates it, not just the video slide.**
- **The step the deck forgot was the one that ran first.** `deployment.mp4` opens on
  `npm install -g vercel`, which appears in no slide, not in §16 of the curriculum, and not in 7.10's
  Day-1 install list. A prerequisite is easiest to miss precisely because it happens before the part
  you were thinking about.
- **Check a fix against the rendered line, not the markup.** The corrected step-3 sentence passed
  `deckAudit()` and still had two bidi faults visible only in a screenshot: the comma after
  `<span class="tok-code">claude</span>` jumped to the wrong end, and the line closed on
  `Authenticate:` — a neutral character after an isolated Latin run. Fixed by removing the comma
  after the code token and ending the clause on «من القائمة:». **Screenshot every line that mixes
  Arabic with a code token.**
- **`card__num-row` does not exist.** Invented while drafting slide 18; the real pattern is
  `card__top` with `card__num` inside. An invented class fails silently — no error, just unstyled
  markup. Same class of bug as an undefined `i-*` icon.
- **A fix made from a transcript summary can be as wrong as the bug it replaced.** The very next
  pass on this file corrected step 2 *again*: "Claude installs the Vercel CLI" was itself unverified
  — extracted frames show a bare `cmd.exe` window, human-typed, before Claude is ever opened. The
  same rule that caught the original bug (verify against frames, not a summary) had to be applied a
  second time to the fix for it. **A correction is a claim too, and needs the same evidence a bug
  report does.**
- **A single message can quietly do two jobs.** The trainee's real "confirm, then deploy" message
  turned out to be *one* combined prompt covering both the 16.1 verification and the 16.2 kickoff —
  the two ready-made prompts on slides 7 and 8 stay separate for teaching, but the video's own step 7
  now says so honestly rather than implying two distinct sends.
- **Proof beats a screenshot of the mechanism.** No frame shows the literal `vercel env add` call, so
  step 8 doesn't claim one. It cites the strongest evidence that actually exists instead: a live login
  on the deployed URL that greets the trainer by his own email — which cannot happen without a working
  database connection. **Cite the evidence you have, not the action you'd have liked to capture.**

### From the 2026-09-28 rebalance and `task-10.1.mp4`

- **A budget can be wrong by 2× and never get questioned, because it sums to 215.** §16's 52 د of
  watching and 67 د of one-time setup were internally consistent and arithmetically perfect. What
  exposed them was asking a different question — *how long does it take to watch 13 steps?* — not
  re-checking the sum. **The invariant that a day totals 215 د validates nothing about whether any
  individual row is sane.**
- **Moving content between days moves its vocabulary debt with it.** Pulling the formats block to
  Day 3 silently invalidated three things on slides that nobody edited: slide 11's «تشوفها بكرة», the
  closing slide's promise that tomorrow names the formats, and Day 2's forward-preview saying Day 3
  merely *starts* requirements. **After a cross-day move, grep both decks for every forward
  reference to the day you moved from.**
- **`innerText` only sees the active slide.** A register sweep over `document.body.innerText`
  returned zero EARS and zero SRS mentions on a deck that has both — because 21 of 22 slides are
  hidden. It also hid every real waw+Latin glue. **Sweep `textContent`, never `innerText`**, and
  cross-check against the raw markup, which catches what neither renders.
- **Not every regex hit is a violation, and the difference matters.** This pass flagged 11 «منتج»
  (all of them the store example's literal *merchandise*, which is correct) and 2 «وايش» (both
  genuine list-joins, which the rule explicitly permits). **Read every hit in place** — the
  vocabulary rules are semantic, and a blind fix would have broken correct Arabic.
- **The recording is the evidence that a package rule is missing.** Two package defects were not
  visible anywhere in the repo, only in the footage: gap-questions arriving as prose (the trainee had
  to *ask* for options) and 32 requirements rendering as one garbled LTR line each. Both are now
  written into `writing-requirements/SKILL.md`, and the RTL rule was widened from
  `conversation_history.md` to every Arabic `.md` in `bootcamp-mvp-process.md` §5.2.

