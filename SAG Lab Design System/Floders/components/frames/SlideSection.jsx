import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
export function SlideSection({ number, title, subtitle, surface = "dark", day, slideNumber, ...rest }) {
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} className="sag-section" {...rest}>
      <div className="sag-section__inner">
        {number != null ? <span className="sag-section__num">{number}</span> : null}
        <h2 className="sag-section__title">{title}</h2>
        {subtitle ? <p className="sag-section__sub">{subtitle}</p> : null}
      </div>
    </SlideFrame>
  );
}