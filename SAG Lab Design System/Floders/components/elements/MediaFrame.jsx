import React from "react";
export function MediaFrame({ src, alt = "", video = false, poster, caption, placeholder = "لقطة شاشة / GIF", callouts = [], ratio = "fill", className = "", style, ...rest }) {
  return (
    <figure className={"sag-media-frame " + className} data-ratio={ratio} dir="rtl" style={Object.assign({ margin: 0 }, style)} {...rest}>
      <div className="sag-media-frame__box">
        {src && video ? <video src={src} poster={poster} muted loop playsInline /> : null}
        {src && !video ? <img src={src} alt={alt} /> : null}
        {!src ? <span className="sag-media-frame__ph">{placeholder}</span> : null}
        {callouts.map(function (c, i) {
          return (
            <span key={"c" + i} className="sag-media-frame__dot"
                  style={{ insetInlineStart: c.x, top: c.y }}>{c.n != null ? c.n : i + 1}</span>
          );
        })}
      </div>
      {caption ? <figcaption className="sag-media-frame__caption">{caption}</figcaption> : null}
    </figure>
  );
}