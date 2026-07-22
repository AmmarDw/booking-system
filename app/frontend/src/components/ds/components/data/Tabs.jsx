import React from 'react';
export function Tabs({tabs=[],active,onChange}){
  return <div className="bk-tabs">
    {tabs.map(t=><button key={t.value} className={'bk-tab'+(active===t.value?' bk-tab-active':'')} onClick={()=>onChange&&onChange(t.value)}>{t.label}</button>)}
  </div>;
}
