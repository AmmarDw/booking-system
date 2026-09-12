import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
export function SlideContent({ title, lead, bullets = [], focusIndex, badge, children, surface = "light", day, slideNumber, progress, ...rest }) {
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} progress={progress} {...rest}>
      <div className="sag-slide__head">
        {badge ? <SectionBadge {...badge} /> : null}
        <h2 className="sag-slide__title">{title}</h2>
        <span className="sag-slide__rule" />
        {lead ? <p className="sag-slide__lead">{lead}</p> : null}
      </div>
      {bullets.length ? (
        <ul className="sag-bullets">
          {bullets.map(function (b, i) {
            const focused = focusIndex != null && focusIndex === i;
            return (
              <li key={"b" + i} className="sag-bullets__item"
                  data-focus={focused ? "true" : undefined}>{b}</li>
            );
          })}
        </ul>
      ) : null}
      {children}
    </SlideFrame>
  );
}