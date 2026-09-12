/* @ds-bundle: {"format":4,"namespace":"SAGLabDesignSystem_5a6e2d","components":[{"name":"AgendaRow","sourcePath":"components/elements/AgendaRow.jsx"},{"name":"Callout","sourcePath":"components/elements/Callout.jsx"},{"name":"DayProgress","sourcePath":"components/elements/DayProgress.jsx"},{"name":"EndorsementMark","sourcePath":"components/elements/EndorsementMark.jsx"},{"name":"FileTree","sourcePath":"components/elements/FileTree.jsx"},{"name":"FooterBar","sourcePath":"components/elements/FooterBar.jsx"},{"name":"Icon","sourcePath":"components/elements/Icon.jsx"},{"name":"LogoZone","sourcePath":"components/elements/LogoZone.jsx"},{"name":"MediaFrame","sourcePath":"components/elements/MediaFrame.jsx"},{"name":"PresenterBlock","sourcePath":"components/elements/PresenterBlock.jsx"},{"name":"SectionBadge","sourcePath":"components/elements/SectionBadge.jsx"},{"name":"SkillCard","sourcePath":"components/elements/SkillCard.jsx"},{"name":"StepChip","sourcePath":"components/elements/StepChip.jsx"},{"name":"TimingPill","sourcePath":"components/elements/TimingPill.jsx"},{"name":"SlideClosing","sourcePath":"components/frames/SlideClosing.jsx"},{"name":"SlideContent","sourcePath":"components/frames/SlideContent.jsx"},{"name":"SlideFrame","sourcePath":"components/frames/SlideFrame.jsx"},{"name":"SlideMedia","sourcePath":"components/frames/SlideMedia.jsx"},{"name":"SlideQuote","sourcePath":"components/frames/SlideQuote.jsx"},{"name":"SlideSection","sourcePath":"components/frames/SlideSection.jsx"},{"name":"SlideSplit","sourcePath":"components/frames/SlideSplit.jsx"},{"name":"SlideSteps","sourcePath":"components/frames/SlideSteps.jsx"},{"name":"SlideTable","sourcePath":"components/frames/SlideTable.jsx"},{"name":"SlideTitle","sourcePath":"components/frames/SlideTitle.jsx"}],"sourceHashes":{"components/elements/AgendaRow.jsx":"fbef93e40bcc","components/elements/Callout.jsx":"9d8fd1415e0d","components/elements/DayProgress.jsx":"282af46906b3","components/elements/EndorsementMark.jsx":"8bf23f8b97a9","components/elements/FileTree.jsx":"ce11c5b743c4","components/elements/FooterBar.jsx":"73f0990e8ace","components/elements/Icon.jsx":"183ddb069e60","components/elements/LogoZone.jsx":"6f3be8679f3f","components/elements/MediaFrame.jsx":"02ea6da6b12a","components/elements/PresenterBlock.jsx":"d225a910a765","components/elements/SectionBadge.jsx":"489e57343c91","components/elements/SkillCard.jsx":"8a42e1e754a2","components/elements/StepChip.jsx":"8a32ac90b106","components/elements/TimingPill.jsx":"5d05c9363bad","components/frames/SlideClosing.jsx":"94ce1963fff8","components/frames/SlideContent.jsx":"366c054fe71f","components/frames/SlideFrame.jsx":"a0f6c75602b5","components/frames/SlideMedia.jsx":"c2ce968ee83b","components/frames/SlideQuote.jsx":"8396fe174b0a","components/frames/SlideSection.jsx":"107239e771c3","components/frames/SlideSplit.jsx":"868242bbcf5a","components/frames/SlideSteps.jsx":"90dd7e000297","components/frames/SlideTable.jsx":"9b2c0464e4f4","components/frames/SlideTitle.jsx":"e6cec9ea3b2a","slides/deck.data.js":"289a10aee576"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SAGLabDesignSystem_5a6e2d = window.SAGLabDesignSystem_5a6e2d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/elements/DayProgress.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DayProgress({
  totalDays = 10,
  activeDay = 1,
  within,
  label,
  className = "",
  style,
  ...rest
}) {
  const days = [];
  for (let i = 1; i <= totalDays; i++) {
    days.push(/*#__PURE__*/React.createElement("span", {
      key: "d" + i,
      className: "sag-days__day",
      "data-state": i < activeDay ? "done" : i === activeDay ? "active" : "upcoming"
    }));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sag-days " + className,
    dir: "rtl",
    style: style,
    role: "img",
    "aria-label": label || "اليوم " + activeDay + " من " + totalDays
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sag-days__label"
  }, label || "اليوم " + activeDay + " / " + totalDays), /*#__PURE__*/React.createElement("span", {
    className: "sag-days__track"
  }, days), within != null ? /*#__PURE__*/React.createElement("span", {
    className: "sag-days__within"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sag-days__withinFill",
    style: {
      width: Math.max(0, Math.min(100, within)) + "%"
    }
  })) : null);
}
Object.assign(__ds_scope, { DayProgress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/DayProgress.jsx", error: String((e && e.message) || e) }); }

// components/elements/EndorsementMark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The endorsing company mark: ساج التقنية / SAG TECH. The real mark is a circular
 *  navy monogram with a white spiral; no artwork was supplied, so the circle carries
 *  the letter S as a stand-in. Swap in the SVG when available. */
function EndorsementMark({
  size = "footnote",
  showText = true,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "sag-endorse " + className,
    "data-size": size,
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sag-endorse__mark",
    "aria-hidden": "true"
  }, "S"), showText ? /*#__PURE__*/React.createElement("span", {
    className: "sag-endorse__text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sag-endorse__lat"
  }, "SAG TECH"), /*#__PURE__*/React.createElement("span", {
    className: "sag-endorse__ar"
  }, "\u0633\u0627\u062C \u0627\u0644\u062A\u0642\u0646\u064A\u0629")) : null);
}
Object.assign(__ds_scope, { EndorsementMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/EndorsementMark.jsx", error: String((e && e.message) || e) }); }

// components/elements/FileTree.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Directory trees are forced LTR: box-drawing characters and paths mirror badly
 *  under RTL. Arabic annotations sit start-aligned beside the block. */
function FileTree({
  tree,
  notes = [],
  className = "",
  style,
  ...rest
}) {
  const hasNotes = notes && notes.length > 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sag-tree " + className,
    "data-notes": hasNotes ? "true" : "false",
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement("pre", {
    className: "sag-tree__code",
    dir: "ltr"
  }, tree), hasNotes ? /*#__PURE__*/React.createElement("ul", {
    className: "sag-tree__notes"
  }, notes.map(function (n, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: "n" + i,
      className: "sag-tree__note"
    }, n);
  })) : null);
}
Object.assign(__ds_scope, { FileTree });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/FileTree.jsx", error: String((e && e.message) || e) }); }

