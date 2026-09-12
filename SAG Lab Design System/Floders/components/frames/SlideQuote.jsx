import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
export function SlideQuote({ text, attribution, tone = "default", surface = "light", day, slideNumber, ...rest }) {
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} className="sag-quote" data-tone={tone} {...rest}>
      <div className="sag-quote__inner">
        <span className="sag-quote__mark" />
        <p className="sag-quote__text">{text}</p>
        {attribution ? <p className="sag-quote__attr">{attribution}</p> : null}
      </div>
    </SlideFrame>
  );
}