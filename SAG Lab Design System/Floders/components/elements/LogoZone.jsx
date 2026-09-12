import React from "react";
/** The lead mark: ساج لاب. No logo binaries were supplied with this brand, so the
 *  wordmark is type-set in IBM Plex Sans Arabic Bold. Replace with the real
 *  calligraphic artwork when it is available (see readme.md > Assets). */
export function LogoZone({ size = "standard", lines = ["ساج", "لاب"], showNote = false, className = "", style, ...rest }) {
  return (
    <span className={"sag-logo " + className} data-size={size} dir="rtl" style={style} {...rest}>
      <span className="sag-logo__wordmark">
        {lines.map(function (l, i) { return <span key={"l" + i}>{l}</span>; })}
      </span>
      {showNote ? <span className="sag-logo__placeholder">شعار نصّي مؤقّت — بانتظار الملف الأصلي</span> : null}
    </span>
  );
}