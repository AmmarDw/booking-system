import React from 'react';
export function Card({title,description,children,padded=true}){
  return <div className="bk-card" style={padded?{}:{padding:0}}>
    {title&&<h3 className="bk-card-title">{title}</h3>}
    {description&&<p className="bk-card-desc">{description}</p>}
    {children}
  </div>;
}
