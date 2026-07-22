import React from 'react';
export function Input({label,placeholder,value,onChange,type='text',disabled=false,error,hint,id}){
  const inputId=id||label?.replace(/\s+/g,'-').toLowerCase();
  return <div className="bk-input-wrap">
    {label&&<label className="bk-label" htmlFor={inputId}>{label}</label>}
    <input id={inputId} className={'bk-input'+(error?' bk-input-error':'')} type={type} placeholder={placeholder} value={value} disabled={disabled} onChange={onChange}/>
    {error?<span className="bk-hint bk-hint-error">{error}</span>:hint?<span className="bk-hint">{hint}</span>:null}
  </div>;
}
