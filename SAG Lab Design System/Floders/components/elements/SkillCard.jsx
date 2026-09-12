import React from "react";
import { Icon } from "./Icon.jsx";

export function SkillCard({ text, icon = "check", iconNode, state = "default", className = "", style, ...rest }) {
  return (
    <div className={"sag-skill " + className} data-state={state} dir="rtl" style={style} {...rest}>
      <span className="sag-skill__icon">{iconNode ? iconNode : <Icon name={icon} size={28} />}</span>
      <span className="sag-skill__text">{text}</span>
    </div>
  );
}