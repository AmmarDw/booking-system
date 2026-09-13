# ARCHIVED — Day-1 deck foundations plan (2026-09-08)

> **⚠ UNVETTED DUMP.** This is the previous plan file, preserved verbatim before it was overwritten.
> It is kept because parts of it are the only written record of *why* the deck is built the way it
> is (brand assets, the design-system-not-slides decision, the no-scroll rule, the file-per-day
> architecture). Most of it has since shipped, and some of it was later **corrected**:
>
> - **D.4 step 5** («Connect Plugins» costs tokens / duplicates our integrations) is **wrong** — those
>   plugin sets belong to Antigravity's own agents (Gemini) and live in
>   `~/.gemini/antigravity/mcp_config.json`, a registry Claude never reads. Corrected in the
>   `conversation_history.md` §D103 entry and on the deck.
> - Every «دليل» in here predates CLAUDE.md §A.6.7, which **bans** the word in trainee-facing text.
>   Say «المعسكر» / «القسم N» / «الحزمة».
> - «منتج» in here predates §A.6.7's «مشروع» rule.
> - Slide numbers and the ~34-slide estimate are stale; the built deck is larger.
>
> Read it for rationale, never as current instruction. Nothing here overrides `SKILL.md`.

---

# Plan — Day-1 deck foundations: Claude Design prompts, brand assets, and the Day-1 curriculum fixes

## Context

We are moving from the finished curriculum (§1–§17, 29 tasks) to the **first trainee-facing artefact**: the Day-1 deck. Two decisions were taken up front:

- **Claude Design produces the design system only.** I build the deck HTML in-repo from its tokens/components. Rationale: DesignSync moves *components*, not screens — 30+ content-dense Arabic slides that must track section numbers, durations and task IDs would drift across 30 share-link round-trips.
- **Both brands: ساج لاب leads, ساج التقنية endorses.**

Reviewing Day 1 for the deck also surfaced real curriculum gaps, which this plan fixes.

---

## A. Asset inventory (done — recorded here, to be written to `LOGO_Sag/ASSETS.md`)

I opened every image. There are **two distinct marks**, which is why the brand question mattered:

| Asset | What it actually is | Use in deck |
|---|---|---|
| `SAG_Lab_Logo_Transparent.png` (repo root) | **ساج لاب** — Arabic calligraphic wordmark only, navy, transparent | **Title slide hero mark** |
| `LOGO_Sag/SVG/Logo_Horizontal.svg` | Monogram + `SAG TECH` + `ساج التقنية`, side by side | **Footer endorsement on every slide** |
| `LOGO_Sag/SVG/Logo_Vertical.svg` | Monogram above `SAG TECH` + `ساج التقنية` | Closing slide |
| `LOGO_Sag/SVG/Logo_Full.svg` | Vertical lockup **+ legal name** `شركة سهر عبد العزيز الغلاييني` | ❌ **Not used** — the legal name is baked into this file and you've dropped it |
| `LOGO_Sag/SVG/LOGO_Sag Icon.svg` | Circular spiral-"S" monogram alone | Favicon, slide-corner watermark, section dividers |
| `LOGO_Sag/PNG/*.png` | Same four lockups, raster, transparent | Fallback if SVG inlining is awkward |
| `LOGO_Sag/JPG/Black/01,02,03` | Horizontal / vertical / full lockups **baked onto black** | Only on a pure-black slide — otherwise visible box |
| `LOGO_Sag/JPG/White/Icon,01,02,03` | Same **baked onto white** | Only on pure-white slides |
| `C:\Users\ammar\personal\photo.png` | Portrait headshot, glasses, beige check shirt, light curtain bg | Title slide, circular crop, ~180 px |

**Prefer the SVGs** — the deck is HTML, and the JPGs' baked backgrounds will show as rectangles on any tinted slide.

**Palette** (from your image + the addition): `#223A71` أزرق أساسي · `#142447` كحلي عميق · `#38B6D9` سماوي تقني · `#EEF2F8` أزرق ثلجي · `#FFFFFF` · `#333B48` رمادي داكن · **`#16C7B7`** (new accent).

---

## B. Answering the two questions you asked

### B.1 Which Claude Design template?

