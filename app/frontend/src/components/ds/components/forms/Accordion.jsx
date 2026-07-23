"use client";
import React from 'react';
export function Accordion({items=[]}){
  const [open,setOpen]=React.useState(0);
  return <div className="bk-accordion">
    {items.map((it,i)=><div className="bk-accordion-item" key={i}>
      <button className="bk-accordion-header" onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}>
        <span>{it.title}</span>
        <svg className={'bk-accordion-chevron'+(open===i?' bk-accordion-chevron-open':'')} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {open===i&&<div className="bk-accordion-panel">{it.content}</div>}
    </div>)}
  </div>;
}
