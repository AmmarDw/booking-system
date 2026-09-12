import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";

/** Base 16:9 slide frame. Fixed 1920x1080, 5% safe margins, footer zone reserved.
 *  Nothing inside a frame ever scrolls — split content across 1/2 and 2/2 slides. */
export function SlideFrame({ surface = "light", day, slideNumber, progress, footer, showMark = true, className = "", children, style, ...rest }) {
  const foot = footer !== undefined ? footer
    : <FooterBar day={day} slideNumber={slideNumber} progress={progress} showMark={showMark} />;
  return (
    <section className={"sag-slide " + className} dir="rtl"
             data-surface={surface === "dark" ? "dark" : undefined} style={style} {...rest}>
      <div className="sag-slide__body">{children}</div>
      <div className="sag-slide__foot">{foot}</div>
    </section>
  );
}