**Neither "Slides" nor a generic template — create it as a *Design System* project.** That project type is what `/design-sync` requires, and the type is fixed at creation and cannot be changed later. Among the templates you listed, **"Color + type pairing"** is the right seed *inside* that project — it produces exactly tokens + typography, which is what we need. "Blank" is the fallback.

**Do not pick "Slides."** Under the approach you chose, Claude Design never generates slides — it generates the *components* the slides are assembled from (including slide-frame layouts as components). Picking "Slides" would push it toward per-screen artboards we've decided not to round-trip.

### B.2 Overflow vs. scroll — my neutral read

**A presented slide must never scroll.** The presenter cannot scroll mid-sentence without breaking the room's attention, and a projector crops whatever is below the fold. So:

- Fixed **16:9, `100vh`** slide sections; navigation moves slide-to-slide (arrow keys / space / swipe), never scrolls within one.
- **Content budget per slide:** ≤ 7 bullets, ≤ ~90 Arabic words, ≤ 1 table of ≤ 8 rows. When content exceeds it, **split into `1/2`, `2/2` continuation slides** — do not shrink type.
- **One deliberate exception:** the `مرجع` appendix (the 29-task map, the §17 tools table). Those are *consulted*, not presented, so an inner scroll container is correct there.
- I will add a build-time overflow check that fails loudly if any slide's content exceeds its frame, so this can't silently regress.

### B.3 One deck across all 10 days, or one per day?

**You're right that it should be one continuous deck — and I'd build it as one *system* with a file per day, not one giant file.** Concretely:

```
deck/
├── index.html          ← hub: brand slides + jump to any day
├── assets/deck.css     ← the design system, built ONCE from Claude Design
├── assets/deck.js      ← navigation, progress, overflow guard — shared
├── media/              ← screenshots/GIFs referenced, never embedded
├── day-01.html         ← Day 1
└── day-02.html …       ← each day adds a file, reuses everything
```

To the presenter this **behaves as one deck**: identical look, a persistent day-nav in the corner, continuous slide numbering across the ten days, and cross-day links (Day 2 can point back at §5.1 as explained on Day 1).

**Why not literally one file:** the §7.10 media alone is ~14 captures, and days 2–10 will add more. Ten days is ~340 slides; as a single document that becomes slow to open on a projector laptop and — the real cost — **every edit risks the whole bootcamp's deck**. One file per day means a mistake on Day 7 cannot break Day 1 the morning you present it. The design system stays in exactly one place (`deck.css`), so there is **no drift risk** — that is the thing sharing a file would have protected, and sharing a stylesheet protects it just as well.

**What "extends itself" means in practice:** Day 1 establishes the components and the CSS. Day 2 is a new file that writes only its content — no new design work. That is the continuity you're after, and it gets cheaper each day.

If you'd still rather have a single `deck.html` with all ten days inside, say so — it's a small change to the build, and the brief and design system are identical either way.

---

## C. Deliverables — the prompts

**`deck/DESIGN_SYSTEM_PROMPT.md`** — one paste-ready Arabic+English prompt for Claude Design covering: the 7-colour palette with semantic roles; Arabic-first typography scale (display / section / body / caption) with an explicit Arabic typeface and Latin pairing; **RTL as a hard requirement, stated up front**; and the component list —

> slide frames (title · section divider · content · two-column · media-led · quote/callout · table · closing) · logo lockup zones · numbered step chips · the «القسم N» reference badge · media frame (screenshot/GIF/video with caption) · progress/day indicator · agenda row · skill card · file-tree block · timing pill.

It also carries the **fidelity rules from `designing-screens`**: state the components explicitly rather than "ready components", and **copy back any answers Claude Design's form asks you** so I know decisions I didn't put in the prompt.

**`deck/DECK_BRIEF.md`** — the Day-1 slide-by-slide outline (~34 slides) I will build from: per slide, its curriculum section reference, exact Arabic content, layout component, and media slot. Structure:

