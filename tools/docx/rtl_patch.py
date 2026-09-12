"""Post-process a docx produced by docx-js to make it fully RTL.

docx-js exposes paragraph-level `bidirectional` but not:
  - section-level <w:bidi/>          (page/section reading order)
  - docDefaults <w:bidi/>            (inherited default for unstyled paragraphs)
  - RTL TOC styles                   (Word generates TOC entries from TOC1..TOC9 styles
                                      at open time, so they must be RTL in styles.xml)

It also strips any <w:jc w:val="right"/> left on a bidi paragraph: in OOXML w:jc is
start/end, so "right" means END, which in an RTL paragraph renders on the LEFT.
"""
import re
import shutil
import sys
import zipfile

src, dst = sys.argv[1], sys.argv[2]

zin = zipfile.ZipFile(src)
parts = {n: zin.read(n) for n in zin.namelist()}
zin.close()

report = {}

# ---- 1. document.xml : sectPr bidi + strip inverted jc on bidi paragraphs ----
doc = parts['word/document.xml'].decode('utf-8')

before_jc = doc.count('<w:jc w:val="right"/>')
# Only inside paragraph properties that also carry <w:bidi/>
def fix_ppr(m):
    ppr = m.group(0)
    if '<w:bidi/>' in ppr:
        ppr = ppr.replace('<w:jc w:val="right"/>', '')
    return ppr
doc = re.sub(r'<w:pPr>.*?</w:pPr>', fix_ppr, doc, flags=re.S)
report['jc_right_stripped'] = before_jc - doc.count('<w:jc w:val="right"/>')

# sectPr: <w:bidi/> must precede <w:docGrid/>; put it right after pgNumType/pgMar
def fix_sectpr(m):
    s = m.group(0)
    if '<w:bidi/>' in s:
        return s
    for anchor in ('<w:docGrid', '<w:pgNumType', '<w:pgMar'):
        idx = s.find(anchor)
        if idx != -1:
            if anchor == '<w:docGrid':
                return s[:idx] + '<w:bidi/>' + s[idx:]
            end = s.find('/>', idx) + 2
            return s[:end] + '<w:bidi/>' + s[end:]
    return s.replace('</w:sectPr>', '<w:bidi/></w:sectPr>')
doc, n = re.subn(r'<w:sectPr.*?</w:sectPr>', fix_sectpr, doc, flags=re.S)
report['sectPr_patched'] = n
parts['word/document.xml'] = doc.encode('utf-8')

# ---- 2. styles.xml : docDefaults bidi + RTL TOC styles ----
sty = parts['word/styles.xml'].decode('utf-8')

if '<w:pPrDefault><w:pPr>' in sty and '<w:bidi/>' not in sty.split('</w:pPrDefault>')[0]:
    sty = sty.replace('<w:pPrDefault><w:pPr>', '<w:pPrDefault><w:pPr><w:bidi/>', 1)
    report['docDefaults_bidi'] = True
# every run default should also be RTL-aware
if '<w:rPrDefault><w:rPr>' in sty and '<w:rtl/>' not in sty.split('</w:rPrDefault>')[0]:
    sty = sty.replace('</w:rPr></w:rPrDefault>', '<w:rtl/></w:rPr></w:rPrDefault>', 1)
    report['rPrDefault_rtl'] = True

toc_styles = ''.join(
    f'<w:style w:type="paragraph" w:styleId="TOC{i}">'
    f'<w:name w:val="toc {i}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>'
    f'<w:uiPriority w:val="39"/><w:unhideWhenUsed/><w:qFormat/>'
    f'<w:pPr><w:bidi/><w:spacing w:after="100"/>'
    f'<w:ind w:right="{(i - 1) * 220}"/></w:pPr>'
    f'<w:rPr><w:rtl/></w:rPr></w:style>'
    for i in range(1, 4)
)
if 'w:styleId="TOC1"' not in sty:
    sty = sty.replace('</w:styles>', toc_styles + '</w:styles>')
    report['toc_styles_added'] = 3

# a real Normal style so every basedOn="Normal" inherits RTL
if 'w:styleId="Normal"' not in sty:
    normal = ('<w:style w:type="paragraph" w:default="1" w:styleId="Normal">'
              '<w:name w:val="Normal"/><w:qFormat/>'
              '<w:pPr><w:bidi/></w:pPr><w:rPr><w:rtl/></w:rPr></w:style>')
    sty = sty.replace('<w:styles', '<w:styles', 1)
    idx = sty.find('</w:docDefaults>') + len('</w:docDefaults>')
    sty = sty[:idx] + normal + sty[idx:]
    report['normal_style_added'] = True

parts['word/styles.xml'] = sty.encode('utf-8')

# ---- write ----
zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
for name, data in parts.items():
    zout.writestr(name, data)
zout.close()

for k, v in report.items():
    print(f'  {k}: {v}')
