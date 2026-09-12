import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
export function SlideSplit({ title, badge, start, end, surface = "light", day, slideNumber, plain = false, ...rest }) {
  function col(c) {
    return (
      <div className="sag-split__col" data-plain={plain ? "true" : undefined}>
        {c && c.label ? <h3 className="sag-split__label">{c.label}</h3> : null}
        {c && c.items ? (
          <ul className="sag-bullets">
            {c.items.map(function (b, i) { return <li key={"i" + i} className="sag-bullets__item">{b}</li>; })}
          </ul>
        ) : null}
        {c ? c.children : null}
      </div>
    );
  }
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} {...rest}>
      <div className="sag-slide__head">
        {badge ? <SectionBadge {...badge} /> : null}
        {title ? <h2 className="sag-slide__title">{title}</h2> : null}
      </div>
      <div className="sag-split">{col(start)}{col(end)}</div>
    </SlideFrame>
  );
}