| # | الشرائح | مصدرها |
|---|---|---|
| 1 | الغلاف — البرنامج، المدرب، الشركة | your supplied lines + photo + both marks (see below) |
| 2 | فهرس المحتويات — العناوين الرئيسية فقط | §فهرس المحتويات |
| 3–4 | كيف تستخدم هذا الدليل | §1 |
| 5 | نبذة عن المعسكر | §2 |
| 6–7 | المهارات — بطاقات لا قائمة | §3 |
| 8–9 | حزمة المعسكر — ما تقرؤه أنت مقابل ما يقرؤه Claude | §4 |
| 10–11 | أسلوب اليوم التدريبي + الاستراحة | §5.1 |
| 12 | الأجندة — ماذا يحتوي القسم 6 (مختصر، بلا تكرار) | §6 |
| 13–19 | أساسيات Claude Code | §7.1–7.6 |
| 20–30 | تهيئة أدوات العمل — **شرائح بصرية** | §7.10 |
| 31–33 | أول تطبيق يعمل | المهمة 14.1 |
| 34 | ما الـMVP + واجب اختياري | §8 · المهمة 8.1 |

**Title slide (1) — exact content.** Your lines verbatim (برنامج تدريبي تطبيقي… · من الفكرة إلى منتج منشور · بناء مشاريع تقنية أولية (MVP) باستخدام Claude · رحلة تطبيقية متكاملة… · Claude + Claude Code · أسبوعان، من الأحد إلى الخميس · 40 ساعة تدريبية · 10 أيام تدريبية · مقدم من شركة ساج التقنية), plus:

