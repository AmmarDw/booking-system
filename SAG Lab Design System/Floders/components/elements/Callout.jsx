import React from "react";
import { Icon } from "./Icon.jsx";

const SAG_CALLOUT_GLYPH = { info: "info", warning: "alert-triangle", rule: "check-circle" };
const SAG_CALLOUT_LABEL = { info: "ملاحظة", warning: "تنبيه", rule: "قاعدة" };

export function Callout({ tone = "info", label, children, icon, className = "", style, ...rest }) {
  const glyph = icon || SAG_CALLOUT_GLYPH[tone] || "info";
  const heading = label !== undefined ? label : SAG_CALLOUT_LABEL[tone];
  return (
    <div className={"sag-callout " + className} data-tone={tone} dir="rtl" style={style} {...rest}>
      <Icon name={glyph} size={28} className="sag-callout__glyph" />
      <div className="sag-callout__body">
        {heading ? <span className="sag-callout__label">{heading}</span> : null}
        <span className="sag-callout__text">{children}</span>
      </div>
    </div>
  );
}