import React from "react";
import { Icon } from "./Icon.jsx";

export function TimingPill({ label, tone = "default", icon = "clock", className = "", style, ...rest }) {
  return (
    <span className={"sag-timing " + className} data-tone={tone} dir="rtl" style={style} {...rest}>
      {icon ? <Icon name={icon} size={18} className="sag-timing__glyph" /> : null}
      <span>{label}</span>
    </span>
  );
}