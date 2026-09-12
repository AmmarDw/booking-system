import React from "react";
export function SectionBadge({ kind = "القسم", number, tone = "solid", className = "", style, ...rest }) {
  return (
    <span className={"sag-badge " + className} data-tone={tone} dir="rtl" style={style} {...rest}>
      <span>{kind}</span>
      {number != null ? <span className="sag-badge__num">{number}</span> : null}
    </span>
  );
}