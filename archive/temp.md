# Task 8.1 — refactoring prompt, analysis, and confirmed decisions

This file has three parts, in this order:

- **PART I — THE REFACTORING PROMPT.** Hand this to the other session. It is self-contained and states what to change and why.
- **PART II — THE FULL ANALYSIS.** The evidence behind every instruction in Part I, including three findings from the first pass that turned out to be **wrong** and are corrected here.
- **PART III — DECISION RECORD.** What was asked, what was answered, what is final.

---
---

# PART I — THE REFACTORING PROMPT

> **Paste everything from this line down to the end of Part I into the other session.** Parts II and III are attached as the evidence file; tell that session to read them when it needs the *why* behind an instruction.

---

## 0. Who you are and what this is

You are working on the **SAG Lab Arabic bootcamp package** in this repository. The user is the trainer/author. You have the full directory and its history in your context.

A **read-only analysis session** audited **task 8.1 (تعريف المشكلة والهدف والغايات)** and its surrounding material and found that it is both **inconsistent across files** and **badly over-complicated for the trainee**. The user reviewed the findings and made a decision on every open question. **Those decisions are final and are recorded in Part III — do not re-open them, do not propose alternatives, and do not ask the user to re-choose.** Your job is execution.

**The analysis session changed nothing.** Every file is exactly as it was audited. You are authorized to change the files listed in §4.

### 0.1 Hard constraints

1. **`bootcamp-deck` skill is mandatory for every single slide touch.** New slide, one-word fix, a restyle, a reorder, a deletion — invoke it first, every time. There is no edit small enough to skip it.
2. **Obey `CLAUDE.md` §A.6 in full** (the deck standards), especially:
   - **A.6.1** — the deck is the only thing trainees read. Nothing may depend on "see section N of the curriculum".
   - **A.6.2** — completing a slide must not multiply slides. The one sanctioned addition in this work is **+1 slide on Day 2** (§5). Everything else grows inside existing frames.
   - **A.6.3** — plain, spoken-leaning Arabic (المحكية البيضاء). Not telegraphic, not heavy فصحى, not Gulf-only.
   - **A.6.4** — pitch to a trainee who has *heard* the words and knows nothing about how they work.
   - **A.6.5** — concrete examples, never vague ones.
   - **A.6.7** — «مشروع» not «منتج»; «ايش» not «وايش»; never «دليل»; never «الطرفية».
   - **A.6.7.1** — **address ONE trainee, always singular. Never a «نحن» that includes Claude.**
   - **A.6.11** — calibrate example dose; do not over-dose a light topic.
3. **Do not touch anything not listed in §4.** No opportunistic cleanups.
4. **Line numbers in this prompt are file lines**, not rendered positions.
5. **`graphify` is available** if you need to locate something without burning tokens on a directory sweep. Do not re-read files this prompt already quotes.
6. **Plan mode first**, then execute, per the project's working style.

### 0.2 Verification results — already done, do not redo

| Verified | Result | What it means for you |
|---|---|---|
| **Slide page numbers** | `slides/assets/deck.js:765-766` **auto-assigns** every `.deck-foot__num` from document order at init. Its own code comment says hand-bumping numbers is "a whole class of silent drift for no benefit." | **Never hand-edit `deck-foot__num`.** The hardcoded values in `day-01.html` are stale (duplicates at 29/38/39, gaps at 34/36/37/47, and slides 4–18 scrambled) but **harmless** — they are overwritten at runtime. Leave them alone. `day-02.html` happens to be in sync; that is luck, not a rule. |
| **Slide identity** | `day-01.html` = 49 sections, `day-02.html` = 21 sections. The `<!-- ═══ N — title ═══ -->` banner indices **do** match document order in both files. | **Identify slides by banner index and `data-anchor`**, never by footer number. All "slide N" references in this prompt are banner indices. |
| **Flow component** | `.flow` and `.flow--row` exist (`assets/deck.css:1676-1707`): a CSS-counter-numbered `<ol>`, 2-column grid in `--row`. | Reuse it for linear steps. **There is no arrow, connector, or loop component** — the back-arrow in §4 must be built (see §4.3). |
| **`notebook.txt` pattern** | Exists at repo root, 1836 lines, **git-ignored** (`.gitignore:13`), opens with a header telling any LLM not to read it. | This is the model for the trainee's notebook (§4.6). |
| **`project-package/` has no `.gitignore`** | Confirmed. | You must create one (§4.6). |
| **"BookIt"** | Appears only at `PROJECT_REPORT.md:276,284` — it is the alias used in the **Claude Design** prompts (§12), not in the MVP definition at lines 27–43. | Minor: the two are the same project under two names. Do not introduce "BookIt" into §8 material. |
| **Generic examples** | Sections 9, 10, 11, 12, 13 all carry a «مثال عام (ليس مشروع الدورة)» built on the same **inventory app** (curriculum lines 1356, 1531, 1746, 1928, 2160). **Section 8 has none.** | §4.3 requires you to add one, using the same inventory app, for consistency. |

---

## 1. The one thing to internalize before you touch anything

The course's method is stated in five places and rendered on **Day-1 slide 12**:

> «اكتب كل اللي في بالك أوّل، وبعدين رتّبه… لا تفكّر وترتّب في نفس الوقت — لأنك بتنشغل بالترتيب وتضيع منك أفكار.»

**Task 8.1's slides currently break that rule.** Before the trainee writes a word, the deck teaches a *classification system* (غاية vs خاصية) and a *derivation order* (objectives first, then features). Both are **Claude's internal machinery**. Putting them in front of the trainee turns an easy task ("tell me about your idea") into a hard one ("tell me about your idea, but sort every sentence into the right bucket, and don't mention screens").

The user — a software engineer — got lost in that distinction. A non-technical trainee has no chance.

**The purpose of asking outcome-shaped questions is not to teach a taxonomy.** It is that *"what changes for your user?"* is a question anyone can answer, while *"what features will you build?"* is not. We harvest the easy answers and **Claude** converts them into features. The trainee never performs the conversion and never needs the vocabulary for it.

**Every instruction below follows from that.** When a judgement call comes up that this prompt does not cover, resolve it by asking: *does this help the trainee start writing, or does it give them something to get right first?* Choose the former.

---

## 2. THE VOCABULARY LAW — read twice, this is the change most likely to be mangled

### 2.1 The rules

1. **خاصية / خصائص is the primary term, and it means *feature / functionality* in the ordinary industry sense.** It is the thing that later receives requirements in §10. It is the trainee's real deliverable. Use it everywhere a countable unit of the project is meant.

2. **The «3 إلى 5» limit binds to خصائص, and to nothing else, ever.**
   - ✅ «3–5 خصائص»
   - ❌ «3–5 غايات» — **forbidden everywhere, no exceptions.**
   - Objectives are **never counted**. Do not write "3–5 objectives", do not write "write some objectives", do not put a number on them in any form.

3. **«غاية / غايات» is demoted from a defined term to an occasional aid.** It may appear **only**:
   - inside a question the trainee is being asked, or
   - mid-sentence as a passing gloss.

   It may **never** appear as: a card title, a slide title, a defined-term block, a column header, a checkbox label, a counted list, or one half of a compare-and-contrast.

4. **There is no غاية-vs-خاصية comparison anywhere, in any file, in any form.** No two-card spread, no table, no "the difference between them is…". Delete every instance. Each term gets **one inline definition at its point of first use**, one line long, and never again.

5. **Watch the هدف / أهداف collision.** «الهدف» (singular) already means the project's goal. Do **not** introduce «الأهداف» (plural) as the new word for objectives — it reads as the plural of الهدف and creates a fresh ambiguity to replace the one you are removing. Where a noun is unavoidable, use **«النتائج»** («النتائج اللي تبي مشروعك يوصّلها»). Prefer phrasing it as a **question** and using no noun at all.

6. **The framing sentence the user asked for, when a "why" is needed** — use this shape, not a definition:
   > «المدخل الصحيح مو «ايش بتبني» — المدخل هو **ايش المشكلة اللي تبي تحلّها**. من المشكلة يطلع الهدف، ومن الهدف تطلع النتائج اللي تبيها، ومنها يطلّع Claude **خصائص** مشروعك.»

