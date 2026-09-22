# Deck anatomy

Copy-paste reference for `project-package/slides/day-NN.html`. Every component below **already
exists and works** — building a new day means copying from `day-01.html` at the line ranges given
here, not authoring markup from scratch. Read the sections you need.

- [Files](#files) · [Page shell](#page-shell) · [Frame types](#frame-types) · [Components](#components)
- [Interaction layer](#interaction-layer) · [Icons](#icons) · [Tokens](#tokens)
- [deck.js contract](#deckjs-contract) · [Traps that have actually bitten](#traps-that-have-actually-bitten)

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
└── media/                 recordings, flat, referenced as src="media/name.mp4"
```

Load order (`styles.css:5-14`, later wins): tokens → components → icons → **deck.css last**. Put
every override in `deck.css`; never edit `components/`.

---

## Page shell

Copy `day-01.html:1-16` and `3970-3983`. The `<title>`, the day label in each footer, and the HUD's
`1 / NN` placeholder are the only per-day edits.

```html
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>اليوم N — … | دورة بناء المنتجات الأولية</title>
  <link rel="icon" href="assets/brand/mark-sag-tech-icon.svg">
  <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
  <div class="deck-stage"><div class="deck-scaler">
      <!-- sections here -->
  </div></div>
  <div class="deck-hud">
    <button data-act="prev" title="السابق">‹</button>
    <span class="deck-hud__pos">1 / NN</span>
    <button data-act="next" title="التالي">›</button>
    <button data-act="full" title="ملء الشاشة">⛶</button>
  </div>
  <script src="assets/deck.js"></script>
</body>
</html>
```

Every slide needs **both** `sag-slide` (the frame) **and** `deck-slide` (the nav hook). A section
missing `deck-slide` is invisible to navigation, numbering and the audit.

---

## Frame types

Five exist. Geometry is fixed by `frames.css:3-18`: 1920×1080, `direction: rtl`,
`overflow: hidden`, flex column, padding `96px 96px 48px`.

| Frame | Class string | Copy from |
|---|---|---|
| Cover | `sag-slide sag-title deck-slide` + `data-surface="dark"` | `18-66` |
| Session break / pull-quote | `sag-slide sag-quote deck-slide` + `data-tone="rule"` + `data-surface="dark"` | `2114-2129` |
| Media / step-video | `sag-slide sag-media deck-slide` + `data-anchor` | `2267-2377` |
| Closing | `sag-slide sag-closing deck-slide` + `data-surface="dark"` | `3899-3967` |
| **Plain content (the default)** | `sag-slide deck-slide` + optional `data-anchor` | `424-487` |

**Plain content** — the shape you will use most:

```html
<section class="sag-slide deck-slide" data-anchor="optional-stable-name">
  <div class="sag-slide__head">
    <span class="sag-badge"><span class="sag-badge__num">7.1</span> اسم القسم</span>
    <h2 class="sag-slide__title">عنوان الشريحة</h2>
    <div class="sag-slide__rule"></div>
  </div>
  <div class="sag-slide__body">
    <p class="sag-slide__lead">…</p>                    <!-- optional -->
    <div class="bento" data-cols="3"> … </div>
    <div class="card card--plain"> … </div>             <!-- optional footnote -->
    <template class="terms" data-title="…"> … </template>  <!-- optional -->
  </div>
  <footer class="sag-slide__foot">
    <div class="deck-foot">
      <div class="deck-foot__side">
        <div class="deck-endorse" data-size="footnote"><img
            src="assets/brand/logo-sag-tech-horizontal.png" alt="ساج التقنية"></div>
        <span class="deck-foot__num">اليوم 1</span>
      </div>
      <span class="deck-foot__num">7</span>
    </div>
  </footer>
</section>
```

**`sag-media` heads are different**: title **before** badge, and **no `.sag-slide__rule`**. That
works because the head is a grid with explicit placement, not source order.

**`sag-quote` footers carry only a badge** — no logo, no day label:

```html
<footer class="sag-slide__foot">
  <div class="deck-foot">
    <div class="deck-foot__side"><span class="sag-badge">عملك على مشروعك</span></div>
    <span class="deck-foot__num">44</span>
  </div>
</footer>
```

`data-tone` on a quote: `rule` → teal mark · `warning` → amber · omitted → sky.

Four more frames exist in CSS but are **unused and unproven**: `.sag-section`, `.sag-split`,
`.sag-steps`, `.sag-table`.

---

## Components

### `.bento` — the grid every body uses

```html
<div class="bento" data-cols="3"> …children… </div>
```

Only **`data-cols` 2, 3, 4** and **`data-rows="6"`** have CSS rules. `data-cols="1"` works only by
grid fallback. Span helpers: `.bento__span-2`, `.bento__span-3`. `align-content: safe center` — see
the traps.

### `.card` — the workhorse

```html
<article class="card card--accent">
  <div class="card__top">
    <span class="card__icon"><span class="i i-terminal"></span></span>   <!-- or .card__num -->
    <h3 class="card__title card__title--sm">…</h3>
  </div>
  <p class="card__note">…</p>
  <p class="card__note card__note--sm">…</p>
</article>
```

| Modifier | Effect |
|---|---|
| `card--accent` | 5px sky start-border |
| `card--state` | 5px teal start-border |
| `card--plain` | transparent, no border/padding — the footnote strip |
| `card__num` | navy pill; takes digits **or** letters (`M`/`V`/`P`) or ranges (`8–17`) |
| `card__title--sm` | 26px — by far the more common of the two |
| `card__note--sm` | 24px, line-height 1.6 |

`.card` is **block flow, not flex**. A warning card has no modifier — the shipped pattern is inline:
`<article class="card" style="border-inline-start:5px solid var(--state-warning)">`.

### `.stat`

```html
<div class="stat"><span class="stat__v">29</span><span class="stat__l">…</span></div>
<div class="stat"><span class="stat__v stat__v--word">أسبوعان</span><span class="stat__l">…</span></div>
```

Use `--word` whenever the value is not a numeral.

### `.sess` — one session column in a day-plan block

```html
<div class="sess">
  <div class="sess__head">
    <span class="sess__name">تطبيق مع المدرب</span><span class="sess__d">62 د</span>
  </div>
  <p class="sess__note">…</p>                          <!-- optional, hugs the head -->
  <div class="tasks"> …task rows… </div>
  <p class="sess__note sess__note--foot">…</p>         <!-- optional, sits UNDER the list -->
</div>
```

`.sess__note` has `margin: -6px 0 0` to hug its heading. **Under a task list, always use `--foot`**,
or the negative margin pulls it into the last row.

### `.task` / `.tasks` — live checkboxes

```html
<div class="tasks tasks--tree">
  <div class="task" data-task-key="setup-own" data-ref="setup-map">
    <span class="task__mark"><span class="i i-check"></span></span>
    <span class="task__t">7.10 · تجهّز جهازك أنت وتربط التكاملات</span>
    <span class="task__d">30 د</span>
  </div>
  <div class="task task--l2" data-task-key="setup-3" data-parent="setup-own" data-ref="tool-git">
    <span class="task__mark"><span class="i i-check"></span></span>
    <span class="task__t">3) ثبّت Git</span>
  </div>
</div>
```

| Attribute / class | Meaning |
|---|---|
| `data-task-key` | explicit id. **Cross-slide identity** — the same key anywhere ticks together |
| `data-parent` | the key this rolls up into (by key, **never** by DOM nesting) |
| `task--l2` / `task--l3` | indent + compact sizing for depth 2 and 3 |
| `tasks--tree` | tightens the list gap to 6px; scoped so flat day-plan lists keep 10px |
| `task--free` | dashed border, teal duration — "no fixed time" |
| `data-done="partial"` | sky tint + dash glyph. **Set by JS only** |

Rows are **flat siblings**. Without a `data-task-key` the row is identified by its `.task__t` text,
so rewording it resets its saved state. Task rows assume a **light** surface.

Flat list: `day-01.html:250-273`. Nested tree: `3703-3748`.

### `.stepvid` — recording + timed steps

```html
<div class="stepvid">
  <div class="stepvid__video">
    <video class="stepvid__player" controls preload="metadata" src="media/claude-code.mp4"></video>
  </div>
  <div class="stepvid__steps">
    <ol class="stepvid__list">
      <li class="stepvid__divider">التثبيت</li>
      <li class="stepvid__step" data-t="0">
        <button class="stepvid__time" type="button">0:00</button>
        <div class="stepvid__body">
          <h4 class="stepvid__h">…</h4>
          <p class="stepvid__p">…</p>
          <div class="snipbox">…</div>                                 <!-- optional -->
          <p class="stepvid__fix"><strong>مو في المقطع:</strong> …</p>  <!-- optional -->
        </div>
      </li>
    </ol>
  </div>
</div>
```

Video is **first in markup → lands visually RIGHT** under RTL. `.stepvid__list` is a sanctioned
scroller. `.stepvid__player` and `.stepvid__list` are both required class names — `initStepVideos()`
bails without them.

**The amber affordances** — same colour on purpose, so the trainee learns one rule: *amber = the list
is right, the recording is behind it.*

| Variant | For | Markup |
|---|---|---|
| `stepvid__step--new` | a real action absent from the footage | amber row, `<span class="stepvid__mark">مضافة</span>`, **no `data-t`** |
| `stepvid__fix` | an on-screen step whose content moved | amber inset note inside `__body` |
| `stepvid__mark--idx` | a step with no matching video moment | sky ordinal badge instead of a dead `0:00` button |
| `stepvid__video--soon` + `stepvid__soon` | the capture does not exist yet | dashed placeholder box |

Omitting `data-t` is the supported way to author a non-video row: `parseFloat(null)` is `NaN`, which
`initStepVideos()` already skips on both the click and highlight paths. No JS change needed.

Once the footage matches, **delete** the amber note — do not convert it.

### `.snipbox` / `.snip` — commands and output

```html
<!-- something the trainee types or pastes: copy button -->
<div class="snipbox">
  <pre class="snip" dir="ltr">claude mcp list</pre>
  <button class="snipbox__copy" type="button" aria-label="نسخ الأمر"><span class="i i-copy"></span></button>
</div>

<!-- output the trainee reads and matches against: no wrapper, no button -->
<pre class="snip" dir="ltr">chrome-devtools … ✔ Connected</pre>
```

The test is "does this step ask the trainee to reproduce this string" — not length, not how code-like
it looks. A single bare word they must find in a longer list is still **output**. Inline `tok-code`
is only for a passing *mention*.

### Media frame (image or plain video, no step list)

```html
<div class="sag-media__inner">
  <div class="sag-media-frame">
    <div class="sag-media-frame__box">
      <video controls preload="metadata" src="media/claude-desktop.mp4"></video>
    </div>
    <p class="sag-media-frame__caption">…</p>
  </div>
  <div class="sag-media__side"><article class="card">…</article></div>
</div>
```

Only instance: `day-01.html:2219-2252`.

### Smaller pieces

| Class | What it is | Example |
|---|---|---|
| `.flow` (+ `--row`) | numbered sequence via CSS counter — a bare `<ol>`. Use for **ordered steps**; `.bento` reads as parallel facts | `1818-1824`, `2082-2087` |
| `.agenda` (+ `--break`, `--main`) | day-rhythm rows | `174-193` |
| `.idx` (+ `data-group`) | index cell; `.idx__t` is one line, ellipsised | `733-760` |
| `.pkgtree` (+ `__p`, `__d`, `--read`, `--mute`) | the package listing; a sanctioned scroller | `1099-1180` |
| `.tmap` (+ `__n`, `__b--decide|review|try`) | the 29-task table; **lives inside a `<template class="terms">`** and needs `data-wide="true"` | `536-711` |
| `.dlbtn` | real download link styled as a button; **must be an `<a href>`** | `2232` |
| `.deck-part` | "1 / 2" marker, inline inside the `<h2>` | `907` |
| `.sag-slide__lead--wide` | lifts the 34ch cap **on that slide only** — for a definition, not a hook | `1865`, `2058` |
| `.sag-slide__title--note` | inline commentary span inside the `<h2>` | `1094` |
| `.kbd` | a keycap. Light background — not for dark slides | `1964` |

---

## Interaction layer

Three explanation affordances, one engine. The legend slide (`data-anchor="legend"`) teaches them to
trainees with live demos — **add a new one there too** or nobody will find it.

**Choosing between them:**

1. one short clause on a *phrase* → `.ttip[data-tip]`
2. one short definition on a *term or acronym* → `.ttip.ttip--icon[data-tip-title][data-tip]`
3. a paragraph, or several related terms → `.qmark[data-term]` + `<template class="terms">`

```html
<span class="ttip" data-tip="…">كلمة</span>

<span class="ttip ttip--icon" tabindex="0" data-tip-title="MVP" data-tip="…">
  <span class="i i-info"></span></span>

<button class="qmark" type="button" data-term="repo" aria-label="شرح: مستودع">؟</button>
…
<template class="terms" data-title="مصطلحات هذه الشريحة">
  <div data-term="repo" data-title="مستودع">شرح…</div>
</template>
```

`.i` is a CSS mask and renders nothing but the mask — **anything nested inside an `.i` is
invisible**. That is the entire reason `.ttip--icon` exists as a wrapper.

The `<template>` lives anywhere inside the section, one per slide. Opening any `؟` renders **all**
that slide's terms with the clicked one highlighted (highlight suppressed when there is only one).
`data-wide="true"` widens the panel to 1320px — needed for a table. Inner HTML is injected verbatim,
so `tok-lat`, `.snip` and `<table class="tmap">` all work inside an entry.

The `؟` glyph is a literal Arabic `؟`, not an icon — `icons.css` has none, and a mirrored Latin `?`
is the wrong character in an RTL deck.

### `data-ref` — deep link + section name

Put it on a `.task`, a `.reflink`, or a card. `deck.js` resolves it **against this deck** and builds
the tooltip from the target slide's own badge, so a rename can never desync it:

1. a slide whose `data-anchor` equals the ref — survives renames *and* reorders;
2. a slide whose `.sag-badge__num` equals the ref (`"7.1"`);
3. a slide whose badge label *contains* the ref.

First match wins, so **two slides sharing a badge number both resolve to the earlier one** — give the
later one a `data-anchor`. Anchor names may be Arabic (`data-anchor="فهرس"`).

**`data-ref` cannot cross day files.** `resolveRef` searches only the current document. A Day-2 slide
cannot link back to Day 1's `mvp-scope`. Anything a later day needs must be **restated briefly in
that day's own deck**.

**Ctrl/⌘ + click** jumps; **Backspace** returns. `window.deckRefAudit()` fails loudly on a dead ref.

Any cross-reference to another slide is a live `reflink`, never prose. «بعد البند 5» is a defect.

---

## Icons

The complete set — 22, vendored as CSS masks. `<span class="i i-check"></span>`.

`i-alert-triangle` · `i-book-open` · `i-calendar` · `i-check` · `i-circle-check` · `i-clock` ·
`i-cloud-upload` · `i-copy` · `i-database` · `i-download` · `i-file-text` · `i-git-branch` ·
`i-info` · `i-layers` · `i-lightbulb` · `i-list-checks` · `i-palette` · `i-rocket` ·
`i-shield-check` · `i-terminal` · `i-users` · `i-wrench`

**There is no question-mark icon and no dash icon.** The `؟` is a literal character; the partial-task
dash is an inline `--i` override in `deck.css`.

---

## Tokens

Colour tokens are **semantic aliases** over a 7-colour palette. Reference the alias, never the raw
`--brand-*`, or a dark slide will not flip.

`--accent-structure` (sky) = rules, buttons, technical accents. `--accent-state` (teal) =
active/done/progress **only**.

Type — the **effective** values, after `deck.css:333-340` raises the system defaults:

| Token | Value |
|---|---|
| `--fs-display` | 76px |
| `--fs-slide-title` | 46px |
| `--fs-body-lead` | 33px |
| `--fs-body` | 26px |
| `--fs-caption` | 24px |
| `--fs-mono` | 20px |

Never override a component's font-size *downward* to fit content — split the slide instead. The floor
may only ever be raised.

Spacing `--sp-1..8` = 8/16/24/32/48/64/96/128. Radii `--radius-sm|md|lg|pill` = 8/14/24/999.
**Max elevation is 2px**: `--lift-1`, `--lift-2`, `--lift-2-dark`. Border: `--border-hairline`.

`[data-surface="dark"]` remaps `--surface-slide`, `--surface-card` (`#1B2E56`), `--surface-card-line`,
`--text-heading` (white), `--text-body`, `--text-caption`, `--text-link`, `--rule-hairline`.

Runtime variables set by JS: `--deck-scale` on `<html>`, `--tip-dx` on each `.tip`.

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
| `.task` state | `localStorage`, key `sag-deck:<filename>:tasks` — **namespaced per day file** |
| HUD | idle-hides after 2s so it never covers slide content |

Init order is deliberate: `initGifs → initRefs → initTips → initQmarks → initTasks →
initCopyButtons → initStepVideos`. `initRefs` runs **before** `initTasks` so a task row's Ctrl-check
is bound ahead of its checkbox toggle.

`initTasks()` builds `byKey` / `childrenOf` / `parentOf` **over keys, not elements** — that is what
makes one key repaint on every slide it appears on. Parent states are `true` / `'partial'` / `false`,
recomputed from children at load rather than trusted from storage. Clicking a `partial` parent fills
it in.

---

## Traps that have actually bitten

**Layout and measurement**

- **`transform: scale()` does not shrink the layout box.** Any `getBoundingClientRect()` value is
  scaled device px; divide by `--deck-scale` before comparing to a CSS px value.
- **The overflow guard measures border boxes and skips inline boxes on purpose.** Cairo's glyph box
  is taller than its em, so `scrollHeight > clientHeight` on any heading even when nothing is
  clipped. That is ink bleed. Do not "fix" the guard to use `scrollHeight`.
- **Do not hand-roll an overflow diagnostic.** One blamed `.tip` overlays for 52px when the real
  culprit was a `card__note` 2.9px over — the ad-hoc script had failed to replicate `boxOverflow`'s
  rejection of absolutely-positioned subtrees. Run `deckAudit()`, or copy the walker faithfully.
- **`align-content: safe center`** — `safe` is load-bearing. Plain `center` overflows equally in both
  directions, pushing content out through the *top* where trimming below can never recover it.
- **`.card` must not be a flex column.** Margins do not collapse in flex, so every extra `.card__note`
  cost the gap *plus* ~18px above *plus* ~18px below.
- **`.card > *` does not reach grandchildren.** An `<h3>` inside `.card__top` kept its UA `margin:
  1em 0` — 41 dead px in *every card in the deck* until it was zeroed.
- **Horizontal overflow is a separate check** from `deckAudit()`. Watch `.snip` boxes and step lists,
  including inside `؟` windows.
- **`overflow-wrap: anywhere`, not `break-word`,** for long tokens — only `anywhere` shrinks
  `min-content` so the box can actually contract.
- **A real `<video>` inflates its box** unless forced absolute inside `.sag-media-frame__box`.
- **Reclaim space before cutting words** — grid gap, card padding, component chrome. Putting the
  badge and title on one row gave back ~74px on *every* slide.
- **Fill width with TYPE SIZE, not a stretched column.** A `minmax(0,1fr)` description column only
  moves the emptiness to one side. 58% fill at 34px became 94% at 37/38px.

**Markup that silently breaks**

- **The footer number is machine-written** to `.deck-foot > .deck-foot__num` — direct child only.
  Never hand-maintain page numbers; keep the day label nested inside `.deck-foot__side` or it gets
  clobbered.
- **`.sag-slide__head` is a grid with hard-coded placement.** Badge → row 1 col 1, title → row 1
  col 2, rule and lead → row 2. **A third element dropped directly in the head lands in an unplaced
  auto row.**
- **A tooltip host must be `position: relative`.** Otherwise `bottom: calc(100% + 10px)` resolves
  against the *slide* and the tip lands 1090px up — in the DOM, invisible on screen.
- **`.snipbox__copy` must be a sibling of the `<pre>`,** never a child, or its icon glyph is copied
  along with the command. It floats on hover so it reserves no space.
- **`.snip` and `.kbd` have hard-coded light backgrounds** — do not put them on a dark slide.
- **`.qmark` must be `<button type="button">`** — inside a task row it relies on `stopPropagation`
  to avoid ticking the row.
- **A duplicated `data-task-key` silently couples two unrelated rows.**
- **Grep `class` values for non-ASCII after any hand edit.** `deck-foot__num` once became
  `deك-foot__num` and would have silently lost its styling.

**Environment**

- **Test over `file://`, not `http://localhost`.** Python's `http.server` has no Range support, so
  video seeking appears broken when it is fine. The real presentation is always `file://`.
- **`navigator.clipboard` silently rejects under `file://`** — the `execCommand` fallback is
  mandatory. Do not "modernise" it away.
- **Scope verification queries to the active slide.** A global selector once returned a tooltip from
  a different slide entirely.
- **A CSS comment can swallow the rules after it.** Prose accidentally placed after `*/` silently
  killed three rules; the symptom was a value reverting with no diff to explain it.
