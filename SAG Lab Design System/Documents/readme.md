# ساج لاب — نظام تصميم عروض معمل بناء المنتج
# SAG Lab — Bootcamp Presentation Design System

An **Arabic, right-to-left, presentation-only** design system for the *MVP Bootcamp*
(معمل بناء المنتج الأدنى القابل للتطبيق) — a ten-day, instructor-led program run by
**ساج لاب (SAG Lab)** and endorsed by **ساج التقنية (SAG TECH)**.

Every artifact in this system is a **fixed 16:9 slide frame** (1920×1080) intended for a projector
at the back of a room. It is not a web design system: nothing reflows, nothing scrolls, and no
component is designed to live outside a slide.

## Sources used

This system was authored **from a written brief only**. No codebase, Figma file, existing deck,
logo artwork or font binaries were supplied.

| Source | Status |
|---|---|
| Written brand + component brief (pasted in chat) | ✅ the sole source of truth |
| Codebase / repository | ❌ none provided |
| Figma file or link | ❌ none provided |
| Existing slide deck | ❌ none provided |
| Logo files (ساج لاب wordmark, ساج التقنية monogram) | ❌ **not provided — see Assets** |
| Font binaries | ❌ none provided; Google Fonts used (see Typography) |

Everything below that is not in the brief is marked as an **intentional addition** or a
**flagged substitution**. Nothing was inferred from a company identity the brief did not give.

---

## 1. Content fundamentals

**Language.** Arabic is the writing language, not a translation layer. Copy is written in Modern
Standard Arabic, in the register of a competent instructor speaking to adults who are new to the
tooling but not new to work.

**Voice — "we do", not "you must".** The deck speaks as a lab, in the first person plural for shared
work («ما أنجزناه اليوم») and in the imperative for instructions the trainee performs
(«اكتب الأمر، ثم اقرأ الخطة»). It never lectures in the third person and never says «يجب على المستخدم».

**One idea per slide, one sentence per line.** Instructions are single clauses. Compare:

- ✅ «اكتب الأمر، ثم اقرأ الخطة كاملة قبل الموافقة عليها.»
- ❌ «بعد أن تكون قد فتحت المشروع وتأكدت من الاتصال، يمكنك حينها كتابة الأمر…»

**Latin fragments stay Latin.** Product and tool names are never transliterated: `Claude Code`,
`GitHub`, `Vercel`, `Supabase`, `MVP`, `MCP`. They are wrapped in `.tok-lat`; commands, paths and
file names are wrapped in `.tok-code` so the surrounding Arabic line cannot reorder.

**Numerals.** Arabic-Indic numerals inside Arabic prose (**«٢٥ دقيقة»**, «١/٢»). Latin digits for
anything the trainee will match against the printed guide or a terminal: curriculum numbers
(`7.10`), slide numbers, table figures, code.

**Curriculum locators are content, not chrome.** Every content slide carries «القسم 7.10» or
«المهمة 14.1». This is how a trainee finds the slide again in the guide, so the number is copy the
author must get right — never decorative.

**Tone markers.** Three, and only three, kinds of aside: ملاحظة (info), تنبيه (warning),
قاعدة (rule). A rule is a sentence the trainee can repeat back — «لا تطلب من Claude ما لا تستطيع
وصفه في سطر واحد.»

**No emoji.** Anywhere. Icons carry the same job in a single visual language.

**Length budget** (enforced by the frames, not by trust): ≤ 7 bullets, ≤ ~90 Arabic words,
≤ 8 table rows per slide. Over budget, the slide splits into «١/٢» and «٢/٢» — the type size never
shrinks and a scrollbar never appears.

---

## 2. Visual foundations

**Direction.** RTL is the only direction. Components are authored `dir="rtl"`, text is
`text-align: start`, and layout uses **logical properties exclusively** —
`margin-inline-start`, `padding-inline-end`, `border-inline-start`, `inset-inline-start`.
`left`/`right` appear nowhere in flowing layout. Two things are deliberately forced LTR:
directory trees (`FileTree`, `dir="ltr"`) and inline code/paths — box-drawing characters and
paths mirror badly. A forward-pointing chevron is the one physical glyph allowed, and it mirrors
via `.sag-chevron-forward`.

**Colour.** Two navies do the structural work — `--brand-primary #223A71` for marks and headings,
`--brand-deep #142447` for dark surfaces. `--brand-sky #38B6D9` is **structure**: rules, bullet
markers, buttons, technical accents. `--brand-teal #16C7B7` is **state**: active step, done,
progress. They are close in hue and must never carry the same meaning on one slide — that
separation is the single most load-bearing rule in the palette. `--brand-snow #EEF2F8` is the only
card/section surface; `--brand-ink #333B48` is body copy at **full opacity**, always.

