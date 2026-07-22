import React from 'react';
export function Select({label,options=[],value,onChange,disabled=false,id}){
  const selId=id||label?.replace(/\s+/g,'-').toLowerCase();
  return <div className="bk-input-wrap">
    {label&&<label className="bk-label" htmlFor={selId}>{label}</label>}
    <select id={selId} className="bk-select" value={value} onChange={onChange} disabled={disabled}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>;
}
