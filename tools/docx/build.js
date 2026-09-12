const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ShadingType: ST,
  TableOfContents, LevelFormat, convertInchesToTwip, PageOrientation, Header, Footer,
  PageNumber, ExternalHyperlink,
} = require('docx');

const SRC = process.argv[2];
const OUT = process.argv[3];
const md = fs.readFileSync(SRC, 'utf8');

const FONT = 'Segoe UI';
const CONTENT_W = 9026;           // A4 portrait minus 1" margins each side, in DXA
const ACCENT = '0F766E';          // teal, matches the project's design tokens
const MUTED  = '5B6770';
const CALLOUT_BG = 'F1F5F9';
const QUOTE_BG   = 'F8FAFC';
const CODE_BG    = 'F3F4F6';
const TBL_HEAD   = 'E2E8F0';

/* ---------- inline formatting ---------- */
// returns TextRun[] for one line of markdown-ish inline content
function runs(text, base = {}) {
  if (text == null) return [new TextRun({ text: '', rightToLeft: true, font: FONT, ...base })];
  let t = text
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/<\/?(strong|em|u|span|small)[^>]*>/gi, '');
  // links -> keep the label only (anchor links do not survive the docx conversion)
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  const out = [];
  // split on **bold**, *italic*, `code`
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
  let last = 0, m;
  const push = (s, extra) => {
    if (s === '') return;
    out.push(new TextRun({ text: s, rightToLeft: true, font: FONT, size: 21, ...base, ...extra }));
  };
  while ((m = re.exec(t)) !== null) {
    push(t.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) push(tok.slice(2, -2), { bold: true });
    else if (tok.startsWith('`')) push(tok.slice(1, -1), { font: 'Consolas', color: ACCENT, size: 19 });
    else push(tok.slice(1, -1), { italics: true });
    last = re.lastIndex;
  }
  push(t.slice(last));
  if (out.length === 0) push('');
  return out;
}

const P = (text, opts = {}) => new Paragraph({
  bidirectional: true,
  
  spacing: { after: 100, line: 300 },
  children: runs(text, opts.run || {}),
  ...opts.para,
});

