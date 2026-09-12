import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
import { MediaFrame } from "../elements/MediaFrame.jsx";

export function SlideMedia({ title, instruction, media = {}, badge, layout = "stacked", surface = "light", day, slideNumber, ...rest }) {
  const stacked = layout === "stacked";
  // Stacked is the media-dominant default: the instruction line replaces the frame caption,
  // so the whole first row belongs to the image (>=55% of the frame).
  const mediaProps = stacked ? Object.assign({}, media, { caption: undefined }) : media;
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} className="sag-media" {...rest}>
      <div className={"sag-slide__head " + (stacked ? "sag-media__head" : "")}>
        {badge ? <SectionBadge {...badge} /> : null}
        {title ? <h2 className="sag-slide__title">{title}</h2> : null}
      </div>
      <div className="sag-media__inner" data-layout={layout}>
        <MediaFrame {...mediaProps} />
        <div className="sag-media__side">
          {instruction ? <p className="sag-media__instruction">{instruction}</p> : null}
        </div>
      </div>
    </SlideFrame>
  );
}