- **المدرب:** **م. عمار محمد أنمار دويدري** — *Eng. Ammar Mohamed Anmar Dwidari* (Latin name inside a `dir="ltr"` span so it doesn't mirror), with the headshot in a circular crop. The **م.** / **Eng.** title is used every time the name appears, on any slide.
- **Attribution wording** — you were unsure how to phrase your role. Proposed: «**إعداد وتقديم:** م. عمار محمد أنمار دويدري» as the primary line, with a smaller «صمّم محتوى المعسكر ومنهجه بالكامل» beneath it. That claims authorship of the curriculum *and* delivery without reading as a CV line. Swap it if you prefer something plainer.
- **Marks:** ساج لاب wordmark as the hero; ساج التقنية horizontal lockup small, bottom corner. **No legal-entity line** — which also rules out `Logo_Full.svg`, since that name is baked into the artwork.

**`deck/MEDIA_SHOTLIST.md`** — the exact captures **you** need to record (I cannot screenshot installers): per shot — filename, type (screenshot/GIF/video), OS, what must be visible, and which slide consumes it. Roughly 14 shots across Claude Code install, Git, Antigravity download + onboarding, the Claude Code extension, context7 key, and Supabase project creation.

---

## D. Curriculum fixes (the review pass)

### D.1 Day 1 rebalance — and the trade-off I cannot hide

Six sections must be added to Day 1 (**فهرس · §2 · §3 · §4 · §5 · §6**, ~25 د) while `المهمة 8.1` loses its slot (**+11 د**) — but you also want *more* time for the setup tasks. **The day is fixed at 215 د** (240 − 25 break), so those three pulls cannot all be satisfied. Proposed shape:

| الجلسة | قبل | بعد | ماذا تغيّر |
|---|---|---|---|
| شرح المفاهيم | 45 | **62** | + كتلة التعريف 25 د · §1 من 8→5 · §8 المفهوم العام يبقى 6 |
| تطبيق مع المدرب | 62 | **62** | بلا تغيير |
| عمل المتدربين | 85 | **79** | 7.10 من 27→**30** (أكثر واقعية) · 14.1 من 45→39 · الحفظ 13→10 |
| مراجعة | 23 | **12** | 8.1 لم تعد مجدولة |

`المهمة 8.1` becomes: «**إن أنهيت ما سبق وبقي لديك وقت، ابدأ بجمع ملاحظاتك الحرّة عن فكرة منتجك** — والإكمال غدًا» with **no duration**.

⚠ **The honest cost:** trainee work drops **85 → 79 د**, and Day 1's شرح المفاهيم (**62 د**) breaks the §5.1 band of 40–50. I propose **saying so in §5.1** — that Day 1 is deliberately front-loaded because orientation happens once — rather than pretending it fits. If you would rather protect the 85 د of hands-on time, the lever is moving **§8 المفهوم العام (6 د) to Day 2**; tell me and I will.

### D.2 §4 — package tree

Add **`conversation_history.md`** and **`app/`** *inside* the `project-package/` tree (each marked «يُنشئه Claude»), and correct the current "outside the package" wording: the trainee opens Claude Code **inside `project-package/`**, so that folder *is* the project root. Also add the one line the section is missing — **download the folder, open Claude Code in its root, and come back here as the main reference.**

### D.3 §7.10 — Git is mandatory, on every OS

Your read is right, and the current text is wrong twice over: it presents Git as a **Windows-only recommendation**, when Day 1's `المهمة 14.1` creates the GitHub repo and makes the first commit. Rewrite as a required step for all three platforms:

- **Windows** — install Git for Windows (also gives Claude Code its Bash tool).
- **macOS** — Git is **not preinstalled as such**; the first `git --version` triggers the Xcode Command Line Tools prompt (or `xcode-select --install`). One click, but it must be stated.
- **Linux** — usually present; otherwise one package-manager line.

**Plus a gap nobody has hit yet:** `git config --global user.name` / `user.email` is **absent from the curriculum entirely**, and the Day-1 first commit will either fail or be attributed wrongly without it. Adding it as an explicit sub-step — which also ties to the `git-commit-attribution` rule.

### D.4 §7.10 — Antigravity onboarding (currently three bullets)

You are right that everything after the download is missing. Replacing with the real flow, verified against Google's docs and the current install guides:

1. Download the **Standalone** build for your OS from `antigravity.google/download`.
2. First launch → welcome screen.
3. **Sign in with a Google account** (a personal Gmail is required during the preview).
4. **Choose a theme** — System / Light / Dark (changeable later).
5. **«Connect Plugins» step** — offers ready-made skill + MCP sets (Android, Modern Web Guidance, Google Antigravity SDK, Science, Firebase, Chrome DevTools). ⚠ **Skip all of them.** We wire our own integrations in step 5 of §7.10 and `المهمة 14.2`; enabling the built-in Chrome DevTools set here duplicates ours and costs tokens on every message.
6. **File → Open Folder** → your `project-package/` root (not a parent folder).
7. Chrome must be installed for the browser-integration features.

*Sources:* [Antigravity Getting Started](https://antigravity.google/docs/getting-started) · [Google Codelabs](https://codelabs.developers.google.com/getting-started-agy-ide) · [install guide](https://www.antigravity-ide.com/blog/antigravity-install-guide.html)

### D.5 Visual-first slides for §7.10

Agreed, and it changes the design system: the media frame and the «خطوة + وسائط» split layout become **first-class components**, not afterthoughts. §7.10's slides are built media-led (image dominant, one instruction line), with the curriculum text as the fallback caption.

---

## E. Files

- **New:** `LOGO_Sag/ASSETS.md` · `deck/DESIGN_SYSTEM_PROMPT.md` · `deck/DECK_BRIEF.md` · `deck/MEDIA_SHOTLIST.md`
- **Edited:** `project-package/bootcamp_roadmap_and_curriculum.md` — §6.1 (Day-1 rebalance) · §5.1 (Day-1 outlier note) · §4 (tree + trainee instruction) · §7.10 (Git, Antigravity, media anchors)
- **Edited:** `conversation_history.md` — log entry
- **Not yet:** the deck HTML itself (`deck/index.html`, `deck/assets/*`, `deck/day-01.html`). It waits on the design system coming back from Claude Design — the prompts in this plan are what produce it.

---

## F. Verification

1. **Anchors** — baseline **298 links / 0 broken**; expect 0.
2. **Day budgets** — Day 1 must total exactly **215 د**; the other nine days must be **byte-identical** to now (regression guard — this edit must not touch them).
3. **Task map integrity** — `المهمة 8.1` still appears in §6's 29-row map with its day span intact, even though it no longer carries a Day-1 duration.
4. **§5.1 consistency** — if Day 1's شرح exceeds the stated band, the band note must acknowledge it; assert no silent contradiction.
5. **Asset paths** — every path in `ASSETS.md`, the prompts and the shot list must exist on disk (scripted existence check).
6. **Deck brief ↔ curriculum** — every «القسم N» reference in `DECK_BRIEF.md` must resolve to a real heading; every Day-1 item in §6.1 must appear in the brief, and vice versa.
7. **Package integrity** — §4 tree ↔ disk, both directions.

---

## G. Carried forward

After this: build the design system in Claude Design → `/design-sync` the components → build `deck/day-01.html`. Then days 2–10 reuse the same system. Still pending from earlier: your review notes on §8–§17, and the `drawio` skill's one deviation from your global copy.
