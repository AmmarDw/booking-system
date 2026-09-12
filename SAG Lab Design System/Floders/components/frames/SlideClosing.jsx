import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
import { SkillCard } from "../elements/SkillCard.jsx";
import { LogoZone } from "../elements/LogoZone.jsx";

export function SlideClosing({ title, accomplished = [], next = [], accomplishedLabel = "ما أنجزناه اليوم", nextLabel = "ما ينتظرنا غدًا", surface = "dark", day, slideNumber, progress, ...rest }) {
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} progress={progress} {...rest}>
      <div className="sag-slide__head">
        <h2 className="sag-slide__title">{title || "نهاية اليوم"}</h2>
        <span className="sag-slide__rule" />
      </div>
      <div className="sag-closing__inner">
        <div className="sag-closing__group">
          <h3 className="sag-closing__label">{accomplishedLabel}</h3>
          <div className="sag-skill-grid" style={{ "--cols": 1 }}>
            {accomplished.map(function (s, i) {
              return <SkillCard key={"a" + i} state="done" icon={s.icon || "check"} text={s.text || s} />;
            })}
          </div>
        </div>
        <div className="sag-closing__group">
          <h3 className="sag-closing__label">{nextLabel}</h3>
          <ul className="sag-bullets">
            {next.map(function (n, i) { return <li key={"n" + i} className="sag-bullets__item">{n}</li>; })}
          </ul>
          <div style={{ marginTop: "auto" }}><LogoZone size="footnote" /></div>
        </div>
      </div>
    </SlideFrame>
  );
}