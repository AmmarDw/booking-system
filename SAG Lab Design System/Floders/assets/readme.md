# assets/

Deliberately empty of brand marks.

No logo artwork, icon set or font binaries were supplied with the brief, and this system does not
draw or approximate a real company mark. Drop files here when they arrive:

- `logo-sag-lab.svg` — the ساج لاب calligraphic wordmark (two lines). Then simplify
  `components/elements/LogoZone.jsx` to render it.
- `logo-sag-tech.svg` — the ساج التقنية / SAG TECH circular monogram. Then update
  `components/elements/EndorsementMark.jsx`.
- `icons/` — an in-house 2px line set, if one exists, replacing the Lucide CDN dependency
  used by `components/elements/Icon.jsx`.

Fonts are loaded from Google Fonts (IBM Plex Sans Arabic / Sans / Mono) rather than vendored;
if licensed binaries are preferred, add them here and rewrite `tokens/fonts.css` with
`@font-face` rules.
