import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
import { StepChip } from "../elements/StepChip.jsx";
import { MediaFrame } from "../elements/MediaFrame.jsx";

export function SlideSteps({ title, badge, steps = [], activeIndex, surface = "light", day, slideNumber, ...rest }) {
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} {...rest}>
      <div className="sag-slide__head">
        {badge ? <SectionBadge {...badge} /> : null}
        <h2 className="sag-slide__title">{title}</h2>
      </div>
      <ol className="sag-steps">
        {steps.map(function (s, i) {
          const state = s.state ? s.state
            : activeIndex == null ? "upcoming"
            : i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
          return (
            <li key={"s" + i} className="sag-steps__row">
              <StepChip n={i + 1} state={state} />
              <span className="sag-steps__text">
                <span className="sag-steps__title">{s.title}</span>
                {s.note ? <span className="sag-steps__note">{s.note}</span> : null}
              </span>
              {s.thumb ? <MediaFrame src={s.thumb} ratio="16x9" className="sag-steps__thumb" /> : <span />}
            </li>
          );
        })}
      </ol>
    </SlideFrame>
  );
}