### 2.2 Every place that currently violates this — fix all of them

| File | Line | Current | Required |
|---|---|---|---|
| `slides/day-01.html` | 2061-2076 | Two cards: «الغاية — ليش تبنيه» / «الخاصية — ايش بتبني» | **Delete both cards** (slide is rebuilt — §4.1) |
| `slides/day-01.html` | 2094-2096 | «تكتب من **3 إلى 5 غايات** … ثم نحولها ل 3 إلى 5 خصائص» | Rewrite. Limit on خصائص only. Also fixes «نحولها»→2nd-person singular (A.6.7.1), typo «والي»→«واللي», spacing «ل 3»→«لـ3» |
| `slides/day-01.html` | 2080 | «وهذي **غايات** مشروع الحجوزات الأربع» | Relabel — §4.1 |
| `slides/day-01.html` | 2088-2090 | «لاحظ إن كل وحدة نتيجة… مو شاشة ولا زرّ. والشاشات والأزرار تجي بعدين في **النطاق**…» | **Delete outright.** Wrong three ways — see Part II §C |
| `slides/day-02.html` | 246-289 | Entire slide 5 = the غاية/خاصية reminder | **Replaced** by the flow slide — §4.2 |
| `slides/day-02.html` | 276-277 | «تكتب 3–5 **غايات**، وبعدين تشتقّ منها 3–5 خصائص» | Gone with the slide |
| `slides/day-02.html` | 304 | 8.1 card: «فقرة قصيرة تجمع المشكلة والهدف، ومعها **3–5 غايات**» | Rewrite — no count on objectives |
| `slides/day-02.html` | 1017 | Sub-task checkbox: «اكتب **3–5 غايات**» | Rewrite — §4.2 |
| `slides/day-02.html` | 998 | Ready-made prompt: «…ثم **3–5 غايات**» | Rewrite — §4.2 |
| `slides/day-02.html` | 1030 | Review card refers to scope only | Add 8.1 review — §4.2 |
| `bootcamp_roadmap_and_curriculum.md` | 183 | «والفرق بين **الغايات والنطاق**» | Wrong pairing *and* forbidden framing. Replace with the §2.1.6 sentence |
| `bootcamp_roadmap_and_curriculum.md` | 1150-1158 | The «مصطلحان فقط» defined-term block | **Delete the block.** Replace with the §2.1.6 framing sentence |
| `bootcamp_roadmap_and_curriculum.md` | 1162 | «تكتب **3 إلى 5 غايات**، ثم تشتقّ منها 3 إلى 5 خصائص» | Rewrite: limit on خصائص only; Claude derives |
| `bootcamp_roadmap_and_curriculum.md` | 1168, 1175 | المخرَج = «فقرة تعريف + **3–5 غايات**» | Rewrite |
| `bootcamp_roadmap_and_curriculum.md` | 1185 | «اكتب الغايات: **من 3 إلى 5 غايات**…» | Rewrite — §4.4 |
| `bootcamp_roadmap_and_curriculum.md` | 1212 | «**الغايات:** (1)…(4)» | Relabel as Claude's output |
| `bootcamp_roadmap_and_curriculum.md` | 1242-1245 | Fill-in template «**الغايات:** 1. 2. 3.» | Rewrite — §4.4 |
| `bootcamp_roadmap_and_curriculum.md` | 1247 | Prompt: «ثم **3–5 غايات**» | Rewrite |
| `bootcamp_roadmap_and_curriculum.md` | 1253 | «تأكّد أن كل **غاية** ملموسة» | Rewrite |
| `bootcamp_roadmap_and_curriculum.md` | 1319 | FAQ «**كم غاية أكتب؟** من 3 إلى 5…» | **Delete this FAQ entry entirely.** It is the purest form of the banned construction |
| `bootcamp_roadmap_and_curriculum.md` | 1267 | «تخدم **غاياتك** والرحلة الأساسية» | Reword |
| `.claude/skills/defining-mvp/SKILL.md` | 3 | description: «…وغايات ملموسة… حدّ 3–5 **مجالات** أساسية» | Rewrite — §4.5 |
| `.claude/skills/defining-mvp/SKILL.md` | 23 | «استخرج الثلاثة… المشكلة، الهدف، **3–5 غايات**» | Rewrite |
| `.claude/skills/defining-mvp/SKILL.md` | 40 | «**الغايات** ملموسة» quality check | Reword |
| `.claude/skills/defining-mvp/SKILL.md` | 71 | «**الخلط بين الغاية والخاصية**» common error | **Delete** — §4.5 |
| `PRODUCT.md` | 31-34 | «**الغايات:** 1. 2. 3.» | Rewrite — §4.7 |

> **Self-check before you finish:** run `grep -rn "غاي" project-package/` and `grep -rn "3–5 غاي\|3 إلى 5 غاي" project-package/`. The second must return **zero** hits. The first must return only occurrences that sit inside a question or mid-sentence.

---

## 3. What is actually wrong — the four defects, so you understand the fixes

### Defect 1 — Task 8.1 has no *teaching* slide on Day 2

8.1 officially spans both days (`curriculum:1168`, `:1178`, `:214`, `:256`). Day 2 gives it a **50-minute working block** (`day-02.html:149`, `:1013`) and has **no slide showing its steps**. Day 2's concept agenda (`day-02.html:77-82`) has a 10-minute row for 8.2's steps and **no row for 8.1 at all**.

> ⚠ **Correction to the first-pass analysis:** Day 2 is *not* empty of 8.1. It has slide 11 (8.1 الوصف الحرّ — trainer demo), slide 12 (8.1 جولة التصويب — trainer demo), and 8.1 prompts on slide 18 (دورك الآن). What is missing is the **teaching slide** — the analogue of slide 7, which 8.2 has and 8.1 does not. Do not rebuild what exists.

### Defect 2 — The taxonomy is over-taught, and the deck's own examples fail it

Taught or policed five times before the trainee writes anything. Apply the deck's own test to the deck's own four flagship objectives (`day-01.html:2083-2086`):

| Printed as a غاية | Passes «نتيجة، مو شي يُبنى»? |
|---|---|
| «يشوف العميل مواعيد الخدمات المتاحة ويحجز بنفسه» | yes |
| «ما يقدر اثنين يحجزون نفس الموعد عند نفس مقدّم الخدمة» | yes |
| «مقدّم الخدمة يفتح مواعيد لشهر كامل **بخطوة وحدة**» | **no** — a bulk-generator mechanism |
| «كل حجز يوصل منه **إيميل تأكيد وفيه رابط الاجتماع**» | **no** — a built artifact |

Half the canonical examples break the rule printed above them. The boundary is genuinely fuzzy. Teaching it as a bright line teaches something false.

### Defect 3 — The «شاشة ولا زرّ» note is wrong three ways

`day-01.html:2088-2090` — «…مو شاشة ولا زرّ. والشاشات والأزرار تجي بعدين في **النطاق**…»

1. **Introduces «النطاق» a full day before it is defined** (that is Day-2 slide 7).
2. **Uses «النطاق» to mean «خاصية».** Scope is the *container* — three lists. The deck's own definition contradicts this sentence.
3. **Off by a whole level of granularity.** "Screen or button" is **requirement / acceptance-criteria** granularity. `writing-requirements/SKILL.md:134` is explicit — «النطاق يقول ماذا نبني، والمتطلّب يقول كيف يتصرّف النظام» — and its Gherkin example at `:68` is where a button finally appears. Real خصائص in this project look like «لوحة تحكم مشتركة» and «رحلة حجز للعميل» (`curriculum:1281`).

### Defect 4 — «objectives first, then features» is not what actually happened

The curriculum's own trainer transcript, and Day-2 slide 11, both show:

- He did **not** work through steps 1–4: «لم ينفّذ المدرب هذه الخطوات الأربع في أوامر منفصلة، بل وصف فكرته بحرّية في **أمر واحد طويل**» (`curriculum:1190`).
- What he wrote was **pages and screens** — «صفحة هبوط»، «صفحة الحجز»، «تقويم» (`curriculum:1198-1202`).
- Claude extracted the objectives from that (`:1212`).
- Claude extracted **«داخل النطاق» from the very same text** (`:1275`).

