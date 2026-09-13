# Deck anatomy

Component, token and interaction reference for `project-package/slides/day-NN.html`. Read the sections you need.

- [Files](#files)
- [Slide frame](#slide-frame)
- [Content components](#content-components)
- [Tokens](#tokens)
- [Interaction layer](#interaction-layer)
- [deck.js contract](#deckjs-contract)
- [Traps that have actually bitten](#traps-that-have-actually-bitten)

---

## Files

```
project-package/slides/
├── day-01.html            one <section class="sag-slide deck-slide"> per slide
├── assets/
│   ├── styles.css         the ONLY <link> — @imports everything below, in order
│   ├── tokens/            fonts · colors · typography · spacing · elevation · rtl
│   ├── components/        frames.css (slide frames) · elements.css (badge, cards…)
│   ├── icons.css          Lucide, vendored as CSS masks — no CDN, works offline
│   ├── deck.css           the deck layer + every project override; edit HERE
│   ├── deck.js            nav · scaling · overflow guard · interaction layer
│   ├── brand/  fonts/     artwork and Cairo
└── media/                 screenshots and GIFs, referenced never embedded
```

`deck.css` is imported **last**, so anything in it wins over the design system without
`!important`. Put overrides there, never in `components/`.

---

## Slide frame

```html
<!-- ═══ 12 — short title ═══════════════════════════════════ -->
<section class="sag-slide deck-slide" data-anchor="optional-stable-name">
  <div class="sag-slide__head">
    <span class="sag-badge"><span class="sag-badge__num">7.1</span> اسم القسم</span>
    <h2 class="sag-slide__title">عنوان الشريحة</h2>
    <div class="sag-slide__rule"></div>
  </div>
  <div class="sag-slide__body"> … </div>
  <template class="terms" data-title="…"> … </template>   <!-- optional -->
  <footer class="sag-slide__foot">
    <div class="deck-foot">
      <div class="deck-foot__side">
        <div class="deck-endorse" data-size="footnote"><img …></div>
        <span class="deck-foot__num">اليوم 1</span>       <!-- day label, hand-authored -->
      </div>
      <span class="deck-foot__num">12</span>              <!-- page number, JS-owned -->
    </div>
  </footer>
</section>
```

- Fixed 1920×1080, `overflow: hidden`, `direction: rtl`. **Nothing inside a slide ever scrolls** —
  the presenter cannot scroll mid-sentence and a projector crops whatever is below the fold. Two
  deliberate exceptions, both *consulted* rather than presented: the ؟ term window, and the
  `.pkgtree` package listing on slide 13.
- The head is a **2-column grid**: badge in column 1, title in column 2, rule spanning row 2.
  Placement is explicit on both axes because some slides author the title *before* the badge —
  relying on source order silently drops them onto separate rows.
- `data-surface="dark"` on the section flips the colour tokens; no other change needed.
- `data-anchor` is optional and gives the slide a **stable name** for deep links. Use it whenever a
  link must reach one specific slide inside a section that spans several (§7.10 spans 13).

Frame variants: `sag-title` (cover) · `sag-quote` (dark pull-quote, uses `.sag-quote__inner`
instead of head/body) · `sag-media` (image-led, `.sag-media__inner` + `.sag-media__side`).

---

## Content components

| Class | What it is |
|---|---|
| `.bento[data-cols="1..4"]` | the grid every body uses; `align-content: safe center` |
| `.card`, `.card--accent`, `.card--state`, `.card--plain` | the workhorse; `.card__top` + `.card__icon` + `.card__title` + `.card__note`. **Block flow, not flex** — see the traps below |
| `.pkgtree` | the package listing: 2-column grid, LTR mono paths + Arabic descriptions, scrolls |
| `.reflink` | an inline `data-ref` deep link inside flowing text |
| `.tmap` (+ `.tmap__b--decide|review|try`) | the 29-task map, rendered only inside a ؟ window |
| `.sess` / `.sess__head` / `.sess__note` / `.tasks` | one session column in a §6.N day plan |
| `.task` | a live checkbox row: `.task__mark` + `.task__t` + `.task__d` |
| `.agenda` (+ `--break`, `--main`) | the session-timing rows on the §5 slide |
| `.stat` | big number + label |
| `.i.i-<name>` | an icon; the set is listed at the top of `icons.css` |
| `.tok-lat` / `.tok-code` | a Latin or code run inside Arabic text — isolates bidi |
| `.kbd` | a keycap |

`.card--plain` is a borderless note strip, normally used once at the bottom of a body for a caveat.

---

## Tokens

Colour tokens are **semantic aliases** (`--text-heading`, `--accent-structure`, `--surface-card`) over
a 7-colour palette. Reference the alias, never the raw `--brand-*`, or a dark slide will not flip.

`--accent-structure` (sky) = rules, technical accents. `--accent-state` (teal) = active/done/progress
**only**. Spacing is `--sp-1..8` (8/16/24/32/48/64/96/128). Radii `--radius-sm|md|lg|pill`. Max
elevation is 2px: `--lift-1`, `--lift-2`, `--lift-2-dark`.

---

## Interaction layer

Three affordances, one engine. The legend slide (`data-anchor="legend"`) teaches all four to
trainees with live demos, so **if you add a new one, add it there too** or nobody will find it.

### `data-ref` — section name + deep link

Put it on a `.task` (or anything). At init `deck.js` resolves it against the deck itself and builds
a tooltip from **the target slide's own badge**, so a rename or renumber can never desync it:

1. a slide whose `data-anchor` equals the ref — stable across renames *and* reorders;
2. a slide whose `.sag-badge__num` equals the ref (`"7.1"`);
3. a slide whose badge label *contains* the ref.

```html
<div class="task" data-ref="7.1"> … </div>
<div class="task" data-ref="commit-push"> … </div>   <!-- one slide inside a long section -->
```

Hover shows `القسم 7.1` / the section name / `Ctrl + نقر للانتقال`. **Ctrl/⌘ + click** jumps;
**Backspace** returns. `window.deckRefAudit()` fails loudly on any ref that resolves to nothing.

### `data-tip` — hover text

```html
<span class="ttip" data-tip="…">كلمة</span>                              <!-- dotted underline -->
<span class="ttip ttip--icon" tabindex="0" data-tip-title="MVP" data-tip="…">
  <span class="i i-info"></span></span>                                   <!-- the i variant -->
```

`data-tip-title` switches the tooltip to the term treatment (`.tip--term`). The `i` icon needs the
`.ttip--icon` wrapper because `.i` is a CSS mask — anything nested inside an `.i` is invisible.

### `؟` — the term window

The slide owns one `<template class="terms">`; each `؟` names one entry, and opening any of them
shows **all** the slide's terms with that one highlighted.

```html
<button class="qmark" type="button" data-term="repo" aria-label="شرح: مستودع">؟</button>
…
<template class="terms" data-title="مصطلحات هذه الشريحة">
  <div data-term="repo" data-title="مستودع">شرح…</div>
</template>
```

`data-wide="true"` on the `<template>` widens the panel to 1320px. One entry needs it: slide 18's
29-row task map. That entry's body is a `<table>`, which is why `deck.js` builds the definition as a
`<div>` — a `<table>` inside the old `<p>` is reparented by the HTML parser and loses its styling.
When a slide has only **one** term, the clicked-item highlight is suppressed: highlighting exists to
find your term among others, and with one it just reads as an unexplained colour wash.

The glyph is a literal Arabic `؟`, not an icon — `icons.css` has no question mark and a mirrored
Latin `?` is the wrong character in an RTL deck. It needs `unicode-bidi: isolate`.

While the window is open the deck's own keys (arrows, Space, Home/End, Backspace) are swallowed so
reading a definition cannot page the slide away. Escape and backdrop-click close it.

---

## deck.js contract

| Export / behaviour | Notes |
|---|---|
| `window.deckAudit()` | logs and returns the overflowing slide numbers. **The gate.** |
| `window.deckRefAudit()` | returns unresolved `data-ref` values |
| Arrow / Space / PageUp / PageDown | navigate (RTL: ArrowLeft advances) |
| `Home` / `End` / `F` / `H` | first / last / fullscreen / hide HUD |
| `Backspace` | undo the last deep-link jump |
| footer page numbers | written from each slide's index at init |
| `.task` state | `localStorage`, keyed by the row's **text**, so reordering never loses a tick |
| HUD | idle-hides after 2s so it never covers slide content |

---

## Traps that have actually bitten

- **`class="task([^"]*)"` also matches `class="tasks"`.** A regex pass meant for task rows attached
  every session group's attribute to its wrapper instead of its first row. Anchor on `"task"` with a
  negative lookahead, or match the full attribute value.
- **A tooltip host must be `position: relative`.** Otherwise `bottom: calc(100% + 10px)` resolves
  against the *slide* and the tip lands 1090px up — present in the DOM, invisible on screen.
- **The overflow guard must skip an out-of-flow element's whole subtree**, not just the element. A
  tooltip is `position: absolute` and meant to spill; its children are static blocks whose rects land
  far outside the frame and get reported as overflow. `deck.js` uses a TreeWalker with
  `FILTER_REJECT` for exactly this.
- **`transform: scale()` does not shrink the layout box.** Any `getBoundingClientRect()` value is
  scaled device px; divide by `--deck-scale` before comparing to a CSS px value.
- **A CSS comment that swallows the rules after it.** Prose accidentally placed after `*/` silently
  killed three rules once; the symptom was a layout value reverting with no diff to explain it.
- **`.card` must not be a flex column.** A `<p>` keeps its UA `margin: 1em 0`, and margins do **not**
  collapse inside a flex container — so every extra `.card__note` cost the 16px `gap` *plus* ~18px
  above *plus* ~18px below. Slides 3 and 15 read as half air until the card became a block with the
  margins zeroed and one `.card > * + * { margin-block-start }` rule. Vertical centring moved from
  `justify-content: safe center` to `align-content: safe center`, which is the block-container
  equivalent.
- **A scroll container needs its own exception in the overflow guard**, for the mirror-image reason
  an absolutely positioned box does: its children below the fold are reachable, not clipped by the
  frame. `boxOverflow` measures the container's own box, then `FILTER_REJECT`s the subtree.
- **A tooltip rect read straight after `pointerenter` is mid-transition.** The clamp writes
  `--tip-dx`, which animates over .14s, so the first measurement of a never-yet-hovered tip can
  report it outside the frame when it is not. Hover everything once, then measure — or suppress the
  transition before reading.
- **Fill width with TYPE SIZE, not with a stretched column.** Asked to make the package tree use the
  empty space, a `minmax(0, 1fr)` description column only moved the emptiness to one side — short
  descriptions leave their column's tail bare, and the type stayed as small as before. Two
  `max-content` columns, centred, with the font sized until the widest row nearly spans the card, is
  what actually does it: 58% fill at 34px became 94% at 37/38px.
- **Resolve an overflow by reclaiming space before cutting words** — grid gap, card padding, a
  component's own chrome. Putting the badge and title on one row gave back ~74px on *every* slide.