// components/elements/FooterBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FooterBar({
  day,
  slideNumber,
  progress,
  showMark = true,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sag-footer " + className,
    dir: "rtl",
    style: style
  }, rest), showMark ? /*#__PURE__*/React.createElement(__ds_scope.EndorsementMark, {
    size: "footnote"
  }) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, progress), /*#__PURE__*/React.createElement("span", {
    className: "sag-footer__meta"
  }, day ? /*#__PURE__*/React.createElement("span", {
    className: "sag-footer__day"
  }, day) : null, day && slideNumber != null ? /*#__PURE__*/React.createElement("span", {
    className: "sag-footer__sep"
  }) : null, slideNumber != null ? /*#__PURE__*/React.createElement("span", {
    className: "sag-footer__num"
  }, slideNumber) : null));
}
Object.assign(__ds_scope, { FooterBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/FooterBar.jsx", error: String((e && e.message) || e) }); }

// components/elements/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function toPascal(n) {
  return String(n).split(/[-_\s]+/).map(function (p) {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).join("");
}

/** Line icon from the Lucide set (2px stroke, rounded caps). Requires the Lucide
 *  UMD script on the page: https://unpkg.com/lucide@0.446.0/dist/umd/lucide.js */
function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  className = "",
  style,
  ...rest
}) {
  const lucide = typeof window !== "undefined" ? window.lucide : null;
  const set = lucide && lucide.icons ? lucide.icons : null;
  const node = set ? set[toPascal(name)] || set[name] : null;
  // Lucide ships each icon as ["svg", attrs, childTuples]. Anything else is already a tuple list.
  const tuples = !node ? [] : node[0] === "svg" ? node[2] || [] : node;
  const children = tuples.map(function (t, i) {
    const attrs = Object.assign({
      key: "i" + i
    }, t[1] || {});
    return React.createElement(t[0], attrs);
  });
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: "sag-icon " + className,
    style: Object.assign({
      display: "inline-block",
      flex: "0 0 auto"
    }, style),
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false"
  }, rest), children);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/Icon.jsx", error: String((e && e.message) || e) }); }

// components/elements/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SAG_CALLOUT_GLYPH = {
  info: "info",
  warning: "alert-triangle",
  rule: "check-circle"
};
const SAG_CALLOUT_LABEL = {
  info: "ملاحظة",
  warning: "تنبيه",
  rule: "قاعدة"
};
function Callout({
  tone = "info",
  label,
  children,
  icon,
  className = "",
  style,
  ...rest
}) {
  const glyph = icon || SAG_CALLOUT_GLYPH[tone] || "info";
  const heading = label !== undefined ? label : SAG_CALLOUT_LABEL[tone];
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sag-callout " + className,
    "data-tone": tone,
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: 28,
    className: "sag-callout__glyph"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sag-callout__body"
  }, heading ? /*#__PURE__*/React.createElement("span", {
    className: "sag-callout__label"
  }, heading) : null, /*#__PURE__*/React.createElement("span", {
    className: "sag-callout__text"
  }, children)));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/Callout.jsx", error: String((e && e.message) || e) }); }