**So step 4's prohibition («ولا تكتب شاشة أو زرًّا») forbids exactly what the one documented correct example does.** And Day-2 slide 11's own step ٢ already says the right thing — «صفحات ومواقف، **مو صياغة رسمية**». The deck is already half-correct; the curriculum and slide 28 have not caught up.

---

## 4. The fix, file by file

### 4.1 `slides/day-01.html` — slide 28 (banner 28, lines 2050-2110)

**Currently:** «هذا القسم يجاوب على سؤالين» — two taxonomy cards, the four objectives, the bad note, the 3–5 rule.

**Becomes: the method slide.** It stops teaching a vocabulary and starts showing a path.

- **Title** — reframe to the road, not the two terms. Something in the shape of «من كلامك العادي… لخطة مشروعك» (your wording; A.6.3 register).
- **Delete** both taxonomy cards (2061-2076).
- **Delete** the note at 2088-2090 outright. Do not replace it with a corrected version of itself. If a forward pointer is genuinely useful, the flow's last box (§4.3) already carries it.
- **Insert the flow graphic** specified in §4.3. This is the slide's new centre of gravity.
- **Keep the four booking objectives** (2082-2087) but **relabel them as Claude's output**, not as a taxonomy exhibit: «وهذا اللي طلّعه Claude من كلام المدرب» or equivalent. They stop being a thing the trainee must imitate and become a thing the trainee will *receive*.
- **Keep the 3–5 rule card** (2092-2098), rewritten per §2.1.2 and §2.1.5, in second-person singular.

**Slide count: unchanged.** Everything grows inside the existing frame (A.6.2).

### 4.2 `slides/day-02.html`

**Slide 5 (banner 5, lines 246-289)** — currently the غاية/خاصية reminder.
→ **Replace its entire body with the same flow graphic as Day-1 slide 28.** Identical component, deliberate visual rhyme. Only the lead line differs — Day 1 introduces the road, Day 2 says you are about to walk it. Title changes accordingly. **Net slide delta: 0.**