**Surfaces.** Exactly two: **light** (white page, snow cards, ink text) as the default, and
**dark** (`--brand-deep`, white headings, `#DCE3F0` body, sky accents) for the title, section
dividers and closing slide. The dark surface is a scope — `[data-surface="dark"]` re-points the
semantic aliases, so a component never needs a dark variant of its own.

**Type.** IBM Plex Sans Arabic (400/500/600/700) for Arabic, IBM Plex Sans for Latin fragments, IBM
Plex Mono for code. Scale: display 68 / slide-title 42 / body-lead 29 / body 23 / caption 18 /
mono 20. Arabic line-height is 1.75 for body and 1.7 for the lead — below 1.7 ascenders and
diacritics collide. Latin caps get `letter-spacing: .06em`; Arabic gets none.

**Spacing & layout.** 8px base, eight steps (8→128). Slide geometry is fixed: 1920×1080 frame,
**96px safe margin (5%) on every side** because projectors crop edges, and a **96px footer zone
reserved in every frame** whether or not it is filled. Groups are laid out with flex/grid + `gap`,
never per-element margins. Media slides give the image **≥55%** of the frame — which is why `SlideMedia` defaults to the stacked layout (~57%); its optional side-by-side layout reaches only ~39% and is reserved for portrait screenshots.

**Backgrounds.** Flat colour only. No photography, no gradients as decoration, no textures. The
one patterned surface in the system is the media-frame *placeholder* — a 14px diagonal hatch at 4.5%
navy — and it exists to say "an image goes here", so it must never survive into a finished deck.

**Cards.** Snow fill, 1px `--brand-snow-line` hairline, `--radius-md` (14px) for element cards and
`--radius-lg` (24px) for split columns and media frames, and a `--lift-1`/`--lift-2` shadow.
**2px is the maximum lift in this system** — `0 2px 6px rgba(20,36,71,.14)`. Nothing heavier exists.

**Radii.** 8 / 14 / 24 / 999px. Pills (badges, timing, chips) are fully round; frames are square —
the slide itself is never rounded.

**Transparency & blur.** Effectively unused. Alpha appears only in shadows and in the two dark-surface
tints (`rgba(56,182,217,.18)` badge, `rgba(22,199,183,.22)` chip halo). **No blur anywhere** — no
frosted panels, no protection gradients. Text sits on solid colour, because a projector eats contrast.

**Focus / emphasis.** Static, never animated. `focusIndex` on `SlideContent` tints one bullet sky
and dims the rest to 50%; `focusRow` on `SlideTable` tints a row and underlines it in teal;
`AgendaRow state="active"` and `StepChip state="active"` carry the teal state. A presenter points
by advancing to a variant frame — **no meaning is ever carried by animation**, and the deck must read
correctly as static frames.

**Animation.** None in the components. If a build sequence is wanted, produce two frames.

**Hover / press.** Only the deck's own navigation chrome is interactive: hover fills with
`--brand-sky-soft`, press fills with `--brand-sky` and inverts the label. Slide content has no
hover states — it is projected, not clicked.

**Imagery.** Real screenshots and GIFs of the actual tooling, nothing else. They arrive already
cool-toned and high-contrast (dark terminals, light editors), which is why the media frame is a
neutral snow container with a hairline rather than a styled treatment. No stock photography, no
filters, no grain.

**Contrast.** Ink on white ≈ 8.6:1, white on deep ≈ 14:1, sky and teal are used behind dark text
only. Light grey text on white does not exist in this system.

---

## 3. Iconography

