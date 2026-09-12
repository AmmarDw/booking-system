import React from "react";
/** The endorsing company mark: ساج التقنية / SAG TECH. The real mark is a circular
 *  navy monogram with a white spiral; no artwork was supplied, so the circle carries
 *  the letter S as a stand-in. Swap in the SVG when available. */
export function EndorsementMark({ size = "footnote", showText = true, className = "", style, ...rest }) {
  return (
    <span className={"sag-endorse " + className} data-size={size} dir="rtl" style={style} {...rest}>
      <span className="sag-endorse__mark" aria-hidden="true">S</span>
      {showText ? (
        <span className="sag-endorse__text">
          <span className="sag-endorse__lat">SAG TECH</span>
          <span className="sag-endorse__ar">ساج التقنية</span>
        </span>
      ) : null}
    </span>
  );
}