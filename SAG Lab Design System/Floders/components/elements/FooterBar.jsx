import React from "react";
import { EndorsementMark } from "./EndorsementMark.jsx";

export function FooterBar({ day, slideNumber, progress, showMark = true, className = "", style, ...rest }) {
  return (
    <div className={"sag-footer " + className} dir="rtl" style={style} {...rest}>
      {showMark ? <EndorsementMark size="footnote" /> : <span />}
      <span>{progress}</span>
      <span className="sag-footer__meta">
        {day ? <span className="sag-footer__day">{day}</span> : null}
        {day && slideNumber != null ? <span className="sag-footer__sep" /> : null}
        {slideNumber != null ? <span className="sag-footer__num">{slideNumber}</span> : null}
      </span>
    </div>
  );
}