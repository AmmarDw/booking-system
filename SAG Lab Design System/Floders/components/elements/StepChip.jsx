import React from "react";
export function StepChip({ n, state = "upcoming", size = "default", className = "", style, ...rest }) {
  return (
    <span className={"sag-chip " + className} data-state={state} data-size={size}
          style={style} aria-current={state === "active" ? "step" : undefined} {...rest}>
      {state === "done" ? "\u2713" : n}
    </span>
  );
}