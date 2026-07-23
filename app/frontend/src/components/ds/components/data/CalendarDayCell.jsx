import React from 'react';
// Extended (M4) with an optional `total` prop: when provided, the badge shows "available/total"
// (e.g. "3/8") per CLAUDE.md §B.4 / FR-9, instead of just the available count.
export function CalendarDayCell({day,status='none',count,total,selected=false,onClick}){
  const cls='bk-day bk-day-'+status+(selected?' bk-day-selected':'');
  const disabled=status==='none'||status==='booked';
  const showBadge=status!=='none'&&status!=='booked'&&count!=null;
  const badgeText=total!=null?`${count}/${total}`:String(count);
  return <button className={cls} onClick={onClick} disabled={disabled} type="button">
    <span className="bk-day-num">{day}</span>
    {showBadge&&<span className="bk-day-badge">{badgeText}</span>}
  </button>;
}
