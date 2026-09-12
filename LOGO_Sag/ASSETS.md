# Brand assets — inventory

Every file below was opened and described from the actual artwork, not from its filename.

> **Two distinct marks live in this repo.** `SAG_Lab_Logo_Transparent.png` is **ساج لاب** — an Arabic
> calligraphic wordmark. Everything inside `LOGO_Sag/` is **ساج التقنية / SAG TECH** — a monogram
> lockup. They are not variants of each other. The deck uses **ساج لاب as the lead mark and
> ساج التقنية as the endorsing company**.

---

## 1. ساج لاب — the lead mark

| File | Description |
|---|---|
| `../SAG_Lab_Logo_Transparent.png` | The words **«ساج لاب»** set in a heavy navy calligraphic Arabic face, stacked on two lines (ساج above, لاب below), with two small diamond-shaped diacritic marks. No monogram, no Latin text, no container shape. Transparent background. |

**Use:** the hero mark on the title slide, and the section-divider mark. Because it is a wordmark with no
icon, it needs horizontal room — do not shrink it below ~180 px wide or the diacritics fill in.

---

## 2. ساج التقنية / SAG TECH — the endorsing company

All share the same **monogram**: a filled navy circle containing a white spiral that reads as an “S”,
closing on a solid navy dot at the lower centre — an “S” drawn as one continuous ribbon.

### ⚠ The three SVG lockups are NOT self-contained — do not use them on the web

`Logo_Horizontal.svg`, `Logo_Vertical.svg` and `Logo_Full.svg` contain **live `<text>` elements**
referencing the fonts **`KacstTitle`** (Arabic) and **`Larsseit-Bold`** (Latin):

```css
.cls-2 { font-family: KacstTitle, KacstTitle; }
.cls-3 { font-family: Larsseit-Bold, Larsseit; }
```

Neither font is installed on a normal machine, so the browser substitutes a fallback with different
metrics, the text renders wider than the `viewBox`, and **the wordmark is visibly clipped** — differently
on every computer, including the one you present from. This was caught by rendering the deck, not by
reading the files.

**Therefore the deck uses the PNGs for these three**, which are raster, transparent and far higher
resolution than any slide needs (`Logo_Horizontal.png` is 1085×532 rendered at ~106×52 — 10×
oversampled). `LOGO_Sag Icon.svg` contains **no text**, only paths, so it is safe as SVG and is the
one vector file the deck uses.

**To get usable vector lockups**, ask the designer to re-export with **text converted to outlines/paths**.

### SVG — vector source (see the warning above before using)

| File | Description | Deck use |
|---|---|---|
| `SVG/LOGO_Sag Icon.svg` | The monogram **alone**, no text — **pure paths, 0 `<text>` elements**. | ✅ Favicon · corner watermark · the one SVG the deck uses |
| `SVG/Logo_Horizontal.svg` | Monogram at left, then `SAG TECH` in bold Latin caps with **ساج التقنية** beneath it in a squarish Kufi-style face. Wide, ~2:1. | ❌ text-dependent — use the PNG |
| `SVG/Logo_Vertical.svg` | Monogram on top, `SAG TECH` + **ساج التقنية** centred beneath. Roughly square. | ❌ text-dependent — use the PNG |
| `SVG/Logo_Full.svg` | The vertical lockup **plus a third line**: `شركة سهر عبد العزيز الغلاييني`. | ❌ **Not used at all** — text-dependent *and* the legal-entity name is baked in |

### PNG — ✅ what the deck actually uses for the lockups

Raster, transparent, identical artwork to the SVGs — and **self-contained**, which the SVGs are not.

| File | Size | Deck use |
|---|---|---|
| `PNG/Logo_Horizontal.png` | 1085×532 | **Footer endorsement on every slide** + title-slide endorsement |
| `PNG/Logo_Vertical.png` | 442×695 | Closing slide |
| `PNG/LOGO_Sag Icon.png` | 1782×1954 | Raster fallback for the icon |
| `PNG/Logo_Full.png` | — | ❌ not used (legal-entity name) |

### JPG — ⚠ **baked-in backgrounds, not transparent**

| Folder | Files | Description |
|---|---|---|
| `JPG/Black/` | `LOGO_Sag-01` horizontal · `-02` vertical · `-03` vertical + legal name | Navy artwork on a **solid black** field |
| `JPG/White/` | `LOGO_Sag Icon` · `-01` horizontal · `-02` vertical · `-03` vertical + legal name | Navy artwork on a **solid white** field |

**These will show a visible rectangle on any tinted slide.** Only usable when the slide background is
exactly black or exactly white — which no slide in this deck is. **Unused.**

### Not inventoried

`AI/` and `PDF/` — source/print formats, no use in an HTML deck.

---

## 3. Trainer photo

| File | Description |
|---|---|
| `C:\Users\ammar\personal\photo.png` | Portrait headshot, vertical. Man with dark hair and beard wearing dark-rimmed glasses and a beige checked short-sleeve shirt, standing three-quarter turned against a pale cream curtain. Even, soft lighting; head occupies the upper third. |

**Use:** title slide, **circular crop centred on the face** (~180 px). The pale background sits well on the
`#EEF2F8` snow-blue surface; on a navy slide, give it a 2 px `#38B6D9` ring so it does not float.

---

## 4. Palette

From the brand sheet «ساج لاب — الأزرق والسماوي», plus one addition.

| Token | HEX | Role (as given) |
|---|---|---|
| `--brand-primary` | `#223A71` | الشعار والعناوين |
| `--brand-deep` | `#142447` | الأغلفة والخلفيات الداكنة |
| `--brand-sky` | `#38B6D9` | الأزرار والتفاصيل التقنية |
| `--brand-snow` | `#EEF2F8` | البطاقات والأقسام |
| `--brand-white` | `#FFFFFF` | الخلفيات والمساحات |
| `--brand-ink` | `#333B48` | النصوص التفصيلية |
| `--brand-teal` | `#16C7B7` | **إضافة** — لهجة ثانوية للتمييز والحالات النشطة |

`#16C7B7` and `#38B6D9` are close in hue; keep **teal for state** (active/done/progress) and
**sky for structure** (buttons, rules, technical accents) so they never compete on one slide.
