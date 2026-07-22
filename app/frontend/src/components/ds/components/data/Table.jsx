import React from 'react';
export function Table({columns=[],rows=[]}){
  return <table className="bk-table">
    <thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead>
    <tbody>{rows.map((r,i)=><tr key={i}>{columns.map(c=><td key={c.key}>{r[c.key]}</td>)}</tr>)}</tbody>
  </table>;
}
