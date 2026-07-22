import React from 'react';
const map={
  success:{bg:'var(--success-bg)',fg:'#15803D'},
  warning:{bg:'var(--warning-bg)',fg:'#B45309'},
  danger:{bg:'var(--danger-bg)',fg:'#B91C1C'},
  neutral:{bg:'var(--surface-sunken)',fg:'var(--text-secondary)'},
  primary:{bg:'var(--color-primary-tint)',fg:'var(--color-primary-hover)'}
};
export function Badge({tone='neutral',dot=false,children}){
  const c=map[tone]||map.neutral;
  return <span className="bk-badge" style={{background:c.bg,color:c.fg}}>{dot&&<span className="bk-badge-dot"/>}{children}</span>;
}
