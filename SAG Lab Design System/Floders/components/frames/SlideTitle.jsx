import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
import { LogoZone } from "../elements/LogoZone.jsx";
import { PresenterBlock } from "../elements/PresenterBlock.jsx";

export function SlideTitle({ program, subtitle, presenter, surface = "dark", day, slideNumber, wordmarkLines, ...rest }) {
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} className="sag-title" {...rest}>
      <div className="sag-title__inner">
        <div>
          <LogoZone size="hero" lines={wordmarkLines} />
          {program ? <h1 className="sag-title__display">{program}</h1> : null}
          {subtitle ? <p className="sag-title__program">{subtitle}</p> : null}
        </div>
        <div>
          {presenter ? <PresenterBlock {...presenter} /> : null}
        </div>
      </div>
    </SlideFrame>
  );
}