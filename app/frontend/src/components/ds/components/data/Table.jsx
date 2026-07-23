import React from 'react';
export function Table({columns=[],rows=[],onRowClick}){
  return <table className="bk-table">
    <thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead>
    <tbody>{rows.map((r,i)=><tr key={i} onClick={onRowClick?()=>onRowClick(r,i):undefined} style={onRowClick?{cursor:'pointer'}:undefined}>{columns.map(c=><td key={c.key}>{r[c.key]}</td>)}</tr>)}</tbody>
  </table>;
}
