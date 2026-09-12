# Claude Design — prompt #1: the design system

## How to use this file

1. In Claude Design, create a **new project of type `Design System`**.
   ⚠ The project type is **fixed at creation and cannot be changed later**, and `/design-sync` only
   pulls from a Design System project. If you create a normal project you will have to start over.
2. If the creation flow offers a starting template, pick **“Color + type pairing”** (fallback: **“Blank”**).
   **Do not pick “Slides”** — we are not generating slides here, only the components slides are built from.
3. Paste everything below the line into a **new chat** in that project.
4. ⚠ **If Claude Design asks you questions in a form, answer them — then copy your answers back to me.**
   I only know what I put in this prompt. Anything you decide in that form is invisible to me, and at
   build time I will assume it was noise and drop it. Paste your answers into our chat verbatim.
5. When it finishes, tell me and we will `/design-sync` the components into the repo.

---

# Design System — SAG Lab Bootcamp Presentation Deck

## 0. Non-negotiable constraints — read these first

- **This is an Arabic, right-to-left design system.** RTL is the default and only direction, not a
  variant. Every component must be authored with `dir="rtl"`, text aligned to the **start (right)**,
  and mirrored layouts. Latin fragments (`Claude Code`, `MVP`, `MCP`, `GitHub`, `Vercel`, `Supabase`,
  file paths, shell commands) sit **inline inside Arabic text** and must be wrapped so they do not
  reorder — never let a Latin token flip the line.
- **Use CSS logical properties throughout** — `margin-inline-start`, `padding-inline-end`,
  `border-inline-start`, `text-align: start`. Do **not** use `left` / `right` in flowing layout.
  Only genuinely directional things (a chevron pointing forward) may be physical, and they mirror.
- **This is a presentation deck, not a web page.** Every slide is a **fixed 16:9 frame** that must fit
  entirely on screen. **Nothing scrolls inside a slide.** Design every component to a fixed height budget.
- Output must be **self-contained HTML/CSS** with no external dependencies except Google Fonts.

## 1. Brand

Two marks, deliberately. **ساج لاب (SAG Lab)** is the lead mark; **ساج التقنية / SAG TECH** is the
endorsing company. They are different marks, not variants.

- **ساج لاب** — a heavy navy calligraphic Arabic wordmark, two lines (ساج / لاب), no icon, no Latin.
  Used large on the title and section-divider slides. Needs horizontal breathing room.
- **ساج التقنية / SAG TECH** — a circular navy monogram (a white spiral reading as an “S”, closing on a
  solid dot) followed by `SAG TECH` in bold Latin caps with `ساج التقنية` beneath it in a squarish Kufi.
  Used **small, in the slide footer**, as the endorsement.

Define a **logo zone** component with three sizes (hero / standard / footnote) and enforced clear-space
equal to the monogram’s radius. Never place either mark on a busy background.

## 2. Color

| Token | HEX | Role |
|---|---|---|
| `--brand-primary` | `#223A71` | الشعار والعناوين — primary navy, headings and marks |
| `--brand-deep` | `#142447` | الأغلفة والخلفيات الداكنة — dark slide backgrounds, title slide |
| `--brand-sky` | `#38B6D9` | الأزرار والتفاصيل التقنية — structure: rules, buttons, technical accents |
| `--brand-snow` | `#EEF2F8` | البطاقات والأقسام — card and section surfaces |
| `--brand-white` | `#FFFFFF` | الخلفيات والمساحات |
| `--brand-ink` | `#333B48` | النصوص التفصيلية — body copy |
| `--brand-teal` | `#16C7B7` | **state only** — active step, completed, progress |

**Keep sky and teal apart.** They are close in hue: `--brand-sky` is for **structure**, `--brand-teal` is
for **state**. They must never carry the same meaning on one slide.

Provide two slide surfaces: a **light** surface (white / snow, ink text) as the default, and a **dark**
surface (`--brand-deep`, white text, sky accents) for the title, section dividers and the closing slide.

## 3. Typography

Arabic-first. Use **Cairo** (Google Fonts) as the primary family — **for Arabic and for the Latin
fragments alike**, so mixed lines share one skeleton and never shift weight mid-sentence. Cairo is a
variable font (200–1000), so one file per unicode subset covers every weight. Always give a real
fallback stack ending in a system Arabic face.

Set a scale sized **for a projector at the back of a room** — this is the most common failure in decks:

| Role | Size | Weight | Use |
|---|---|---|---|
| `display` | 64–72 px | 700 | title slide headline |
| `slide-title` | 40–44 px | 700 | the one heading on a content slide |
| `section-number` | 20 px | 600 | «القسم 7.10» badge |
| `body-lead` | 28–30 px | 500 | the main line on a slide |
| `body` | 22–24 px | 400 | bullets and card text — **never below 22 px** |
| `caption` | 18 px | 400 | media captions, footnotes |
| `mono` | 20 px | 400 | shell commands, file paths — `IBM Plex Mono`, forced LTR |

Arabic line-height must be generous — **1.7–1.8** for body — because Arabic ascenders and diacritics
collide at tighter settings.

## 4. Components to build

Build each of these as a **named, reusable component**. Do not deliver “a set of ready components” —
these specific ones, by these names:

**Slide frames** (each a fixed 16:9 container, `--brand-*` surfaces, footer zone reserved):
1. `slide-title` — the cover: hero wordmark, program name, presenter block, endorsement mark.
2. `slide-section` — a divider announcing a new curriculum section; big number + Arabic title, dark surface.
3. `slide-content` — one heading + up to 7 bullets. The workhorse.
4. `slide-split` — two columns, e.g. «ما تقرؤه أنت» / «ما يقرؤه Claude».
5. `slide-media` — **media-dominant**: a large screenshot/GIF frame with one short instruction line.
   This is the most important frame in the deck; §7.10 is built almost entirely from it.
6. `slide-steps` — a numbered vertical sequence, 3–6 steps, each with an optional small thumbnail.
7. `slide-table` — a compact table, max 8 rows, header row in `--brand-snow`.
8. `slide-quote` — a single emphasised statement or warning, centred.
9. `slide-closing` — end of day: what was accomplished, what is next.

**Elements:**
10. `presenter-block` — circular photo (~180 px, 2 px `--brand-sky` ring on dark surfaces) + name + role lines.
11. `section-badge` — a small pill reading «القسم 7.10» / «المهمة 14.1», linking the slide to the curriculum.
    Every content slide carries one. This is how a trainee finds the slide again in the guide.
12. `media-frame` — a rounded, subtly-shadowed container for a screenshot, GIF or short video, with an
    optional caption beneath and an optional numbered callout dot overlay for pointing at UI.
13. `step-chip` — a numbered circle, with states: upcoming / **active (`--brand-teal`)** / done.
14. `timing-pill` — a small pill showing a duration («٢٥ دقيقة») for agenda slides.
15. `skill-card` — a small card for one acquired skill: icon slot + one line of Arabic. Used in a grid.
16. `agenda-row` — one row of the daily schedule: session name, duration, what happens.
17. `file-tree` — a monospace block for directory trees. **Forced LTR** (`dir="ltr"`) — box-drawing
    characters and paths mirror badly under RTL — but with Arabic annotations right-aligned beside it.
18. `callout` — an inline note box in three tones: info (sky), warning (amber), rule (teal).
19. `day-progress` — a persistent indicator showing which of the 10 days is active and position within it.
20. `footer-bar` — the endorsement mark, day number, and slide number.

## 5. Layout rules

- 16:9 frame, safe margins of at least 5% on every side — projectors crop edges.
- A slide has **one** idea and **one** heading. If it needs two headings, it is two slides.
- Content budget per slide: **≤ 7 bullets, ≤ ~90 Arabic words, ≤ 8 table rows.** If content exceeds
  this, the design must break it into `١/٢` and `٢/٢` continuation slides — **never shrink the type**
  and never allow a scrollbar.
- Media slides: the image occupies **≥ 55%** of the frame. Text supports the image, not the reverse.
- Provide a visible **focus/step highlight** state so the presenter can point at one item without animation.

## 6. What I do NOT want

- No stock photography, no gradients-as-decoration, no drop shadows heavier than a 2 px lift.
- No icon set with a different visual language from the monogram — icons should be **line, 2 px, rounded
  caps**, matching the mark’s geometry.
- No light grey text on white. Body text is `--brand-ink` at full opacity; a projector eats contrast.
- No animation-dependent meaning. The deck must read correctly as static frames.

## 7. Deliverable

A complete design system: color tokens, type scale, spacing scale, and the 20 named components above,
each with its states, documented so they can be pulled into a repository one at a time via `/design-sync`.