**NEW slide, inserted immediately after slide 6 (القسم 8 مهمّتان), before slide 7 (8.2's three lists)** — the canonical 8.1 slide, Day-2 instance. Full spec in §5. **Net slide delta: +1.** This is the one sanctioned addition.

**Slide 6 (banner 6)** — line 304: remove the «3–5 غايات» count from the 8.1 output description. Keep everything else.

**Slide 7 (banner 7)** — add a **one-line inline definition of «خاصية» at its point of use**, per §2.1.4. Line 355 already half does it («3–5 خصائص بتنشحن فعلًا»); make it explicitly say a خاصية is a thing the project *does* for its user — the unit that gets detailed later in §10. One line. Do not add a card.

**Slide 18 (banner 18, دورك الآن, lines 925-1023)** — three surgical changes:
1. Line 1017 — sub-task «اكتب 3–5 غايات» → recast with no count, as the outcome question.
2. Line 1020 — sub-task «اشتقّ منها 3–5 خصائص» → **the trainee does not derive; Claude derives and the trainee decides.** Recast as reviewing/deciding, not extracting. (See §6.3 — this is the who-does-what defect.)
3. Line 998 — ready-made prompt «…ثم 3–5 غايات» → rewrite per §2.1.2.

**Slide 20 (banner 20, مراجعة اليوم, lines 1041-1086)** — currently three cards: scope, roles, pushed. **There is no card for reviewing 8.1's own output.** Add one, inside the existing `data-cols="3"` grid by replacing or merging — **do not grow to four cards and do not add a slide.** It must cover, in one card: the problem is real and specific · the goal answers that problem · what you got back is something you actually recognize as your project. Sourced from `curriculum:1251-1254`.

**Slides 2 and 3 (agenda)** — slide 2's concept column (lines 77-82) must gain a row for 8.1's steps, with minutes carved out of the existing 16-minute «8 · مهمّتا القسم» row so the day's 48-minute total is unchanged. Slide 3 needs no change.

**Slides 11, 12, 13 — leave alone.** They are the trainer-demo path and they are already correct. Slide 11 step ٢ already teaches that describing pages is right; slide 12 already teaches the correction round; slide 13 already teaches derivation. Do not touch them.

### 4.3 The flow graphic — exact specification

This is the single most important new artifact. It appears **twice, identically** (Day-1 slide 28, Day-2 slide 5).

**What it must show** — the trainee's contribution is ONE box, and everything else is Claude's work:

```
 ┌──────────────────────┐
 │  تجاوب على أسئلة     │   ← شغلك أنت، وهذا كل شغلك
 │  بكلامك العادي       │
 └──────────┬───────────┘
            ↓
 ┌──────────────────────┐
 │  Claude يصوغ:        │  ⟲ ─── تقرأ وتصوّب. مرّة أو مرّتين — وهذا طبيعي
 │  المشكلة · الهدف ·   │
 │  النتائج اللي تبيها  │
 └──────────┬───────────┘
            ↓
 ┌──────────────────────┐
 │  Claude يطلّع منها:   │  ⟲ ─── تقرّر: ايش يدخل، ايش ما يدخل، ايش يتأجّل
 │  3–5 خصائص = نطاقك   │
 └──────────┬───────────┘
            ↓
 ┌──────────────────────┐
 │  وبعدين، القسم 10:   │
 │  تفاصيل كل خاصية     │
 └──────────────────────┘
```

**Requirements:**

1. **The two back-arrows (⟲) are mandatory.** They are the whole point of the graphic beyond a linear list: the trainee must see that going back and correcting is part of the design, not a sign of failure. Label them in plain words — «تقرأ وتصوّب. مرّة أو مرّتين، وهذا طبيعي». This is the same lesson Day-2 slide 12 teaches in the demo; here it becomes structural.
2. **Box 1 must be visually marked as the trainee's only job.** Different accent from the Claude boxes. The message "your part is small and easy" is carried by the *layout*, not by a sentence.
3. **The last box silently fixes Defect 3.** Screens and buttons live in §10. Never say "not a screen, not a button" — just show where that level belongs.
4. **Do not name a taxonomy anywhere in the graphic.** No «الغاية», no «الخاصية» as defined terms. «النتائج اللي تبيها» in box 2; «خصائص» in box 3 as the plain countable unit.
5. **Add a concrete non-booking example beside or under the flow** — §8 is the only curriculum section without one (verified; 9/10/11/12/13 all have the inventory app). Use **the same inventory app** for consistency, walked through the same four boxes. One line per box. A.6.5: concrete, not vague.
6. **Implementation:** `.flow` / `.flow--row` (`deck.css:1676-1707`) gives you CSS-counter-numbered steps but **no arrows and no loop**. You must build the connectors and the two back-arrows. Prefer inline SVG or CSS pseudo-elements; must be RTL-correct (this is an RTL deck — arrows flow right-to-left) and must survive the overflow guard. **Consult the `bootcamp-deck` skill for how to add a component to this deck** before inventing markup.
7. **It must fit in the existing slide frame on both days.** If it does not fit, cut words from the labels — do not split the slide.

### 4.4 `bootcamp_roadmap_and_curriculum.md` — section 8 and the agenda

Beyond the vocabulary sweep in §2.2:

| Line | Change | Why |
|---|---|---|
| 183 | «ما هو الـMVP؟ والفرق بين الغايات والنطاق» → the §2.1.6 framing | Wrong pairing (objectives vs a *container*) and it is the traceable origin of slide 28's bad note |
| 1150-1158 | **Delete** the «مصطلحان فقط، ولكل واحد معنى واحد» block | This is the taxonomy, in its source form. Replace with the §2.1.6 framing sentence. Note line 1158 also *bans* «مجالات» — carry that ban forward into §4.5 rather than losing it |
| 1156, 1162 | Rewrite so **Claude derives** the features from the trainee's notes | Matches `defining-mvp:50`, matches `:1275`, matches what actually happened |
| **1185** | **Delete the prohibition «ولا تكتب شاشة أو زرًّا — فتلك خصائص مكانها النطاق».** Replace with its opposite: an explicit invitation to describe pages, screens, situations, anything | It forbids exactly what the trainer did (`:1198-1202`) and what Day-2 slide 11 step ٢ endorses. Keep the «سهل/سريع» guidance — that one is sound |
| 1176 | «(هذه أول مهمّة في الدورة)» → «أول مهمّة توثيق» | False: 7.10 and 14.1 precede it on Day 1 (`:186-205`), and the نبذة precedes it (`CLAUDE.md` أ.2.1) |
| 1212 | Objective (3) «إدارة توفّر جماعية **سهلة** **للمشرف**» | Two bugs in one line. **(a)** It is the *pre-correction* version — the trainer's own correction at `:1225` made bulk generation a provider capability too, applied at `:1230`, and Day-1 slide 28 already shows the corrected version. **(b)** «سهلة» is the exact word banned 27 lines earlier at `:1185`. Fix both: restate post-correction, drop «سهلة» |
| 1219-1234 | After the correction collapsible, **restate the corrected list** | Right now the curriculum prints the pre-correction objectives, shows the correction that invalidates them, and never restates them. A trainer reading aloud from the curriculum and from the deck will say two different things |
| 1267 | 8.2 step 1 «**حدّد الخصائص الأساسية** التي ستُشحن فعلًا، واطلب من Claude صياغتها» | Says the trainee decides the features and Claude only phrases them. Contradicts `defining-mvp:50` where Claude derives. Recast: Claude derives and presents; the trainee **decides** what stays, what is out, what is deferred. See §6.3 |
| 1319 | **Delete** the «كم غاية أكتب؟» FAQ entry | The purest instance of the banned construction |
| 1324 | «لماذا مهمّتان لا واحدة؟» | Keep the entry but align the reason with §6.1's one-pass finding: different *outputs* and different *days*, not two rounds of trainee thinking |
| 8 — أسئلة شائعة | Add an entry answering «لازم أكتب النتائج قبل الخصائص؟» with the one-pass answer from §6.1 | The trainee will wonder; answer it once, plainly |
| §6 package tree (~745-790) | Add a `notebook.txt` row; line 778 («الملفّان اللذان تقرؤهما أنت») must be reworded now that a third trainee-facing file exists | Required by §4.6 |

### 4.5 `.claude/skills/defining-mvp/SKILL.md`

> ⚠ This file is currently **modified in git** (uncommitted). Check its working-tree state before editing; the user may have edits in flight.

| Line | Change | Why |
|---|---|---|
| 3 (description) | Replace «حدّ 3–5 **مجالات** أساسية» → «حدّ 3–5 **خصائص**». Also drop «غايات ملموسة» from the description | `curriculum:1158` explicitly bans «مجالات»: «لا «نقاط» ولا «مجالات» ولا «عناصر نطاق» — غايات وخصائص، وكفى». Claude is currently instructed in the exact vocabulary the trainee is told never to hear |
| 50 | «واستخرج منه **المجالات**» → «الخصائص» | Same ban |
| 60 | «حين تتجاوز **مجالاته** الحدّ» → «خصائصه» | Same ban |
| 16 | «هذه **أول مهمّة** يؤدّيها المتدرّب في الدورة» | False (see §4.4/1176). The argument that follows rests on it — rewrite as "first documentation task", keep the argument |
| 23 | «استخرج الثلاثة… **3–5 غايات**» | Drop the count |
| 40 | Quality check «**الغايات** ملموسة» | Reword without the term as a heading |
| **71** | **Delete** the «الخلط بين الغاية والخاصية» common-error row | It instructs Claude to *correct the trainee* on a distinction the trainee is no longer taught. Worse, its example defines a خاصية as **«شاشة إضافة منتج»** — a *screen*. See §6.2 |
| 72 | Keep «نطاق يصف تقنيات» | Correct and useful |
| **NEW — add a section** | **The Day-1 / Day-2 split of 8.1.** Day 1: ask the questions, let the trainee talk, **write nothing formal, do not produce a draft.** Day 2: formalize, run the correction round, write `PRODUCT.md` §1.1 | The skill currently has no idea 8.1 spans two days. `CLAUDE.md` أ.2.1 covers the Day-1 نبذة and explicitly says it is *not* 8.1 — leaving the Day-1 half of 8.1 unowned |
| **NEW — add a rule** | **Never ask the trainee to classify anything, and never reject feature-shaped input.** If they describe pages and screens, that is correct input — accept it and derive both the outcomes and the features from it | This is what actually happened (`curriculum:1190`, `:1198-1202`, `:1275`) and what Day-2 slide 11 already teaches |
| **NEW — add a rule** | **Never read the trainee's `notebook.txt`.** It is drafts, it is incomplete, and reading it burns their budget. They paste from it | §4.6 |

### 4.6 `notebook.txt` — the new trainee scratchpad *(replaces the earlier `PRODUCT.md §1.0.1` idea — do not implement that)*

The Day-1 half of 8.1 currently has **no destination**: slide 48 says "start gathering your notes" and never says where they go. `PRODUCT.md` §1.0 is the نبذة and is frozen by `CLAUDE.md` أ.2.1; §1.1 is the Day-2 formal output. Nothing in between.

**Create `project-package/notebook.txt`**, modelled on the repo-root `notebook.txt`:

1. **Plain `.txt`, not `.md` — deliberately.** It opens in Notepad on Windows with zero formatting affordances. That is the point: no headings, no bullets, no pressure to structure. It is the physical embodiment of Day-1 slide 12's rule.
2. **Header comment at the top**, in the same spirit as the root file: this is the trainee's personal draft space; **Claude must not read it**; it exists so the trainee can write badly and think freely, then paste what is ready into the chat.
3. **Seed it with the §5 questions as bare prompts with blank space under each** — so a trainee who opens it on Day 1 finds something to answer, not an empty file.
4. **Create `project-package/.gitignore`** (it has none — verified) containing `notebook.txt`, mirroring `.gitignore:13` at the repo root. Rationale: personal scratch, incomplete, not a deliverable. Mention this in the file header so the trainee knows their rough notes are not going public.
5. **Register it in three places:**
   - **Day-1 slide 16** (`day-01.html`, banner 16, `.pkgtree`) — add a row. It is a file the trainee **writes**, which is a new category: the existing modifier `pkgtree__p--read` marks files they *read*. Either reuse `--read` or add a `--write` variant; decide with the `bootcamp-deck` skill and stay consistent with the legend.
   - **`curriculum` §6 tree** (~lines 745-790) and the sentence at line 778.
   - **`defining-mvp/SKILL.md`** — the "never read it" rule (§4.5).
6. **Name it on the 8.1 slide** (§5) — both days. The Day-1 instance is where the trainee learns it exists.
7. **Windows-concrete, per A.6.4/A.6.5:** say how to open it (double-click → it opens in Notepad). Do not assume the trainee knows.

### 4.7 `PRODUCT.md`

- Lines 31-34 — rewrite the «الغايات: 1. 2. 3.» placeholder per §2. No count, no term as a heading.
- **Do not add a §1.0.1.** The Day-1 notes live in `notebook.txt` (§4.6). `PRODUCT.md` keeps holding only settled decisions.
- Leave §1.0 exactly as it is — frozen by `CLAUDE.md` أ.2.1.

### 4.8 `PROJECT_REPORT.md` — apply the fix **and** flag the history

Line 42, objective (3): `"give admins easy bulk availability management"` — admin-only, contradicting the shipped system (providers self-manage and bulk-generate; `CLAUDE.md` §B.1) and contradicting the trainer's own correction (`curriculum:1225`).

**Do both:**
1. **Correct the line** so it reflects what was actually built: bulk availability management for **providers (their own) and admins (any provider)**.
2. **Add a short note** — a footnote or a bracketed line adjacent to it — recording that the original text said "admins" only, that this was the pre-correction wording, and that the correction is documented in the trainer's own dialogue. The report is a graded historical artifact; the record of the change is part of its value, and the curriculum's §8 trainer example depends on that exact correction landing.

---

## 5. The canonical 8.1 slide — one design, shown on both days

Per the decision: **do not invent a new Day-2 design.** One slide design, two instances, the second completing the first.

### 5.1 The questions — content

Four questions, **each on its own line with its own breathing room**. Do **not** compress two questions onto one line — that is exactly the current failure at `day-01.html:3875` («ايش المشكلة اللي يحلّها مشروعك؟ ولمين؟ وايش اللي يخلّيه مفيد؟»), where three questions are crushed into one sentence and the third is too vague to answer.

**Each question gets a short second line explaining what it is really asking** — a question alone is not always self-evident to someone who has never done this. Keep that gloss to one line (A.6.4: what it is, what it does, stop).

1. **«مين الشخص اللي يعاني من هذي المشكلة اليوم؟ وكيف يتصرّف حاليًا بدون مشروعك؟»**
   *Gloss:* name one real person and what they do today instead — the workaround is the problem.
2. **«لو اشتغل مشروعك عدل، ايش اللي بيتغيّر في يوم هذا الشخص؟»**
   *Gloss:* this is the outcome question. It is the one that matters most, and it never says the word غاية.
3. **«ايش الشي اللي لو ما سوّاه مشروعك، ما صار له معنى؟»**
   *Gloss:* the core. Everything else is negotiable.
4. **«ايش اللي تتخيّله في مشروعك؟ صفحات، شاشات، أي شي جاك في بالك — اكتبه.»**
   *Gloss:* yes, really — screens are welcome here.

> **Question 4 is not optional and is not a courtesy.** It explicitly invites what `curriculum:1185` currently forbids, and it is what the trainer actually did. Dropping it re-opens the trap: a trainee who thinks in screens will believe they are doing it wrong. Keep it, and keep its gloss friendly.

Sources: `curriculum:1182-1185` and `defining-mvp/SKILL.md:31-33`. **Expand them; do not paste them.** The skill's phrasing is written for Claude, not for a slide — rewrite in the deck's spoken register (A.6.3).

### 5.2 Day-1 instance — replaces slide 48 (banner 48, lines 3860-3896)

- Keep the framing **optional / no fixed time** — «ما لها وقت محدّد… وتكمّلها بكرة». That matches `curriculum:214` and the Day-1 schedule, and it is why everyone still sees this content on Day 2.
- **Body = the four questions** (§5.1), replacing the two thin cards currently there.
- **Keep both existing messages**, folded in as short lines rather than full cards:
  - «بلا صيغة رسمية — كلام عادي زي ما يجي» (3875-3876)
  - «واللي ما أنت متأكّد منه، قُله» (3880-3883) — this one is genuinely valuable and the trainer's own transcript models it («لا أعرف ما أفضل تجربة استخدام»).
- **Name `notebook.txt`** and say how to open it (§4.6).
- Slide count unchanged.

### 5.3 Day-2 instance — the new slide after banner 6

**Same frame, same questions, same layout.** The trainee must recognize it instantly as the slide they saw yesterday. Changes:

1. **Status line flips** — «ابدأ» → «أكمل». One line, visibly the only difference in the top half.
2. **Adds the hand-off**, which Day 1 could not carry because the trainee had no notes yet:
   - The **ready-made prompt** to paste, per §2 vocabulary. Base it on `curriculum:1247`, stripped of the objectives count. Note the equivalent prompt already exists on slide 18 (line 998) — **keep both**; `bootcamp-mvp-process.md` §2 mandates this redundancy and explicitly says not to "clean it up".
   - **What comes back**, in one line: Claude returns a problem, a goal, and the outcomes — and then features are derived from the same text.
   - **Expect a correction round.** One line. Same lesson as the flow's back-arrow and as slide 12.
3. **Slide count: +1 on Day 2.** This is the sanctioned addition.

---

## 6. The three systemic items — all must be solved

### 6.1 «صياغة مقترحة» and «راجع نتيجتك» coverage across Days 1 and 2

> ⚠ **Correction to the first-pass analysis:** these are **not** missing wholesale. The deck consolidates them into two per-day structural slides — «دورك الآن» and «مراجعة اليوم» — rather than repeating them per task. That architecture is fine. The gaps are specific.

**Audit result:**

| Slide | Role | State |
|---|---|---|
| `day-01` banner 45 — دورك الآن | the «نفّذها أنت» slide | ✅ task tree — ❌ **no ready-made prompt card at all**, even though 14.1 has one (`curriculum:2405`) |
| `day-01` banner 47 — مراجعة اليوم | the «راجع نتيجتك» slide | ✅ 3 cards (app runs · repo has code+docs · secrets not pushed) — appropriate for Day 1 |
| `day-01` banner 48 — 8.1 | the task slide | ❌ no prompt, no review, no questions — rebuilt by §5.2 |
| `day-02` banner 18 — دورك الآن | the «نفّذها أنت» slide | ✅ task tree **and** two prompt cards covering 8.1, 8.2, 9.1, 9.2 (lines 995-1011) |
| `day-02` banner 20 — مراجعة اليوم | the «راجع نتيجتك» slide | ⚠ 3 cards — scope ✅, roles ✅, pushed ✅ — **nothing for 8.1's own output** |

**Required:**
1. **Add a ready-made prompt card to `day-01` slide 45**, matching Day 2's slide 18 pattern. Day 1's real prompt-worthy task is 14.1 — source `curriculum:2405`. Right now the two days' equivalent slides are structurally inconsistent, and Day 1 is the one that teaches the trainee what the deck's conventions *are*.
2. **Add 8.1 output review to `day-02` slide 20** — inside the existing three-card grid (§4.2).
3. **Record the convention** where future days will be built from: «دورك الآن» carries the prompts; «مراجعة اليوم» carries the review. Put it in `DECK_BRIEF.md` (the deck's authoring brief — the `bootcamp-deck` skill owns it) so Days 3–10 inherit it instead of re-deciding. **This is the durable fix**; items 1–2 are the backlog.
4. **Do not repeat prompts per-task on every content slide.** The consolidated architecture is correct and A.6.2 forbids the sprawl.

### 6.2 The wrong granularity, wherever it appears

The error is not confined to slide 28. **Traced occurrences:**

| Location | Text | Problem |
|---|---|---|
| `day-01.html:2088-2090` | «مو شاشة ولا زرّ… تجي بعدين في النطاق» | Deleted by §4.1 |
| `curriculum:1185` | «ولا تكتب شاشة أو زرًّا — فتلك خصائص مكانها النطاق» | Deleted by §4.4 |
| **`defining-mvp/SKILL.md:71`** | «والخاصية شيء يُبنى ويُقاس بأنه بُني (**«شاشة إضافة منتج»**)» | **The worst one.** It teaches *Claude* that a feature is screen-sized |
| **`defining-users/SKILL.md:29`** | «إن كتب المتدرّب احتياجات على هيئة **خصائص** («**شاشة إضافة**») أعِدها إلى صيغة حاجة… الحاجة تصمد حين يتغيّر التصميم؛ **الخاصية لا**» | Same wrong level, and it goes further — it asserts a feature is design-level and perishable |

**The proof that this is wrong**, using the curriculum's own generic example — the inventory app, the same one in both places:

- `defining-mvp:71` calls **«شاشة إضافة منتج»** a **خاصية** (§8).
- `curriculum:1928` calls **«نافذة إضافة/تعديل منتج»** a **شاشة**, and §12 is where the trainee inventories screens — «**أنت** تجرد الشاشات» (`:2128`), a task explicitly assigned to them at `:1921`.

So the same artifact is a §8 feature and a §12 screen. If a trainee's 3–5 "features" are really 3–5 screens, §10 has nothing left to write requirements about and §12 has nothing left to inventory.

**Required:**
1. Delete `defining-mvp:71` (already in §4.5).
2. **Fix `defining-users/SKILL.md:29`** — replace «شاشة إضافة» with a real feature-level example, and drop the claim that a خاصية is design-level. A feature survives a redesign; a *screen* does not. The sentence currently has it backwards.
3. **Add one calibration line to `defining-mvp/SKILL.md`** giving Claude the right size, anchored to this project's real scope (`curriculum:1281`): a خاصية is «لوحة تحكم مشتركة» or «رحلة حجز للعميل» — journey-sized, not screen-sized, and never button-sized. Buttons appear first in an acceptance criterion (`writing-requirements:68`).
4. **Check `designing-screens/SKILL.md`** for the reciprocal error — whether it treats screens as if they were the scope units. The analysis session did not read it. Read it and fix if present; report if clean.
5. **Grep for stragglers:** `grep -rn "شاشة\|زرّ\|زر " project-package/.claude/skills/ project-package/bootcamp_roadmap_and_curriculum.md` and check every §8/§9/§10 hit against the size rule above.

### 6.3 Who decides the features — one contradiction, four sources

| Source | Says |
|---|---|
| `curriculum:1267` (8.2 step 1) | «**حدّد الخصائص الأساسية** التي ستُشحن فعلًا، واطلب من Claude صياغتها» → **trainee decides**, Claude phrases |
| `day-02.html:1020` (slide 18 sub-task) | «**اشتقّ منها** 3–5 خصائص» → **trainee derives** |
| `defining-mvp/SKILL.md:50` | «**اشتقّ** «داخل النطاق» من التعريف — لا تجمعه من جديد… اقرأ وصف المتدرّب الحرّ واستخرج منه» → **Claude derives** |
| `curriculum:1275` + `day-02.html` slide 13 | «وصفه الحرّ للصفحات في 8.1 هو نفسه اللي استُخرجت منه قائمة «داخل النطاق»» → **Claude derived, historically** |

**The resolution — make all four say this:** *Claude derives and presents the candidate features; the trainee **decides** — what stays in, what is explicitly out, what is deferred, and whether the list is honestly within 3–5.* Deciding is real work and it is the trainee's. Extracting is not their job and they are not equipped for it.

Fix `curriculum:1267` and `day-02.html:1020`. Leave `defining-mvp:50` and slide 13 — they are already right.

### 6.4 Answering the user's open question: one pass or two?

The user asked for neutral research before committing. **It was done. Result: one trainee input pass, internally staged, with iteration loops.** Not two independent brain-dumps.

- **Double Diamond** separates problem space from solution space precisely so teams do not "solve the wrong problem with great thoroughness" — ✅ keep 8.1 and 8.2 as *distinct stages*.
- **Agile Inception Deck** — "Why are we here" (#1) and the "NOT list" (#4) are distinct exercises inside **one** 1–2 day workshop — ✅ distinct exercises, one session.
- **Impact Mapping** (Goal → Actors → Impacts → Deliverables — structurally identical to problem → goal → outcomes → features) runs successfully **both** as a single 60-minute session and split across two — ⚖️ genuinely either.
- **MVP scoping workshops for non-technical founders** — "before you start thinking about features, clearly define the problem", then features are *mapped back* to objectives in the **same** structured session — ✅ one session, staged.
- **Requirements-elicitation research** is the decisive one for this audience: iterative multi-session beats single-pass **specifically for novice stakeholders**, because the binding constraint is articulation, not knowledge — and *"react to these possibilities"* lowers cognitive load far more than *"describe what you want."*

**Therefore the shape is: one dump, two review gates.**

| Stage | Trainee | Claude |
|---|---|---|
| 8.1 | answers the four questions in their own words | drafts problem · goal · outcomes |
| ⟲ | **reacts and corrects** (1–2 rounds) | applies |
| 8.2 | **decides**: in / out / later, and the 3–5 trim | derives candidate features **from the same notes** |
| ⟲ | **reacts and corrects** | applies |

The trainee writes **once** and reviews **twice**. This matches the trainer's real history exactly, matches Day-2 slide 13's own claim, keeps the Double Diamond separation, and removes the second writing task the current deck implies. **It is also why the flow graphic's back-arrows are load-bearing** — the reviews are where the trainee's real contribution happens, and the current deck never shows them.

Sources: [Double Diamond — UXPin](https://www.uxpin.com/studio/blog/double-diamond-design-process/) · [Agile Inception Deck — O'Reilly, *The Agile Samurai*](https://www.oreilly.com/library/view/the-agile-samurai/9781680500066/f_0104.html) · [Impact Mapping workshop — Mark Dalgarno](https://markdalgarno.medium.com/how-to-run-an-impact-mapping-workshop-c76b484bec23) · [Impact Mapping — Agile Pain Relief](https://agilepainrelief.com/blog/to-get-bang-for-your-buck-try-impact-mapping/) · [Scoping workshops for non-technical founders — VeryCreatives](https://verycreatives.com/blog/what-is-a-scoping-workshop) · [MVP scoping — Sigma Infosolutions](https://www.sigmainfo.net/blog/how-to-scope-an-mvp-what-to-include-what-to-cut-and-why/) · [Requirements Elicitation survey (PDF)](https://web.eecs.umich.edu/~weimerw/2025-481F/readings/requirements.pdf) · [Stakeholder requirements expression with LLM revisions (arXiv)](https://arxiv.org/pdf/2601.16699)

---

## 7. Acceptance checklist

Do not report done until every line passes.

**Vocabulary**
- [ ] `grep -rn "3–5 غاي\|3 إلى 5 غاي\|٣–٥ غاي" project-package/` → **zero hits**
- [ ] Every surviving «غاي*» sits inside a question or mid-sentence — never a title, card heading, column header, checkbox label, or counted list
- [ ] No غاية-vs-خاصية comparison survives in any file, in any form
- [ ] Every «3–5» in the package refers to **خصائص**
- [ ] No «الأهداف» plural introduced as a synonym for outcomes (هدف/أهداف collision avoided)
- [ ] `grep -rn "مجالات" project-package/.claude/` → **zero hits**

**Slides**
- [ ] `bootcamp-deck` skill was invoked for **every** slide touch
- [ ] Day-1 slide count unchanged (49). Day-2 = 22 (was 21, **+1** for the 8.1 slide)
- [ ] No `deck-foot__num` value was hand-edited
- [ ] The flow graphic is **byte-identical** between Day-1 slide 28 and Day-2 slide 5 except the lead line and title
- [ ] Both back-arrows render correctly in RTL and are labelled in plain Arabic
- [ ] The Day-1 and Day-2 8.1 slides are visually the same slide; only the status line and the hand-off block differ
- [ ] Each of the four questions is on its own line with its own one-line gloss — **no two questions share a line**
- [ ] The overflow guard passes on every touched slide, both days
- [ ] Every touched slide reads in singular second person; no «نحن» that includes Claude

**Consistency**
- [ ] Objective (3) says the same thing in `PROJECT_REPORT.md`, `curriculum:1212`, and `day-01` slide 28
- [ ] `curriculum:1267` and `day-02.html:1020` now say Claude derives / the trainee decides
- [ ] `curriculum:1185`'s screen prohibition is gone and replaced by an invitation
- [ ] `defining-users/SKILL.md:29` no longer calls a screen a خاصية
- [ ] `designing-screens/SKILL.md` checked — fixed or reported clean
- [ ] `notebook.txt` exists, is git-ignored, is seeded with the questions, and is registered in slide 16, the curriculum §6 tree, and `defining-mvp/SKILL.md`
- [ ] §8 now has a generic non-booking example, using the inventory app, matching §§9–13
- [ ] `DECK_BRIEF.md` records the prompt/review slide convention for Days 3–10

**Reporting**
- [ ] Report back in two sections per `bootcamp-mvp-process.md` §5.1 — «لك أنت» first, then technical detail
- [ ] List every file touched with its path
- [ ] State explicitly anything you could not do and why

---

## 8. What NOT to do

- ❌ Do **not** re-open any decision in Part III.
- ❌ Do **not** hand-edit `deck-foot__num`, or "fix" the stale numbers in `day-01.html`. `deck.js` owns them.
- ❌ Do **not** add slides beyond the single sanctioned Day-2 addition. If content will not fit, cut words (A.6.2).
- ❌ Do **not** rebuild Day-2 slides 11, 12, 13. They are already correct.
- ❌ Do **not** "deduplicate" the ready-made prompts between the skill and the trainee-facing slides — `bootcamp-mvp-process.md` §2 mandates that redundancy.
- ❌ Do **not** replace the deleted taxonomy with a gentler taxonomy. The instruction is *remove*, not *soften*.
- ❌ Do **not** write a `PRODUCT.md §1.0.1`. That idea was superseded by `notebook.txt`.
- ❌ Do **not** touch `PRODUCT.md §1.0` — frozen by `CLAUDE.md` أ.2.1.
- ❌ Do **not** reference the curriculum file, `PRODUCT.md`, or any internal doc **by name** inside trainee-facing slides (`CLAUDE.md` §A.5). `notebook.txt` is the deliberate exception — the trainee writes in it.
- ❌ Do **not** touch files outside §4.

---

# END OF PART I — THE REFACTORING PROMPT

---
---

# PART II — THE FULL ANALYSIS

> This is the evidence behind Part I. It is the original read-only audit, **corrected** where verification proved it wrong.

## 0. What was read

| File | Range |
|---|---|
| `bootcamp_roadmap_and_curriculum.md` | 135–273, 1136–1325, plus targeted greps across all 3100+ lines |
| `.claude/skills/defining-mvp/SKILL.md` | whole |
| `.claude/skills/writing-requirements/SKILL.md` | whole |
| `.claude/skills/defining-users/SKILL.md` | line 29 via grep |
| `PROJECT_REPORT.md` | 27–43, plus a grep for "BookIt" |
| `PRODUCT.md` | whole |
| `slides/day-01.html` | banners 6, 7, 12, 16, 27, 28, 45, 47, 48 |
| `slides/day-02.html` | banners 2–7, 10–13, 18, 20 |
| `slides/assets/deck.js`, `deck.css` | numbering + `.flow` |
| `notebook.txt`, `.gitignore` | pattern + ignore status |

## 1. Root cause

The course's method — trainee dumps notes, Claude structures them — is stated in `CLAUDE.md` ب, `bootcamp-mvp-process.md` §7, `defining-mvp` §0, `PRODUCT.md` header, Day-1 slide 12, and Day-1 slide 48 itself.

Task 8.1's slides do the opposite. Before the trainee writes, the deck teaches a classification system and a derivation order — both Claude-side machinery. This is a **wrong-audience problem**, not a wording problem: internal machinery leaked onto trainee-facing slides.

## 2. Findings

### A. The teaching-slide hole *(corrected)*

8.1 spans both days (`curriculum:1168`, `:1178`, `:214`, `:256`). Day 2 gives it a 50-minute working block and has **no teaching slide** for it — the concept agenda (`day-02.html:77-82`) has a 10-minute row for 8.2's steps and none for 8.1.

> **Correction:** the first pass claimed Day 2 had "zero slides for 8.1". Wrong. Day 2 has slide 11 (الوصف الحرّ — demo), slide 12 (جولة التصويب — demo), and 8.1 prompts on slide 18. The gap is the *teaching* slide only — the analogue of slide 7, which 8.2 has.

### B. The taxonomy is over-taught and self-defeating

Taught/policed five times: `day-01.html:2061-2076`, `:2088-2090`, all of `day-02.html:246-289`, `curriculum:1185`, `defining-mvp:71`.

Two of the four flagship objectives (`day-01.html:2083-2086`) fail the rule printed above them — «بخطوة وحدة» is a mechanism, «إيميل تأكيد وفيه رابط» is an artifact. The boundary is genuinely fuzzy. Also `curriculum:1212`'s version of objective (3) uses «سهلة» — the word banned at `:1185`.

### C. The slide-28 note is wrong three ways

`day-01.html:2088-2090`. (1) Introduces «النطاق» a day before it is defined. (2) Uses «النطاق» to mean «خاصية», contradicting `curriculum:1156` and `day-02.html:346`. (3) "Screen or button" is requirement/acceptance-criteria granularity — `writing-requirements:134`, `:68`; real features look like `curriculum:1281`.

**Traceable origin:** `curriculum:183`'s TOC gloss «الفرق بين الغايات والنطاق» already carries the wrong pairing.

### D. «objectives first, then features» never happened

`curriculum:1190` (one long free command) · `:1198-1202` (pages and screens) · `:1212` (Claude produced objectives) · `:1275` (the same text produced the scope). One dump, two outputs.

`curriculum:1185` therefore forbids exactly what the one documented correct example does — while **Day-2 slide 11 step ٢ already teaches the right thing**: «صفحات ومواقف، مو صياغة رسمية».

### E. The questions never reach the trainee

They exist at `curriculum:1182-1185` and `defining-mvp:31-33`. The skill's second question — «لو نجح منتجك تمامًا، ما الذي سيتغيّر في يوم هذا الشخص؟» — is an outcome-generating question that never says the word غاية. **The skill already proves the thesis; the deck shipped the term instead of the question.**

What the trainee gets is `day-01.html:3875` — three questions crushed into one line, the third too vague to answer.

### F. Prompt and review coverage *(corrected)*

> **Correction:** the first pass claimed the deck had no ready-made prompt for 8.1 and no iteration lesson. Both wrong. `day-02.html:995-1011` (slide 18) carries prompts for 8.1, 8.2, 9.1, 9.2. `day-02.html` slide 12 is titled «الجولة الأولى نادرًا ما تكون نهائية» and its step ٣ says «توقّع جولة أو جولتين — هذا طبيعي ومطلوب».

The deck consolidates «نفّذها أنت» into «دورك الآن» and «راجع نتيجتك» into «مراجعة اليوم», once per day. That architecture is sound. Real gaps: Day-1 slide 45 has **no prompt card at all**; Day-2 slide 20 has **no 8.1 output review**. Full audit in Part I §6.1.

### G. Nowhere for the Day-1 notes *(resolved differently than proposed)*

Slide 48 says "gather your notes" and never says where. `PRODUCT.md` §1.0 is frozen; §1.1 is Day 2. The first pass proposed a `PRODUCT.md §1.0.1`. **The user chose `notebook.txt` instead** — see Part III D5.

### H. Cross-file inconsistencies

- **H1** — `defining-mvp` uses «مجالات» ×3 (`:3`, `:50`, `:60`); `curriculum:1158` bans the word outright.
- **H2** — Objective (3) in three versions: `PROJECT_REPORT.md:42` (admins) · `curriculum:1212` (المشرف) · `curriculum:1225` correction, applied `:1230` (providers too) · `day-01.html:2085` (مقدّم الخدمة). The curriculum prints the pre-correction list, shows the correction, never restates.
- **H3** — `curriculum:183` wrong pairing.
- **H4** — `:1156`/`:1162` say derived; `:1319` says «حدّها المستقلّ». Both cannot hold. The 3–5/3–5 symmetry implies 1:1, refuted by this project: **4 objectives → 6 features** (`:1212` vs `:1281`).
- **H5** — «أول مهمّة في الدورة» (`:1176`, `defining-mvp:16`) is false; 7.10 and 14.1 precede it (`:186-205`).
- **H6** — `day-02.html:254` «مرّينا عليهما أمس سريع» — Day 1 gave them a full slide.
- **H7** — `day-01.html:2095`: «نحولها» (A.6.7.1 risk), «والي» typo, «ل 3» spacing.
- **H8** — ~~slide-number drift~~ **RETRACTED.** `deck.js:765-766` auto-assigns every footer number from document order. Day-1's hardcoded values are stale (duplicates 29/38/39, gaps 34/36/37/47) but **never rendered**. Not a bug. Identify slides by banner index instead.

### I. Granularity error beyond slide 28 *(new)*

`defining-mvp:71` calls «شاشة إضافة منتج» a خاصية. `defining-users:29` calls «شاشة إضافة» a خاصية and claims features are design-level and perishable. But `curriculum:1928` calls the same artifact a **شاشة** and assigns screens to §12, owned by the trainee (`:1921`, `:2128`). Same inventory-app example, two incompatible levels. Full detail in Part I §6.2.

### J. Who decides the features *(new)*

Four sources, two answers. `curriculum:1267` and `day-02.html:1020` say the trainee extracts; `defining-mvp:50` and `curriculum:1275`/slide 13 say Claude derives. Full detail in Part I §6.3.

### K. Section 8 has no generic example *(new)*

Sections 9, 10, 11, 12, 13 each carry a «مثال عام (ليس مشروع الدورة)» on the same inventory app (`:1356`, `:1531`, `:1746`, `:1928`, `:2160`). §8 jumps straight to the booking project. Inconsistent, and a missed chance at a concrete example (A.6.5).

## 3. Verification log

| Claim | Method | Result |
|---|---|---|
| Footer numbers drift | `grep` banners + footers, both decks; read `deck.js` | **Retracted** — auto-numbered at runtime, `deck.js:765-766` |
| A flow component exists | `grep` deck CSS | `.flow`, `.flow--row` at `deck.css:1676-1707`; **no arrow/loop** |
| Prompts missing from deck | `grep` both decks | **Retracted** — present on `day-02` slide 18 |
| Iteration lesson missing | read `day-02` slide 12 | **Retracted** — it is that slide's entire subject |
| `notebook.txt` pattern | `head`, `git check-ignore`, `.gitignore` | Plain text, git-ignored, "do not analyze" header |
| `project-package/.gitignore` | `ls`/`test -f` | Does not exist |
| "BookIt" | `grep -rn` | Only `PROJECT_REPORT.md:276,284` — the Claude Design alias |
| Generic examples per section | `grep` | §§9–13 yes, §8 no |
| One pass vs two | 4 web searches | See Part I §6.4 |

---
---

# PART III — DECISION RECORD

## What was asked, and what the user answered

### D1 — How much of the غاية/خاصية taxonomy survives?
**Offered:** (a) delete the comparison, define each term once at point of use · (b) keep a definition pair but move it after writing · (c) status quo.

**User's answer — chosen (a), and sharpened it into something stronger, verbatim intent:**
> There should originally be **no taxonomy at all**. Use the market-standard term **خاصية** as the translation of *feature / functionality* — the thing that later gets requirements listed for it. The word **غاية** may be used only inside a question or mid-sentence, as a term that eases the process of extracting a خاصية by giving the trainee an easier way to think. **Never use غاية/غايات concatenated with the 3–5 limit** — that limit must always refer to خاصية/خصائص, following market standards, for consistency. If a framing phrase is needed: *"identify your objectives, which convert into the features of the project"* — i.e. the correct entrance is the business perspective: what problem do you want to solve → which produces objectives serving the GOAL of solving it.

**Final:** no taxonomy anywhere. خاصية is the countable unit and the only thing the 3–5 limit binds to. غاية is demoted to an in-question aid. Codified as **the Vocabulary Law, Part I §2** — with one addition from analysis: avoid introducing «الأهداف» plural, to prevent a fresh هدف/أهداف collision.

### D2 — What replaces the "why objectives then features" explanation?
**Offered:** (a) a flow graphic of what happens *to the notes* · (b) prose on why outcomes are the easier harvest · (c) nothing.

**User's answer — chose (a), with a research condition and a required addition:**
> Research what similar existing courses do at this point — one pass or two — and be neutral; I need to be sure. Regardless of the outcome, **introduce the concept of iterations between trainee and Claude: the flow chart must include a back-arrow loop** saying you may need to give feedback once or twice before you get what you are looking for.

**Research delivered** — Part I §6.4, eight sources. **Result: one trainee input pass, internally staged, with iteration loops.** Double Diamond and the Inception Deck support keeping 8.1 and 8.2 as *distinct stages*; MVP-scoping practice and Impact Mapping run them in *one session*; and elicitation research is decisive for this audience — iterative rounds beat single-pass **specifically for novice stakeholders**, because reacting to a draft costs far less than composing one.

**Final:** the flow graphic ships (Part I §4.3), **one dump + two review gates**, with **two mandatory back-arrows**. The user's instinct was right, and it is now evidence-backed rather than assumed.

### D3 — How does 8.1 appear on Day 2?
**Offered:** (a) same slide twice, Day-2 instance carries the completion · (b) two-beat, both days · (c) byte-identical repeat.

**User's answer:** **(a).**

**Final:** one canonical design, two instances. Day-1 = optional head start with the questions. Day-2 = same frame, status line flips, hand-off added. **Day 2 +1 slide** — the only sanctioned addition. Part I §5.

### D4 — What do the questions say?
**Offered:** (a) four questions · (b) three · (c) status quo.

**User's answer — chose (a), with a delivery constraint:**
> Don't just throw the questions gathered from the curriculum and the `defining-mvp` skill into the slides — **explain them a bit more and divide them. Don't compact questions, especially more than one on the same line. Let each question take its place for easier understanding.**

**Final:** four questions, each on its own line, each with a one-line gloss, rewritten in the deck's spoken register rather than pasted from the source files. Question 4 explicitly invites screens. Part I §5.1.

### D5 — Where do the Day-1 notes go?
**Offered:** (a) new `PRODUCT.md §1.0.1` · (b) chat only · (c) widen §1.0.

**User's answer — rejected all three and supplied a better one, verbatim intent:**
> None of those — these are just random notes that might not be complete, so no need to put them in `PRODUCT.md`. I was thinking of a **`notebook.txt`** file, like the one in the root of this project, where the trainee writes their prompts first through native Notepad on Windows; then when the notes or the prompt are finished, they paste them into the Claude Code chat on Day 2 — unless they managed to finish 8.1 completely on Day 1.

**Final:** `project-package/notebook.txt`, git-ignored via a new `project-package/.gitignore`, seeded with the questions, with a "Claude must not read this" header. **The `PRODUCT.md §1.0.1` proposal is withdrawn.** Part I §4.6.

*Analysis note on why this is the better call:* `.txt` opening in Notepad removes every formatting affordance, which is the physical form of Day-1 slide 12's rule — write first, organize later. A `.md` section inside a structured document would have re-imposed exactly the pressure this refactor removes.

### D6 — Does Day 2 keep a slide in slide-5's position?
**Offered:** (a) replace with the flow slide · (b) delete outright · (c) keep as-is.

**User's answer:** **(a).** Net delta 0 there; the +1 comes from the new 8.1 slide.

### §5 table — non-slide consistency changes
**User's answer:** **all of it.** Part I §4.4–§4.7.

### `PROJECT_REPORT.md:42`
**User's answer:** > Add the fix, then notes of the historical record problem.

**Final:** correct the line **and** annotate that the original said "admins" only, pre-correction. Part I §4.8.

### §6 — "Beyond this task"
**User's answer:** > I need all to be solved.

Plus three specific instructions:
1. The D2 iteration loop **partially solves** the «راجع نتيجتك» item — *"tell in the generated prompt to imply this logic in the places it needs to be."* → Part I §4.3 (the back-arrows), §4.2 (the Day-2 slide 20 review card), §5.3 (the "expect a correction round" line).
2. *"Analyze all the slides of day 1 and 2 to precisely flag where it lacks the prepared prompt صياغة مقترحة and راجع نتيجتك."* → **Done.** Full audit table, Part I §6.1. Two of the first pass's claims were **retracted** as a result.
3. *"Look for where the problems of point 2 and 3 exist in the slides, and analyze the files you think might contain those problems since we didn't generate yet slides for further days corresponding to sections 10 and 12."* → **Done.** Point 2 traced to `defining-mvp:71` and `defining-users:29`, proven against `curriculum:1928`/`:2128` with the same inventory example (Part I §6.2); `designing-screens/SKILL.md` flagged as unread and assigned. Point 3 traced across four sources (Part I §6.3).

## Standing instructions carried over from the first request

- **Line numbers mean file lines**, not rendered positions.
- The receiving session **has the full directory and its logic in context** — it does not need re-orientation.
- **`graphify` is available** to locate things cheaply instead of sweeping the directory.
- The prompt must say **what must be updated *and why*** — every instruction in Part I carries its rationale or a pointer to the evidence in Part II.
- The audit itself was **strictly read-only**; nothing was modified. The receiving session is the one authorized to change files.