**Set:** [Lucide](https://lucide.dev) — 24×24, **2px stroke, rounded caps and joins**, which matches
the geometry of the circular monogram. Chosen as a **flagged substitution**: the brief specifies
"line, 2px, rounded caps" icons but supplied no icon assets, and no in-house set exists to copy.
If SAG Lab has its own icon set, swap it in and delete the CDN dependency.

**How it loads.** Lucide is not vendored (its SVGs were not available to copy into `assets/`).
Pages include the UMD build and the `Icon` component builds the SVG from `window.lucide.icons`:

```html
<script src="https://unpkg.com/lucide@0.446.0/dist/umd/lucide.js"></script>
```
```jsx
<Icon name="clock" size={20} />
```

Colour always comes from `currentColor`. Without the script the component renders an empty box of
the right size, so layout never breaks.

**Which glyphs.** `clock`/`calendar` (timing), `info` / `alert-triangle` / `check-circle`
(callout tones), `check` (done), `terminal`, `git-branch`, `rocket` (skill cards). Keep to this
handful; a deck that needs a twentieth icon usually needs fewer words.

**Not used:** emoji (never), Unicode symbols as icons (the only exception is the ✓ glyph inside a
done `StepChip`), icon fonts, PNG icons, and multi-colour or filled icon styles.

---

## 4. Assets — and what is missing

`assets/` is **empty of brand marks by design.** No logo files were supplied, and this system does
not draw, reconstruct or approximate a company's real mark. The brief describes:

- **ساج لاب** — a heavy navy calligraphic Arabic wordmark on two lines (ساج / لاب).
- **ساج التقنية / SAG TECH** — a circular navy monogram (white spiral closing on a solid dot) with
  `SAG TECH` in bold Latin caps and ساج التقنية beneath in a squarish Kufi.

Both are therefore **type-set placeholders**: `LogoZone` sets the wordmark in IBM Plex Sans Arabic
Bold across two lines with enforced clear space, and `EndorsementMark` renders a navy circle
carrying the letter *S*. **Ask for the real SVGs and drop them in** — the two components are the only
places that need changing.

Trainee/presenter photos are also user-supplied; `PresenterBlock` and `MediaFrame` fall back to
labelled placeholders.

---

## 5. Index

| Path | What it is |
|---|---|
| `styles.css` | the single entry point consumers link — `@import` list only |
| `tokens/fonts.css` | Google Fonts import + Arabic-first family stacks |
| `tokens/colors.css` | palette, derived tones, semantic aliases, `[data-surface="dark"]` scope |
| `tokens/typography.css` | type scale, weights, Arabic line-heights, `--type-*` shorthands |
| `tokens/spacing.css` | 8px scale + slide geometry (frame, safe margin, footer zone) |
| `tokens/elevation.css` | radii, the two lifts, icon stroke width |
| `tokens/rtl.css` | direction utilities: `.tok-lat`, `.tok-code`, numerals, mirrored chevron |
| `components/frames/` | the nine slide frames + `SlideFrame` base, `frames.css` |
| `components/elements/` | the twelve slide elements + `Icon`, `elements.css` |
| `slides/` | sample deck: `index.html` click-through + one page per frame, shared `deck.jsx` |
| `templates/bootcamp-deck/` | starting deck a consuming project copies: cover + content + media + closing |
| `guidelines/` | 19 foundation specimen cards (Colors, Type, Spacing, Brand) |
| `thumbnail.html` | homepage tile |
| `SKILL.md` | Agent Skills wrapper, for use in Claude Code |

### Components

**Frames** — fixed 16:9, footer zone reserved, nothing scrolls:
`SlideFrame` (base) · `SlideTitle` · `SlideSection` · `SlideContent` · `SlideSplit` ·
`SlideMedia` · `SlideSteps` · `SlideTable` · `SlideQuote` · `SlideClosing`

**Elements:**
`PresenterBlock` · `SectionBadge` · `MediaFrame` · `StepChip` · `TimingPill` · `SkillCard` ·
`AgendaRow` · `FileTree` · `Callout` · `DayProgress` · `FooterBar` · `LogoZone` ·
`EndorsementMark` · `Icon`

Each has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when + usage).

### Intentional additions

The brief names 20 components; four more exist for concrete reasons:

- **`SlideFrame`** — the shared 16:9 shell. Without it the nine frames each re-declare the safe
  margins and footer zone, and they drift apart.
- **`LogoZone`** — the brief's §1 "logo zone with three sizes and enforced clear space", named.
- **`EndorsementMark`** — §1 treats ساج لاب and ساج التقنية as *different marks, not variants*, so
  they are two components rather than one with a prop.
- **`Icon`** — a wrapper over the substituted Lucide set, so swapping icon sets later touches one file.

One extra colour pair is also an addition: `--state-warning` / `--state-warning-soft`, required by
`Callout tone="warning"` (the brief asks for amber but the palette has none).

### Template

`templates/bootcamp-deck/BootcampDeck.dc.html` — a four-slide day deck (cover, content, media, closing)
with the footer's day indicator exposed as tweaks. It loads this system through
`templates/bootcamp-deck/ds-base.js`; a consuming project points the `base` line in that file at its
bound `_ds/` copy and everything else works unchanged.

### No UI kit

There is no app, website or product surface in this brand — the deliverable *is* the deck. `slides/`
serves as the "kit": `slides/index.html` is a click-through of all nine frames with real Arabic
content from day 7 of the curriculum, and each frame also has its own full-size page.