/* ---------- table builder ---------- */
function buildTable(rows) {
  if (!rows.length) return null;
  const cells0 = rows[0];
  const n = Math.max(...rows.map(r => r.length));
  const colW = Math.floor(CONTENT_W / n);
  const widths = Array(n).fill(colW);
  const mkCell = (txt, head) => new TableCell({
    width: { size: colW, type: WidthType.DXA },
    shading: head ? { type: ShadingType.CLEAR, fill: TBL_HEAD, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({
      bidirectional: true,
      
      spacing: { after: 0, line: 280 },
      children: runs(txt, head ? { bold: true } : {}),
    })],
  });
  const trs = rows.map((r, i) => new TableRow({
    tableHeader: i === 0,
    children: Array.from({ length: n }, (_, c) => mkCell(r[c] ?? '', i === 0)),
  }));
  return new Table({
    visuallyRightToLeft: true,
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: trs,
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
      left:   { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
      right:  { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      insideVertical:   { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
    },
  });
}

/* ---------- walk the markdown ---------- */
const lines = md.split(/\r?\n/);
const body = [];
let i = 0;
let inDetails = false;
let inComment = false;

const flushTable = (buf) => { const t = buf.length ? buildTable(buf) : null; if (t) { body.push(t); body.push(P('', { para: { spacing: { after: 120 } } })); } };

while (i < lines.length) {
  let ln = lines[i];

  // html comments (may span lines)
  if (inComment) { if (ln.includes('-->')) inComment = false; i++; continue; }
  if (/^\s*<!--/.test(ln)) { if (!ln.includes('-->')) inComment = true; i++; continue; }

  // wrapper div
  if (/^\s*<\/?div/i.test(ln)) { i++; continue; }
  // lone <br>
  if (/^\s*<br\s*\/?>\s*$/i.test(ln)) { i++; continue; }

  // details / summary
  if (/^\s*<details>/i.test(ln)) { inDetails = true; i++; continue; }
  if (/^\s*<\/details>/i.test(ln)) {
    inDetails = false;
    body.push(new Paragraph({
      bidirectional: true, spacing: { after: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT } },
      children: [new TextRun({ text: '', font: FONT })],
    }));
    i++; continue;
  }
  if (/^\s*<summary>/i.test(ln)) {
    const txt = ln.replace(/<\/?summary>/gi, '').trim();
    body.push(new Paragraph({
      bidirectional: true, 
      spacing: { before: 180, after: 80 },
      shading: { type: ShadingType.CLEAR, fill: CALLOUT_BG, color: 'auto' },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: ACCENT } },
      children: [
        new TextRun({ text: '▸  ', font: FONT, color: ACCENT, bold: true, size: 21 }),
        ...runs(txt, { bold: true, color: ACCENT }),
      ],
    }));
    i++; continue;
  }

  // headings
  let h = /^(#{2,5})\s+(.*)$/.exec(ln);
  if (h) {
    const lvl = h[1].length;               // 2..5
    const map = { 2: HeadingLevel.HEADING_1, 3: HeadingLevel.HEADING_2, 4: HeadingLevel.HEADING_3, 5: HeadingLevel.HEADING_4 };
    const sizes = { 2: 32, 3: 26, 4: 23, 5: 21 };
    body.push(new Paragraph({
      heading: map[lvl],
      bidirectional: true,
      
      spacing: { before: lvl === 2 ? 360 : 240, after: 120 },
      pageBreakBefore: lvl === 2,
      children: runs(h[2], { bold: true, size: sizes[lvl], color: lvl <= 3 ? ACCENT : '1F2937' }),
    }));
    i++; continue;
  }

  // fenced code
  if (/^\s*```/.test(ln)) {
    i++;
    const buf = [];
    while (i < lines.length && !/^\s*```/.test(lines[i])) { buf.push(lines[i]); i++; }
    i++;
    // Arabic-content blocks (e.g. the journey template) read RTL; shell commands
    // and directory trees stay LTR.
    const joined = buf.join('');
    const ar = (joined.match(/[؀-ۿ]/g) || []).length;
    const la = (joined.match(/[A-Za-z]/g) || []).length;
    // Directory trees and command blocks stay LTR even when annotated in Arabic:
    // box-drawing characters and paths mirror badly under RTL.
    const isTree = ['├','└','│','─'].some(function (c) { return joined.indexOf(c) >= 0; });
    const isArabicBlock = ar > 0 && ar >= la && !isTree;
    body.push(new Paragraph({
      bidirectional: isArabicBlock,
      ...(isArabicBlock ? {} : { alignment: AlignmentType.LEFT }),
      spacing: { before: 120, after: 120, line: 260 },
      shading: { type: ShadingType.CLEAR, fill: CODE_BG, color: 'auto' },
      border: {
        top:{style:BorderStyle.SINGLE,size:1,color:'D1D5DB'}, bottom:{style:BorderStyle.SINGLE,size:1,color:'D1D5DB'},
        left:{style:BorderStyle.SINGLE,size:1,color:'D1D5DB'}, right:{style:BorderStyle.SINGLE,size:1,color:'D1D5DB'},
      },
      children: buf.flatMap((l, k) => [
        ...(k ? [new TextRun({ break: 1 })] : []),
        new TextRun({ text: l, font: isArabicBlock ? FONT : 'Consolas', size: isArabicBlock ? 20 : 18, rightToLeft: isArabicBlock }),
      ]),
    }));
    continue;
  }

  // tables
  if (/^\s*\|/.test(ln)) {
    const buf = [];
    while (i < lines.length && /^\s*\|/.test(lines[i])) {
      const cells = lines[i].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(s => s.trim());
      if (!cells.every(c => /^:?-{2,}:?$/.test(c) || c === '')) buf.push(cells);
      i++;
    }
    flushTable(buf);
    continue;
  }

  // horizontal rule
  if (/^\s*---\s*$/.test(ln)) {
    body.push(new Paragraph({
      bidirectional: true, spacing: { before: 120, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' } },
      children: [new TextRun({ text: '', font: FONT })],
    }));
    i++; continue;
  }

  // blockquote
  if (/^\s*>/.test(ln)) {
    const buf = [];
    while (i < lines.length && /^\s*>/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
    const txt = buf.filter(s => s.trim() !== '');
    if (txt.length === 0) { continue; }
    txt.forEach((t, k) => {
      body.push(new Paragraph({
        bidirectional: true, 
        spacing: { before: k === 0 ? 120 : 0, after: k === txt.length - 1 ? 120 : 40, line: 300 },
        indent: { right: 220 },
        shading: { type: ShadingType.CLEAR, fill: QUOTE_BG, color: 'auto' },
        border: { right: { style: BorderStyle.SINGLE, size: 12, color: ACCENT } },
        children: runs(t),
      }));
    });
    continue;
  }

  // agenda lines: "&nbsp;&nbsp; - [x](#y) — 10 د"
  if (/^&nbsp;/.test(ln)) {
    const t = ln.replace(/&nbsp;/g, '').replace(/^\s*-\s*/, '').trim();
    if (t) body.push(new Paragraph({
      bidirectional: true, 
      spacing: { after: 40, line: 280 },
      indent: { right: 620 },
      children: [new TextRun({ text: '– ', font: FONT, color: MUTED, size: 21 }), ...runs(t)],
    }));
    i++; continue;
  }

  // ordered list item
  let ol = /^(\s*)(\d+)\.\s+(.*)$/.exec(ln);
  if (ol) {
    const depth = Math.floor(ol[1].length / 3);
    body.push(new Paragraph({
      bidirectional: true, 
      spacing: { after: 60, line: 300 },
      indent: { right: 300 + depth * 300, hanging: 240 },
      children: [new TextRun({ text: ol[2] + '.  ', font: FONT, bold: true, color: ACCENT, size: 21, rightToLeft: true }), ...runs(ol[3])],
    }));
    i++; continue;
  }

  // bullet
  let ul = /^(\s*)[-*]\s+(.*)$/.exec(ln);
  if (ul) {
    const depth = Math.floor(ul[1].length / 2);
    body.push(new Paragraph({
      bidirectional: true, 
      numbering: { reference: 'md-bullets', level: Math.min(depth, 2) },
      spacing: { after: 60, line: 300 },
      children: runs(ul[2]),
    }));
    i++; continue;
  }

  // blank
  if (ln.trim() === '') { i++; continue; }

  // plain paragraph
  body.push(P(ln.trim(), { para: { spacing: { after: 120, line: 300 } } }));
  i++;
}

/* ---------- cover + TOC ---------- */
const cover = [
  new Paragraph({ spacing: { before: 2600, after: 0 }, alignment: AlignmentType.CENTER, bidirectional: true,
    children: [new TextRun({ text: 'خارطة الطريق والمنهج', font: FONT, size: 56, bold: true, color: ACCENT, rightToLeft: true })] }),
  new Paragraph({ spacing: { before: 160, after: 0 }, alignment: AlignmentType.CENTER, bidirectional: true,
    children: [new TextRun({ text: 'معسكر بناء المنتجات الأولية (MVP) باستخدام Claude', font: FONT, size: 28, color: '1F2937', rightToLeft: true })] }),
  new Paragraph({ spacing: { before: 400, after: 0 }, alignment: AlignmentType.CENTER, bidirectional: true,
    children: [new TextRun({ text: '10 أيام · 4 ساعات يوميًّا · 29 مهمّة', font: FONT, size: 24, color: MUTED, rightToLeft: true })] }),
  new Paragraph({ spacing: { before: 900 }, alignment: AlignmentType.CENTER, bidirectional: true,
    children: [new TextRun({ text: new Date().toISOString().slice(0, 10), font: FONT, size: 20, color: MUTED })] }),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ spacing: { after: 200 }, bidirectional: true,
    children: [new TextRun({ text: 'المحتويات', font: FONT, size: 32, bold: true, color: ACCENT, rightToLeft: true })] }),
  new TableOfContents('المحتويات', { hyperlink: true, headingStyleRange: '1-3' }),
  new Paragraph({ children: [new PageBreak()] }),
];

const doc = new Document({
  creator: 'SAG Tech Bootcamp',
  title: 'خارطة الطريق والمنهج — معسكر MVP',
  description: 'Arabic bootcamp roadmap and curriculum',
  features: { updateFields: true },
  numbering: {
    config: [{
      reference: 'md-bullets',
      levels: [0, 1, 2].map(l => ({
        level: l,
        format: LevelFormat.BULLET,
        text: ['•', '◦', '▪'][l],
        
        style: { paragraph: { indent: { right: convertInchesToTwip(0.25 + l * 0.25), hanging: 240 } } },
      })),
    }],
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: 21 }, paragraph: { spacing: { line: 300 } } },
    },
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER, bidirectional: true,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: MUTED })],
      })] }),
    },
    children: [...cover, ...body],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log('wrote ' + OUT + ' (' + (buf.length / 1024).toFixed(0) + ' KB)');
  console.log('body elements: ' + body.length);
});
