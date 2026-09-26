# Day 3 — deck brief

The slide-by-slide record of `project-package/slides/day-03.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §2.3 plus §16 and §10.
If this brief and the curriculum disagree, the curriculum wins.

**18 slides.** Built 2026-09-25, the first day assembled against the hardened
`day-deck-recipe.md` rather than by copying Day 2 by eye.

**Day 3 budget:** شرح المفاهيم 42 د · تطبيق مع المدرب 64 د · عمل المتدربين 82 د · مراجعة 27 د =
**215 د** (+ استراحة 25 د). Verified live: every session's declared duration equals the sum of its
own task rows, and slides 2+3 total exactly 215.

**Two sections, in agenda order not numeric order: §16 النشر first, then §10 المتطلبات.**

**Media: one of two recordings landed and is embedded.** `deployment.mp4` (3:22) covers §16 end to
end and is live on slide 9, time-stamped against extracted frames. Slide 13 (§10) still ships as a
`stepvid__video--soon` placeholder — see `MEDIA_SHOTLIST.md` for its capture brief.

---

## Three decisions this deck encodes

**1. §16 is watched, not re-run live.** Deploying an already-deployed project produces nothing, and
the account steps (signup, the two OAuth confirmations) happen once per person ever. So §16 runs
*explain → watch* and stops; §10 keeps the full *explain → watch → re-run* cycle. The deck says so
out loud on slide 2's session note and in slide 9's badge («نشوفه بس، ما نعيده») — a silently
dropped live third reads as an omission. This is the general rule now written into
`day-deck-recipe.md`, so §16.3 on Day 10 inherits it.

**2. §10 shows one fully worked example but never names its formats.** The curriculum is explicit
that EARS/Gherkin are explained on **Day 4** «قبل أن تكتبها مباشرةً», while the deck rule forbids
using a term before the slide that defines it. Slide 11 resolves both: it shows the store-owner note
turning into a complete requirement — ID, priority, the عندما…يجب على النظام sentence, the story,
the acceptance line — and names none of it. It closes on «ولا تحفظ شكلها — تشوفها بكرة اسمًا اسمًا».
Day 4 then names what trainees have already watched happen.

**3. The §16 recording will film everything, with the key values blurred.** It is the first
recording in the course where a real secret appears on screen. Step 8 of slide 9 carries a
`stepvid__fix` note telling the room the blur is deliberate and that they are seeing *where* the
keys go, not their values — which doubles as the lesson about how Claude treats their own keys.

---

## Slides

| # | Slide | Component | Anchor | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم الثالث | `sag-title` dark | — | |
| 2 | مهامّ اليوم: شرح (42 د) + تطبيق (64 د) | 2 × `.sess` | — | Rows verbatim from §2.3. Footer note states the interleave **and** the §16 exception |
| 3 | مهامّ اليوم: عملك (82 د) + مراجعة (27 د) | 2 × `.sess` | — | Note says the deploy is the longest task *because first deploys stumble* — budgeted, not a failure |
| 4 | أهداف اليوم | 4 cards | — | **Goals last in the block.** Closes on «وما راح يكون مكتملًا — وهذا مقصود» |
| 5 | §16 — رابط يفتحه أي أحد | 3 cards + warning | `s16-concept` | Carries the honest admission: the trainer's own project shipped only at the end. Warning card asks «ليش قدّمنا النشر لليوم الثالث؟» — a decision the slide just made, not a rule it assumes you know |
| 6 | §16 — مين يعمل ايش، وبأي أداتين | 2 + 2 cards + note | `s16-who` | You = account + two confirmations. Tools note explains *why two*, and folds in the three-task map |
| 7 | 16.1 — تهيئتك | `.flow` + prompt + 1 command card | `task-161` | Ready-made prompt from curriculum, **re-verified against extracted frames of `deployment.mp4` (2026-09-26)** — see the correction below. Step 2: Claude runs `claude mcp add` and triggers `vercel login`, **one browser confirmation**; step 3 is the real mechanism — a separate `PowerShell`, `claude` (approving a one-time "new MCP server" trust prompt), `/mcp` → `vercel` → `Authenticate`, the **same dance as Supabase on Day 1** (day-01 banner 40). Both commands share **one** full-width card — two cards overflowed by 17 px |
| 8 | 16.2 — أوّل نشر | `.flow` + prompt + 2 cards | `task-162` | Prompt from curriculum:3049. Warning card = why root-dir and keys-before-deploy are ordered steps, not luck. **Four `.ttip` tooltips** carry the vocabulary a non-engineer cannot infer: مجلّد الجذر · مجلّد تطبيقك · المجلّد الغلط · مفاتيح الإنتاج |
| **9** | **▶ المقطع: §16 — `deployment.mp4`** | **`stepvid`** | `demo-16` | **Filmed and embedded (2026-09-26).** 13 steps, 2 dividers, 2 `stepvid__fix` notes (the CLI-availability caveat on step 1, the blur note on step 8). No amber row — the one moment that would have needed one (a failed deploy) is real footage instead: a first attempt fails and Claude retries from inside `application` |
| 10 | §10 — وثيقة تقول ايش يعمله مشروعك | 2 cards + note | `s10-concept` | FR = *ايش* · NFR = *كيف*. Says plainly the trainee never writes the formats |
| 11 | §10 — من جملتك إلى متطلّب مكتمل | before → after | `s10-parts` | **The worked example.** Formats shown, never named (decision 2) |
| 12 | 10.1 — ملاحظاتك الحرّة | `.flow` + prompt + note | `task-101` | Prompt from curriculum:1591. Title note names `notebook.txt` |
| **13** | **▶ المقطع: 10.1** | **`stepvid --soon`** | `demo-10` | 8 steps, 1 amber row (the unhappy paths) |
| 14 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | |
| 15 | دورك الآن | 2 × `.sess` nested + note | `your-turn` | Sub-tasks `data-ref` to slides 7, 8, 12 |
| 16 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | |
| 17 | مخرَج اليوم | 3 cards + quote | `day-review` | |
| 18 | غدًا — اليوم الرابع | `sag-closing` dark | — | §10 completion + §11 رحلة المستخدم |

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

