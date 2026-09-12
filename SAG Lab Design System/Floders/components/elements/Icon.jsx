import React from "react";
function toPascal(n){return String(n).split(/[-_\s]+/).map(function(p){return p.charAt(0).toUpperCase()+p.slice(1)}).join("")}

/** Line icon from the Lucide set (2px stroke, rounded caps). Requires the Lucide
 *  UMD script on the page: https://unpkg.com/lucide@0.446.0/dist/umd/lucide.js */
export function Icon({ name, size = 24, strokeWidth = 2, className = "", style, ...rest }) {
  const lucide = typeof window !== "undefined" ? window.lucide : null;
  const set = lucide && lucide.icons ? lucide.icons : null;
  const node = set ? (set[toPascal(name)] || set[name]) : null;
  // Lucide ships each icon as ["svg", attrs, childTuples]. Anything else is already a tuple list.
  const tuples = !node ? [] : (node[0] === "svg" ? (node[2] || []) : node);
  const children = tuples.map(function (t, i) {
    const attrs = Object.assign({ key: "i" + i }, t[1] || {});
    return React.createElement(t[0], attrs);
  });
  return (
    <svg
      className={"sag-icon " + className}
      style={Object.assign({ display: "inline-block", flex: "0 0 auto" }, style)}
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" {...rest}
    >{children}</svg>
  );
}