// components/elements/LogoZone.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The lead mark: ساج لاب. No logo binaries were supplied with this brand, so the
 *  wordmark is type-set in IBM Plex Sans Arabic Bold. Replace with the real
 *  calligraphic artwork when it is available (see readme.md > Assets). */
function LogoZone({
  size = "standard",
  lines = ["ساج", "لاب"],
  showNote = false,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "sag-logo " + className,
    "data-size": size,
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sag-logo__wordmark"
  }, lines.map(function (l, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: "l" + i
    }, l);
  })), showNote ? /*#__PURE__*/React.createElement("span", {
    className: "sag-logo__placeholder"
  }, "\u0634\u0639\u0627\u0631 \u0646\u0635\u0651\u064A \u0645\u0624\u0642\u0651\u062A \u2014 \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0623\u0635\u0644\u064A") : null);
}
Object.assign(__ds_scope, { LogoZone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/LogoZone.jsx", error: String((e && e.message) || e) }); }

// components/elements/MediaFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MediaFrame({
  src,
  alt = "",
  video = false,
  poster,
  caption,
  placeholder = "لقطة شاشة / GIF",
  callouts = [],
  ratio = "fill",
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("figure", _extends({
    className: "sag-media-frame " + className,
    "data-ratio": ratio,
    dir: "rtl",
    style: Object.assign({
      margin: 0
    }, style)
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-media-frame__box"
  }, src && video ? /*#__PURE__*/React.createElement("video", {
    src: src,
    poster: poster,
    muted: true,
    loop: true,
    playsInline: true
  }) : null, src && !video ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt
  }) : null, !src ? /*#__PURE__*/React.createElement("span", {
    className: "sag-media-frame__ph"
  }, placeholder) : null, callouts.map(function (c, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: "c" + i,
      className: "sag-media-frame__dot",
      style: {
        insetInlineStart: c.x,
        top: c.y
      }
    }, c.n != null ? c.n : i + 1);
  })), caption ? /*#__PURE__*/React.createElement("figcaption", {
    className: "sag-media-frame__caption"
  }, caption) : null);
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/elements/PresenterBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PresenterBlock({
  name,
  role,
  org,
  photo,
  alt = "",
  size = "default",
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sag-presenter " + className,
    "data-size": size,
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-presenter__photo"
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: alt || name || ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "sag-presenter__ph"
  }, "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u062F\u0631\u0651\u0628")), /*#__PURE__*/React.createElement("div", {
    className: "sag-presenter__text"
  }, name ? /*#__PURE__*/React.createElement("span", {
    className: "sag-presenter__name"
  }, name) : null, role ? /*#__PURE__*/React.createElement("span", {
    className: "sag-presenter__role"
  }, role) : null, org ? /*#__PURE__*/React.createElement("span", {
    className: "sag-presenter__org"
  }, org) : null));
}
Object.assign(__ds_scope, { PresenterBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/PresenterBlock.jsx", error: String((e && e.message) || e) }); }

// components/elements/SectionBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionBadge({
  kind = "القسم",
  number,
  tone = "solid",
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "sag-badge " + className,
    "data-tone": tone,
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", null, kind), number != null ? /*#__PURE__*/React.createElement("span", {
    className: "sag-badge__num"
  }, number) : null);
}
Object.assign(__ds_scope, { SectionBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/SectionBadge.jsx", error: String((e && e.message) || e) }); }

// components/elements/SkillCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SkillCard({
  text,
  icon = "check",
  iconNode,
  state = "default",
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sag-skill " + className,
    "data-state": state,
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sag-skill__icon"
  }, iconNode ? iconNode : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 28
  })), /*#__PURE__*/React.createElement("span", {
    className: "sag-skill__text"
  }, text));
}
Object.assign(__ds_scope, { SkillCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/SkillCard.jsx", error: String((e && e.message) || e) }); }

// components/elements/StepChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StepChip({
  n,
  state = "upcoming",
  size = "default",
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "sag-chip " + className,
    "data-state": state,
    "data-size": size,
    style: style,
    "aria-current": state === "active" ? "step" : undefined
  }, rest), state === "done" ? "\u2713" : n);
}
Object.assign(__ds_scope, { StepChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/StepChip.jsx", error: String((e && e.message) || e) }); }

// components/elements/TimingPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TimingPill({
  label,
  tone = "default",
  icon = "clock",
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "sag-timing " + className,
    "data-tone": tone,
    dir: "rtl",
    style: style
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    className: "sag-timing__glyph"
  }) : null, /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { TimingPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/TimingPill.jsx", error: String((e && e.message) || e) }); }

// components/elements/AgendaRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AgendaRow({
  name,
  what,
  duration,
  state = "default",
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sag-agenda " + className,
    "data-state": state,
    dir: "rtl",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "sag-agenda__name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "sag-agenda__what"
  }, what), duration ? /*#__PURE__*/React.createElement(__ds_scope.TimingPill, {
    label: duration,
    tone: state === "active" ? "accent" : "default"
  }) : /*#__PURE__*/React.createElement("span", null));
}
Object.assign(__ds_scope, { AgendaRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/elements/AgendaRow.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Base 16:9 slide frame. Fixed 1920x1080, 5% safe margins, footer zone reserved.
 *  Nothing inside a frame ever scrolls — split content across 1/2 and 2/2 slides. */
function SlideFrame({
  surface = "light",
  day,
  slideNumber,
  progress,
  footer,
  showMark = true,
  className = "",
  children,
  style,
  ...rest
}) {
  const foot = footer !== undefined ? footer : /*#__PURE__*/React.createElement(__ds_scope.FooterBar, {
    day: day,
    slideNumber: slideNumber,
    progress: progress,
    showMark: showMark
  });
  return /*#__PURE__*/React.createElement("section", _extends({
    className: "sag-slide " + className,
    dir: "rtl",
    "data-surface": surface === "dark" ? "dark" : undefined,
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__body"
  }, children), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__foot"
  }, foot));
}
Object.assign(__ds_scope, { SlideFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideFrame.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideClosing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideClosing({
  title,
  accomplished = [],
  next = [],
  accomplishedLabel = "ما أنجزناه اليوم",
  nextLabel = "ما ينتظرنا غدًا",
  surface = "dark",
  day,
  slideNumber,
  progress,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber,
    progress: progress
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sag-slide__title"
  }, title || "نهاية اليوم"), /*#__PURE__*/React.createElement("span", {
    className: "sag-slide__rule"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sag-closing__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sag-closing__group"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "sag-closing__label"
  }, accomplishedLabel), /*#__PURE__*/React.createElement("div", {
    className: "sag-skill-grid",
    style: {
      "--cols": 1
    }
  }, accomplished.map(function (s, i) {
    return /*#__PURE__*/React.createElement(__ds_scope.SkillCard, {
      key: "a" + i,
      state: "done",
      icon: s.icon || "check",
      text: s.text || s
    });
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sag-closing__group"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "sag-closing__label"
  }, nextLabel), /*#__PURE__*/React.createElement("ul", {
    className: "sag-bullets"
  }, next.map(function (n, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: "n" + i,
      className: "sag-bullets__item"
    }, n);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LogoZone, {
    size: "footnote"
  })))));
}
Object.assign(__ds_scope, { SlideClosing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideClosing.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideContent.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideContent({
  title,
  lead,
  bullets = [],
  focusIndex,
  badge,
  children,
  surface = "light",
  day,
  slideNumber,
  progress,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber,
    progress: progress
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__head"
  }, badge ? /*#__PURE__*/React.createElement(__ds_scope.SectionBadge, badge) : null, /*#__PURE__*/React.createElement("h2", {
    className: "sag-slide__title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "sag-slide__rule"
  }), lead ? /*#__PURE__*/React.createElement("p", {
    className: "sag-slide__lead"
  }, lead) : null), bullets.length ? /*#__PURE__*/React.createElement("ul", {
    className: "sag-bullets"
  }, bullets.map(function (b, i) {
    const focused = focusIndex != null && focusIndex === i;
    return /*#__PURE__*/React.createElement("li", {
      key: "b" + i,
      className: "sag-bullets__item",
      "data-focus": focused ? "true" : undefined
    }, b);
  })) : null, children);
}
Object.assign(__ds_scope, { SlideContent });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideContent.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideMedia.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideMedia({
  title,
  instruction,
  media = {},
  badge,
  layout = "stacked",
  surface = "light",
  day,
  slideNumber,
  ...rest
}) {
  const stacked = layout === "stacked";
  // Stacked is the media-dominant default: the instruction line replaces the frame caption,
  // so the whole first row belongs to the image (>=55% of the frame).
  const mediaProps = stacked ? Object.assign({}, media, {
    caption: undefined
  }) : media;
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber,
    className: "sag-media"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__head " + (stacked ? "sag-media__head" : "")
  }, badge ? /*#__PURE__*/React.createElement(__ds_scope.SectionBadge, badge) : null, title ? /*#__PURE__*/React.createElement("h2", {
    className: "sag-slide__title"
  }, title) : null), /*#__PURE__*/React.createElement("div", {
    className: "sag-media__inner",
    "data-layout": layout
  }, /*#__PURE__*/React.createElement(__ds_scope.MediaFrame, mediaProps), /*#__PURE__*/React.createElement("div", {
    className: "sag-media__side"
  }, instruction ? /*#__PURE__*/React.createElement("p", {
    className: "sag-media__instruction"
  }, instruction) : null)));
}
Object.assign(__ds_scope, { SlideMedia });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideMedia.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideQuote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideQuote({
  text,
  attribution,
  tone = "default",
  surface = "light",
  day,
  slideNumber,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber,
    className: "sag-quote",
    "data-tone": tone
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-quote__inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sag-quote__mark"
  }), /*#__PURE__*/React.createElement("p", {
    className: "sag-quote__text"
  }, text), attribution ? /*#__PURE__*/React.createElement("p", {
    className: "sag-quote__attr"
  }, attribution) : null));
}
Object.assign(__ds_scope, { SlideQuote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideQuote.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideSection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideSection({
  number,
  title,
  subtitle,
  surface = "dark",
  day,
  slideNumber,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber,
    className: "sag-section"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-section__inner"
  }, number != null ? /*#__PURE__*/React.createElement("span", {
    className: "sag-section__num"
  }, number) : null, /*#__PURE__*/React.createElement("h2", {
    className: "sag-section__title"
  }, title), subtitle ? /*#__PURE__*/React.createElement("p", {
    className: "sag-section__sub"
  }, subtitle) : null));
}
Object.assign(__ds_scope, { SlideSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideSection.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideSplit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideSplit({
  title,
  badge,
  start,
  end,
  surface = "light",
  day,
  slideNumber,
  plain = false,
  ...rest
}) {
  function col(c) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sag-split__col",
      "data-plain": plain ? "true" : undefined
    }, c && c.label ? /*#__PURE__*/React.createElement("h3", {
      className: "sag-split__label"
    }, c.label) : null, c && c.items ? /*#__PURE__*/React.createElement("ul", {
      className: "sag-bullets"
    }, c.items.map(function (b, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: "i" + i,
        className: "sag-bullets__item"
      }, b);
    })) : null, c ? c.children : null);
  }
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__head"
  }, badge ? /*#__PURE__*/React.createElement(__ds_scope.SectionBadge, badge) : null, title ? /*#__PURE__*/React.createElement("h2", {
    className: "sag-slide__title"
  }, title) : null), /*#__PURE__*/React.createElement("div", {
    className: "sag-split"
  }, col(start), col(end)));
}
Object.assign(__ds_scope, { SlideSplit });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideSplit.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideSteps.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideSteps({
  title,
  badge,
  steps = [],
  activeIndex,
  surface = "light",
  day,
  slideNumber,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__head"
  }, badge ? /*#__PURE__*/React.createElement(__ds_scope.SectionBadge, badge) : null, /*#__PURE__*/React.createElement("h2", {
    className: "sag-slide__title"
  }, title)), /*#__PURE__*/React.createElement("ol", {
    className: "sag-steps"
  }, steps.map(function (s, i) {
    const state = s.state ? s.state : activeIndex == null ? "upcoming" : i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
    return /*#__PURE__*/React.createElement("li", {
      key: "s" + i,
      className: "sag-steps__row"
    }, /*#__PURE__*/React.createElement(__ds_scope.StepChip, {
      n: i + 1,
      state: state
    }), /*#__PURE__*/React.createElement("span", {
      className: "sag-steps__text"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sag-steps__title"
    }, s.title), s.note ? /*#__PURE__*/React.createElement("span", {
      className: "sag-steps__note"
    }, s.note) : null), s.thumb ? /*#__PURE__*/React.createElement(__ds_scope.MediaFrame, {
      src: s.thumb,
      ratio: "16x9",
      className: "sag-steps__thumb"
    }) : /*#__PURE__*/React.createElement("span", null));
  })));
}
Object.assign(__ds_scope, { SlideSteps });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideSteps.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideTable({
  title,
  badge,
  caption,
  columns = [],
  rows = [],
  focusRow,
  surface = "light",
  day,
  slideNumber,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-slide__head"
  }, badge ? /*#__PURE__*/React.createElement(__ds_scope.SectionBadge, badge) : null, /*#__PURE__*/React.createElement("h2", {
    className: "sag-slide__title"
  }, title)), /*#__PURE__*/React.createElement("table", {
    className: "sag-table",
    dir: "rtl"
  }, caption ? /*#__PURE__*/React.createElement("caption", null, caption) : null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(function (c, i) {
    return /*#__PURE__*/React.createElement("th", {
      key: "h" + i,
      scope: "col",
      style: c && c.width ? {
        width: c.width
      } : undefined
    }, c && c.label !== undefined ? c.label : c);
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map(function (r, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: "r" + i,
      "data-focus": focusRow === i ? "true" : undefined
    }, r.map(function (cell, j) {
      const c = columns[j];
      return /*#__PURE__*/React.createElement("td", {
        key: "c" + j,
        "data-num": c && c.numeric ? "true" : undefined
      }, cell);
    }));
  }))));
}
Object.assign(__ds_scope, { SlideTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideTable.jsx", error: String((e && e.message) || e) }); }

// components/frames/SlideTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SlideTitle({
  program,
  subtitle,
  presenter,
  surface = "dark",
  day,
  slideNumber,
  wordmarkLines,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.SlideFrame, _extends({
    surface: surface,
    day: day,
    slideNumber: slideNumber,
    className: "sag-title"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "sag-title__inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.LogoZone, {
    size: "hero",
    lines: wordmarkLines
  }), program ? /*#__PURE__*/React.createElement("h1", {
    className: "sag-title__display"
  }, program) : null, subtitle ? /*#__PURE__*/React.createElement("p", {
    className: "sag-title__program"
  }, subtitle) : null), /*#__PURE__*/React.createElement("div", null, presenter ? /*#__PURE__*/React.createElement(__ds_scope.PresenterBlock, presenter) : null)));
}
Object.assign(__ds_scope, { SlideTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/frames/SlideTitle.jsx", error: String((e && e.message) || e) }); }

// slides/deck.data.js
try { (() => {
const S = window.SAGLabDesignSystem_5a6e2d;
const day = "اليوم السابع";
const presenter = {
  name: "م. عبدالله السعيد",
  role: "مدرّب معمل بناء المنتج",
  org: "ساج لاب — بإشراف ساج التقنية"
};
window.SAG_SLIDES = [{
  id: "title",
  label: "slide-title",
  el: () => /*#__PURE__*/React.createElement(S.SlideTitle, {
    program: "\u0645\u0639\u0645\u0644 \u0628\u0646\u0627\u0621 \u0627\u0644\u0645\u0646\u062A\u062C \u0627\u0644\u0623\u062F\u0646\u0649 \u0627\u0644\u0642\u0627\u0628\u0644 \u0644\u0644\u062A\u0637\u0628\u064A\u0642",
    subtitle: "\u0639\u0634\u0631\u0629 \u0623\u064A\u0627\u0645 \u0644\u0628\u0646\u0627\u0621 \u0645\u0646\u062A\u062C \u062D\u0642\u064A\u0642\u064A \u0645\u0639 Claude Code",
    presenter: presenter,
    day: day,
    slideNumber: 1
  })
}, {
  id: "section",
  label: "slide-section",
  el: () => /*#__PURE__*/React.createElement(S.SlideSection, {
    number: "7.10",
    title: "\u0642\u0631\u0627\u0621\u0629 \u0645\u0627 \u064A\u0643\u062A\u0628\u0647 Claude",
    subtitle: "\u0643\u064A\u0641 \u062A\u062A\u0627\u0628\u0639 \u062E\u0637\u0648\u0627\u062A\u0647 \u062F\u0648\u0646 \u0623\u0646 \u062A\u0641\u0642\u062F \u0627\u0644\u0633\u064A\u0627\u0642",
    day: day,
    slideNumber: 41
  })
}, {
  id: "content",
  label: "slide-content",
  el: () => /*#__PURE__*/React.createElement(S.SlideContent, {
    badge: {
      kind: "القسم",
      number: "7.10"
    },
    title: "\u0645\u0627\u0630\u0627 \u064A\u0642\u0631\u0624\u0647 Claude \u0645\u0646 \u0645\u0633\u062A\u0648\u062F\u0639\u0643\u061F",
    lead: "\u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0644\u064A\u0633 \u0639\u0634\u0648\u0627\u0626\u064A\u064B\u0627 \u2014 \u0648\u0647\u0630\u0627 \u0645\u0627 \u064A\u062C\u0639\u0644 \u0627\u0644\u0648\u0635\u0641 \u0627\u0644\u062F\u0642\u064A\u0642 \u0645\u0647\u0645\u064B\u0627.",
    bullets: [/*#__PURE__*/React.createElement("span", null, "\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0625\u0639\u062F\u0627\u062F \u0623\u0648\u0644\u0627\u064B: ", /*#__PURE__*/React.createElement("span", {
      className: "tok-code"
    }, "package.json"), " \u062B\u0645 ", /*#__PURE__*/React.createElement("span", {
      className: "tok-code"
    }, "README.md")), /*#__PURE__*/React.createElement("span", null, "\u062B\u0645 \u0628\u0646\u064A\u0629 \u0627\u0644\u0645\u062C\u0644\u062F\u0627\u062A\u060C \u0644\u0627 \u0645\u062D\u062A\u0648\u0649 \u0643\u0644 \u0645\u0644\u0641"), /*#__PURE__*/React.createElement("span", null, "\u062B\u0645 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u062A\u064A \u0630\u0643\u0631\u062A\u0647\u0627 \u0623\u0646\u062A \u0641\u064A \u0627\u0644\u0637\u0644\u0628"), /*#__PURE__*/React.createElement("span", null, "\u062B\u0645 \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0647\u0627 \u0639\u0628\u0631 \u0627\u0644\u0627\u0633\u062A\u064A\u0631\u0627\u062F"), /*#__PURE__*/React.createElement("span", null, "\u0645\u0627 \u0644\u0645 \u064A\u064F\u0630\u0643\u0631 \u0648\u0644\u0645 \u064A\u064F\u0633\u062A\u0648\u0631\u062F \u064A\u0628\u0642\u0649 \u062E\u0627\u0631\u062C \u0627\u0644\u0633\u064A\u0627\u0642")],
    focusIndex: 2,
    day: day,
    slideNumber: 42,
    progress: /*#__PURE__*/React.createElement(S.DayProgress, {
      activeDay: 7,
      within: 45
    })
  }, /*#__PURE__*/React.createElement(S.Callout, {
    tone: "rule"
  }, "\u0627\u0630\u0643\u0631 \u0627\u0644\u0645\u0633\u0627\u0631 \u0643\u0627\u0645\u0644\u0627\u064B \u0641\u064A \u0637\u0644\u0628\u0643 \u2014 ", /*#__PURE__*/React.createElement("span", {
    className: "tok-code"
  }, "app/(dashboard)/page.tsx"), " \u2014 \u0648\u0644\u0627 \u062A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u0627\u0644\u062A\u062E\u0645\u064A\u0646."))
}, {
  id: "split",
  label: "slide-split",
  el: () => /*#__PURE__*/React.createElement(S.SlideSplit, {
    badge: {
      kind: "القسم",
      number: "7.11"
    },
    title: "\u0642\u0631\u0627\u0621\u062A\u0627\u0646 \u0644\u0646\u0641\u0633 \u0627\u0644\u0645\u0644\u0641",
    start: {
      label: "ما تقرؤه أنت",
      items: ["اسم الملف ومكانه", "التعليقات التي كتبتها", "ما تتذكّره من الأمس"]
    },
    end: {
      label: /*#__PURE__*/React.createElement("span", null, "\u0645\u0627 \u064A\u0642\u0631\u0624\u0647 ", /*#__PURE__*/React.createElement("span", {
        className: "tok-lat"
      }, "Claude")),
      items: ["البنية والاعتماديات", "أسماء الدوال والأنواع", "ما ورد في طلبك الآن فقط"]
    },
    day: day,
    slideNumber: 43
  })
}, {
  id: "media",
  label: "slide-media",
  el: () => /*#__PURE__*/React.createElement(S.SlideMedia, {
    badge: {
      kind: "المهمة",
      number: "14.1"
    },
    title: "\u0623\u0648\u0644 \u062A\u0634\u063A\u064A\u0644 \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0639",
    instruction: "\u0627\u0643\u062A\u0628 \u0627\u0644\u0623\u0645\u0631\u060C \u062B\u0645 \u0627\u0642\u0631\u0623 \u0627\u0644\u062E\u0637\u0629 \u0643\u0627\u0645\u0644\u0629 \u0642\u0628\u0644 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u064A\u0647\u0627.",
    layout: "stacked",
    media: {
      placeholder: "لقطة شاشة — نافذة Claude Code بعد /init",
      caption: "الخطة تظهر قبل التنفيذ، ويمكنك رفضها.",
      callouts: [{
        x: "7%",
        y: "16%"
      }, {
        n: 2,
        x: "38%",
        y: "62%"
      }]
    },
    day: day,
    slideNumber: 44
  })
}, {
  id: "steps",
  label: "slide-steps",
  el: () => /*#__PURE__*/React.createElement(S.SlideSteps, {
    badge: {
      kind: "القسم",
      number: "7.12"
    },
    title: "\u0645\u0646 \u0627\u0644\u0641\u0643\u0631\u0629 \u0625\u0644\u0649 \u0623\u0648\u0644 \u0646\u0634\u0631",
    activeIndex: 2,
    steps: [{
      title: "أنشئ المستودع",
      note: /*#__PURE__*/React.createElement("span", null, "\u0639\u0644\u0649 ", /*#__PURE__*/React.createElement("span", {
        className: "tok-lat"
      }, "GitHub"), "\u060C \u0641\u0627\u0631\u063A\u064B\u0627 \u0628\u0644\u0627 \u0642\u0648\u0627\u0644\u0628")
    }, {
      title: /*#__PURE__*/React.createElement("span", null, "\u0634\u063A\u0651\u0644 ", /*#__PURE__*/React.createElement("span", {
        className: "tok-lat"
      }, "Claude Code"), " \u0645\u0646 \u0645\u062C\u0644\u062F \u0627\u0644\u0645\u0634\u0631\u0648\u0639"),
      note: "من الطرفية، لا من المتصفح"
    }, {
      title: "اطلب أصغر نسخة تعمل",
      note: "شاشة واحدة، وظيفة واحدة"
    }, {
      title: /*#__PURE__*/React.createElement("span", null, "\u0627\u0646\u0634\u0631 \u0639\u0644\u0649 ", /*#__PURE__*/React.createElement("span", {
        className: "tok-lat"
      }, "Vercel")),
      note: "ثم شارك الرابط في المعمل"
    }],
    day: day,
    slideNumber: 45
  })
}, {
  id: "table",
  label: "slide-table",
  el: () => /*#__PURE__*/React.createElement(S.SlideTable, {
    badge: {
      kind: "القسم",
      number: "7.13"
    },
    title: "\u0627\u0644\u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u062A\u064A \u0633\u062A\u0633\u062A\u062E\u062F\u0645\u0647\u0627 \u0627\u0644\u064A\u0648\u0645",
    caption: "\u0627\u062D\u0641\u0638 \u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u064A\u062D\u0629 \u2014 \u0633\u062A\u0639\u0648\u062F \u0625\u0644\u064A\u0647\u0627 \u0641\u064A \u0643\u0644 \u064A\u0648\u0645 \u0644\u0627\u062D\u0642.",
    columns: [{
      label: "الأمر",
      width: "26%"
    }, {
      label: "ما يفعله"
    }, {
      label: "المدة",
      width: "14%",
      numeric: true
    }],
    rows: [[/*#__PURE__*/React.createElement("span", {
      className: "tok-code"
    }, "/init"), "يقرأ المستودع ويبني ملف السياق", "٢ د"], [/*#__PURE__*/React.createElement("span", {
      className: "tok-code"
    }, "/plan"), "يعرض خطة قبل أي تعديل", "١ د"], [/*#__PURE__*/React.createElement("span", {
      className: "tok-code"
    }, "/diff"), "يُظهر ما تغيّر قبل الحفظ", "١ د"], [/*#__PURE__*/React.createElement("span", {
      className: "tok-code"
    }, "npm run dev"), "يشغّل النسخة المحلية", "٣ د"]],
    focusRow: 1,
    day: day,
    slideNumber: 46
  })
}, {
  id: "quote",
  label: "slide-quote",
  el: () => /*#__PURE__*/React.createElement(S.SlideQuote, {
    tone: "rule",
    text: "\u0644\u0627 \u062A\u0637\u0644\u0628 \u0645\u0646 Claude \u0645\u0627 \u0644\u0627 \u062A\u0633\u062A\u0637\u064A\u0639 \u0648\u0635\u0641\u0647 \u0641\u064A \u0633\u0637\u0631 \u0648\u0627\u062D\u062F.",
    attribution: "\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0645\u0639\u0645\u0644 \u0627\u0644\u0623\u0648\u0644\u0649",
    day: day,
    slideNumber: 47
  })
}, {
  id: "closing",
  label: "slide-closing",
  el: () => /*#__PURE__*/React.createElement(S.SlideClosing, {
    title: "\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0633\u0627\u0628\u0639",
    accomplished: [{
      icon: "terminal",
      text: "شغّلت أول أمر داخل المشروع"
    }, {
      icon: "git-branch",
      text: "ربطت المستودع بـ GitHub"
    }, {
      icon: "rocket",
      text: "نشرت نسخة تعمل على الإنترنت"
    }],
    next: ["ربط المشروع بقاعدة بيانات Supabase", "أول اختبار مع مستخدم حقيقي", "تجهيز عرض اليوم العاشر"],
    day: day,
    slideNumber: 48,
    progress: /*#__PURE__*/React.createElement(S.DayProgress, {
      activeDay: 7,
      within: 100
    })
  })
}];
if (window.SAG_ON_SLIDES) window.SAG_ON_SLIDES();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/deck.data.js", error: String((e && e.message) || e) }); }

__ds_ns.AgendaRow = __ds_scope.AgendaRow;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.DayProgress = __ds_scope.DayProgress;

__ds_ns.EndorsementMark = __ds_scope.EndorsementMark;

__ds_ns.FileTree = __ds_scope.FileTree;

__ds_ns.FooterBar = __ds_scope.FooterBar;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.LogoZone = __ds_scope.LogoZone;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.PresenterBlock = __ds_scope.PresenterBlock;

__ds_ns.SectionBadge = __ds_scope.SectionBadge;

__ds_ns.SkillCard = __ds_scope.SkillCard;

__ds_ns.StepChip = __ds_scope.StepChip;

__ds_ns.TimingPill = __ds_scope.TimingPill;

__ds_ns.SlideClosing = __ds_scope.SlideClosing;

__ds_ns.SlideContent = __ds_scope.SlideContent;

__ds_ns.SlideFrame = __ds_scope.SlideFrame;

__ds_ns.SlideMedia = __ds_scope.SlideMedia;

__ds_ns.SlideQuote = __ds_scope.SlideQuote;

__ds_ns.SlideSection = __ds_scope.SlideSection;

__ds_ns.SlideSplit = __ds_scope.SlideSplit;

__ds_ns.SlideSteps = __ds_scope.SlideSteps;

__ds_ns.SlideTable = __ds_scope.SlideTable;

__ds_ns.SlideTitle = __ds_scope.SlideTitle;

})();
