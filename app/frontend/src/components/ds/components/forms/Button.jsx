import React from 'react';
export function Button({variant='primary',size='md',disabled=false,icon,children,onClick,type='button'}){
  const cls=['bk-btn','bk-btn-'+variant,size!=='md'?('bk-btn-'+size):''].filter(Boolean).join(' ');
  return <button type={type} className={cls} disabled={disabled} onClick={onClick}>{icon}{children}</button>;
}
