import React from "react";
export function DayProgress({ totalDays = 10, activeDay = 1, within, label, className = "", style, ...rest }) {
  const days = [];
  for (let i = 1; i <= totalDays; i++) {
    days.push(<span key={"d" + i} className="sag-days__day"
                    data-state={i < activeDay ? "done" : i === activeDay ? "active" : "upcoming"} />);
  }
  return (
    <div className={"sag-days " + className} dir="rtl" style={style}
         role="img" aria-label={label || "اليوم " + activeDay + " من " + totalDays} {...rest}>
      <span className="sag-days__label">{label || "اليوم " + activeDay + " / " + totalDays}</span>
      <span className="sag-days__track">{days}</span>
      {within != null ? (
        <span className="sag-days__within">
          <span className="sag-days__withinFill" style={{ width: Math.max(0, Math.min(100, within)) + "%" }} />
        </span>
      ) : null}
    </div>
  );
}