import React from "react";
/** Directory trees are forced LTR: box-drawing characters and paths mirror badly
 *  under RTL. Arabic annotations sit start-aligned beside the block. */
export function FileTree({ tree, notes = [], className = "", style, ...rest }) {
  const hasNotes = notes && notes.length > 0;
  return (
    <div className={"sag-tree " + className} data-notes={hasNotes ? "true" : "false"} dir="rtl" style={style} {...rest}>
      <pre className="sag-tree__code" dir="ltr">{tree}</pre>
      {hasNotes ? (
        <ul className="sag-tree__notes">
          {notes.map(function (n, i) { return <li key={"n" + i} className="sag-tree__note">{n}</li>; })}
        </ul>
      ) : null}
    </div>
  );
}