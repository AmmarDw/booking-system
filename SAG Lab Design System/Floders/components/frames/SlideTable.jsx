import React from "react";
import { FooterBar } from "../elements/FooterBar.jsx";
import { SectionBadge } from "../elements/SectionBadge.jsx";
import { SlideFrame } from "./SlideFrame.jsx";
export function SlideTable({ title, badge, caption, columns = [], rows = [], focusRow, surface = "light", day, slideNumber, ...rest }) {
  return (
    <SlideFrame surface={surface} day={day} slideNumber={slideNumber} {...rest}>
      <div className="sag-slide__head">
        {badge ? <SectionBadge {...badge} /> : null}
        <h2 className="sag-slide__title">{title}</h2>
      </div>
      <table className="sag-table" dir="rtl">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>{columns.map(function (c, i) {
            return <th key={"h" + i} scope="col" style={c && c.width ? { width: c.width } : undefined}>{c && c.label !== undefined ? c.label : c}</th>;
          })}</tr>
        </thead>
        <tbody>
          {rows.map(function (r, i) {
            return (
              <tr key={"r" + i} data-focus={focusRow === i ? "true" : undefined}>
                {r.map(function (cell, j) {
                  const c = columns[j];
                  return <td key={"c" + j} data-num={c && c.numeric ? "true" : undefined}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </SlideFrame>
  );
}