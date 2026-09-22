# Day 2 — deck brief

The slide-by-slide record of `project-package/slides/day-02.html`.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md` §2.2 (lines 217–275) plus
§8 (1136–1326) and §9 (1328–1482). If this brief and the curriculum disagree, the curriculum wins.

**21 slides.** Numbers below are the real positions in the built deck.

**Day 2 budget:** شرح المفاهيم 48 د · تطبيق مع المدرب 58 د · عمل المتدربين 82 د · مراجعة 27 د = **215 د**
(+ استراحة 25 د), matching the fixed per-day total at curriculum line 68.

**Media: none.** Day 2 needs no recordings — see "Showcase form" below. `deck/MEDIA_SHOTLIST.md` is
Day-1-only and gains nothing from this day.

---

## Showcase form — why there is no video

Day 2 is entirely thinking work: a definition, a scope split, a roles table, a list of external
dependencies. None of it is a screen doing something, so there is nothing to film. It is shown
instead with the **`chatlog`** component built for this day — the real BookIt conversation on one
side, timed-style index steps on the other, clicking a step scrolls and highlights its message.

Per `references/showcase-strategy.md`: BookIt fills «شرح المفاهيم» for days 2–10; darrisni carries
the live «تطبيق مباشر مع المدرب». BookIt's §8 and §9 material is **RICH and stack-independent** —
a problem statement and a roles table do not care that BookIt runs on Spring Boot.

---

## Slides

| # | Slide | Component | Source | Notes |
|---|---|---|---|---|
| 1 | الغلاف — اليوم الثاني | `sag-title` dark | §2.2 | Same brand opener as Day 1, retitled to the day. Facts name §8, §9, 215 د, four sessions |
| 2 | مهامّ اليوم: شرح المفاهيم (48 د) + تطبيق مع المدرب (58 د) | 2 × `.sess` | §2.2:225-251 | Task rows copied verbatim from the curriculum, each `data-ref`'d to the slide that delivers it |
| 3 | مهامّ اليوم: عملك (82 د) + مراجعة (27 د) | 2 × `.sess` | §2.2:253-273 | Keys `d2-mvp`, `d2-users`, `d2-push`, `d2-rev-*`. The two «حفظ ورفع» rows are **different tasks** with different keys — one closes the work session, one closes the day |
| 4 | أهداف اليوم | 3 cards | §2.2:221-223 | **Goals last in the block**, per A.6.8 |
| 5 | الغاية والخاصية | 2 cards + note | §8:1150-1162 | **Self-contained recap** — `data-ref` cannot cross day files, so Day 1's `mvp-scope` slide is unreachable from here and the distinction is restated. Carries the derivation rule: 3–5 غايات ← تُشتقّ منها 3–5 **خصائص** |
| 6 | القسم 8 — مهمّتان: «ليش» و«ايش» | 2 + 2 cards | §8:1164-1171 | Anchor `s8-tasks`. Includes the plan-mode reminder |
| 7 | النطاق ثلاث قوائم | 3 + 2 cards | §8:1267-1270, 1309-1314 | Anchor `s8-scope`. Amber card: «خارج النطاق» يطلع فاضي is the commonest error |
| 8 | مين أصحاب المصلحة؟ | 4 cards + `؟` | §9:1332-1345 | Anchor `s9-concept`. «الكيان» lives in the term window, not on the slide |
| 9 | القسم 9 — مهمّتان + مثال عام | 2 cards + 1 card | §9:1347-1363 | Anchor `s9-tasks`. The inventory-app example is **deliberately not BookIt** — a neutral example the trainee parses instantly |
| 10 | ▸ فاصل: تطبيق مع المدرب | `sag-quote` dark | — | First of three session breaks |
| 11 | 8.1 — يوصف بكلامه، و Claude يصوغ | **`chatlog`** | §8:1187-1216 | Anchor `demo-81`. Four messages, four steps. Step 2 highlights that the trainer wrote «لا أعرف ما أفضل تجربة استخدام» — saying what you are unsure of is the lesson |
| 12 | 8.1 — الجولة الأولى نادرًا ما تكون نهائية | **`chatlog`** | §8:1220-1234 | The correction round: the separate `Provider` entity is deleted in favour of one `User` with a `role` |
| 13 | 8.2 — النطاق انشتقّ، ما انكتب من جديد | 3 cards + amber | §8:1272-1296 | Anchor `demo-82`. Carries the honest note that the trainer landed on **six** features deliberately, and why the trainee must hold 3–5 |
| 14 | ثلاثة أدوار، لكل واحد احتياجات | 3 cards + note | §9:1380-1395 | Anchor `demo-91`. The representation decision is named as **Claude's**, not the trainee's |
| 15 | سؤال التداخل | 2 cards + note | §9:1414-1427 | The real failure: a provider could book his own slots. Fixed in **واجهة + خادم** — hiding the option alone is not enough |
| 16 | 9.2 — سؤال واحد غيّر بنية المشروع | **`chatlog`** | §9:1443-1460 | Anchor `demo-92`. The Google Meet host question → per-provider OAuth. Last message names the system itself as a stakeholder |
| 17 | ▸ فاصل: عملك على مشروعك | `sag-quote` dark | — | Carries the "ticking is your job" line |
| 18 | دورك الآن | 2 × `.sess` nested tasks + 2 prompt cards | §2.2:253-262 | Anchor `your-turn`. Parent keys match slides 2–3 so ticking either moves both. The two ready-to-paste prompt cards are the **deliberate redundancy** the package mandates — the same prompts live in the skills |
| 19 | ▸ فاصل: مراجعة وعرض التقدم | `sag-quote` dark | — | Third break |
| 20 | مخرَج اليوم — تحقّق من هذه الثلاثة | 3 cards + quote | §2.2:264-273 | Anchor `day-review` |
| 21 | غدًا — اليوم الثالث | `sag-closing` dark | §2.3 | §10 المتطلبات + §16 أول نشر |

---

## Decisions worth keeping

- **No cross-day deep links.** `resolveRef` searches only the current document, so slide 5 restates
  الغاية/الخاصية rather than pointing at Day 1. Every future day inherits this constraint.
- **Trainer-example discipline held.** Slides 11–16 are BookIt, product-only. The bootcamp
  brain-dump (`conversation_history.md:39-120`) was excluded — it is about building the course, not
  a product. No Spring Boot, monorepo or Maven detail appears anywhere.
- **«خصائص», never «مجالات».** The curriculum's own terminology box bans the synonym; three files
  still used it and were fixed in the same pass (curriculum line 256, `PRODUCT.md`,
  `defining-mvp` and `writing-requirements` skills).
- **Slide 18 was overfilled once.** The first build left ~40% dead space, the prompt cards fixed
  that but tripped the overflow guard by 2.8px; folding the checkbox-mechanics hint into the two
  column notes recovered a whole block plus its gap.
