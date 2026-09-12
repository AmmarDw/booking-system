import React from "react";
import { TimingPill } from "./TimingPill.jsx";

export function AgendaRow({ name, what, duration, state = "default", className = "", style, ...rest }) {
  return (
    <div className={"sag-agenda " + className} data-state={state} dir="rtl" style={style} {...rest}>
      <span className="sag-agenda__name">{name}</span>
      <span className="sag-agenda__what">{what}</span>
      {duration ? <TimingPill label={duration} tone={state === "active" ? "accent" : "default"} /> : <span />}
    </div>
  );
}