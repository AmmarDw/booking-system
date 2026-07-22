import React from 'react';
export function CalendarDayCell({day,status='none',count,selected=false,onClick}){
  const cls='bk-day bk-day-'+status+(selected?' bk-day-selected':'');
  const disabled=status==='none'||status==='booked';
  return <button className={cls} onClick={onClick} disabled={disabled} type="button">
    <span className="bk-day-num">{day}</span>
    {status!=='none'&&status!=='booked'&&count!=null&&<span className="bk-day-badge">{count}</span>}
  </button>;
}
