# docx build — `bootcamp_roadmap_and_curriculum.md` → `.docx`

Regenerates the Word version of the Arabic curriculum. **Two steps, both required.**

```bash
npm install docx                      # once, anywhere
node build.js  ../../project-package/bootcamp_roadmap_and_curriculum.md  raw.docx
python rtl_patch.py raw.docx ../../project-package/bootcamp_roadmap_and_curriculum.docx
```

## Why the second step exists — the RTL trap

**`w:jc` in OOXML is `start`/`end`, not physical left/right.** In a paragraph carrying
`<w:bidi/>`, `w:jc="right"` means *end* — which in RTL renders on the **left**. Setting
`bidirectional: true` together with `alignment: RIGHT` therefore produces
**left-aligned Arabic**, which is exactly the bug this pair of scripts fixes.

So: RTL paragraphs set `<w:bidi/>` and **omit `w:jc` entirely** (default = start = right).

`rtl_patch.py` then adds what docx-js cannot express:

| patch | why |
|---|---|
| `<w:bidi/>` in `sectPr` | section/page reading order; without it tab stops and table column order stay LTR |
| `<w:bidi/>` + `<w:rtl/>` in `docDefaults` | anything unstyled inherits RTL |
| a real `Normal` style (RTL) | docx-js emits `basedOn="Normal"` headings but never defines `Normal` |
| RTL `TOC1`–`TOC3` styles | Word builds TOC entries from these **at open time**, so they must be RTL in `styles.xml` |

It also strips any `<w:jc w:val="right"/>` still sitting on a bidi paragraph, as a guard.

## Deliberately left LTR

Directory trees (detected by box-drawing characters `├ └ │ ─`) and shell commands.
Arabic prose inside fenced blocks (e.g. the journey template) **is** rendered RTL.

## Verifying

No LibreOffice/`pdftoppm` on the current machine, so there is no visual render step.
Check structurally instead — heading counts and table count must match the Markdown, and
`jc=right` must be **0**:

```bash
python - <<'PY'
import zipfile,re
x=zipfile.ZipFile('../../project-package/bootcamp_roadmap_and_curriculum.docx').read('word/document.xml').decode()
print('jc=right (must be 0):', x.count('<w:jc w:val="right"/>'))
print('bidi paragraphs:', x.count('<w:bidi/>'))
PY
```
