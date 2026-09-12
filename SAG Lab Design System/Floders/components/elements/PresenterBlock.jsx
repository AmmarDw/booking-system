import React from "react";
export function PresenterBlock({ name, role, org, photo, alt = "", size = "default", className = "", style, ...rest }) {
  return (
    <div className={"sag-presenter " + className} data-size={size} dir="rtl" style={style} {...rest}>
      <div className="sag-presenter__photo">
        {photo ? <img src={photo} alt={alt || name || ""} />
               : <span className="sag-presenter__ph">صورة المدرّب</span>}
      </div>
      <div className="sag-presenter__text">
        {name ? <span className="sag-presenter__name">{name}</span> : null}
        {role ? <span className="sag-presenter__role">{role}</span> : null}
        {org ? <span className="sag-presenter__org">{org}</span> : null}
      </div>
    </div>
  );
}