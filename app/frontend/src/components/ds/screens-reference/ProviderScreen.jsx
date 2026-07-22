// REFERENCE ONLY — from Claude Design (BookIt Design System). See NavShell.jsx header.
// Composition reference for the booking calendar + slot picking (report §6.4 prompt E / M4).
const {CalendarDayCell,Accordion,Button}=window.BookItDesignSystem_2f7aa6;
const days=[
  {day:10,status:'high',count:5},{day:11,status:'medium',count:3},{day:12,status:'low',count:2},
  {day:13,status:'none'},{day:14,status:'high',count:6},{day:15,status:'booked'},{day:16,status:'low',count:1}
];
const slotsByDay={10:['09:00','10:30','13:00','15:00','16:30'],11:['11:00','14:00','17:00'],12:['12:00'],14:['09:00','09:30','10:00','13:30','15:00','16:00'],16:['17:30']};
function ProviderScreen({provider,onBook,dir='ltr'}){
  const [selDay,setSelDay]=React.useState(10);
  const t=dir==='rtl'?{back:'رجوع',title:'اختر يوماً ووقتاً',slots:'الأوقات المتاحة',book:'تأكيد الحجز'}:{back:'Back',title:'Pick a day and time',slots:'Available slots',book:'Book this slot'};
  return <div style={{padding:20,display:'flex',flexDirection:'column',gap:16}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div>
        <div style={{fontWeight:700,fontSize:18,color:'var(--text-primary)'}}>{provider.name}</div>
        <div style={{fontSize:13,color:'var(--text-secondary)'}}>{provider.role} · ★ {provider.rating}</div>
      </div>
    </div>
    <div style={{fontSize:14,fontWeight:600,color:'var(--text-secondary)'}}>{t.title}</div>
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      {days.map(d=><CalendarDayCell key={d.day} day={d.day} status={d.status} count={d.count} selected={selDay===d.day} onClick={()=>setSelDay(d.day)}/>)}
    </div>
    <div style={{fontSize:14,fontWeight:600,color:'var(--text-secondary)'}}>{t.slots}</div>
    <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
      {(slotsByDay[selDay]||[]).map(s=><Button key={s} variant="secondary" size="sm" onClick={()=>onBook(s,selDay)}>{s}</Button>)}
      {!(slotsByDay[selDay]||[]).length&&<span style={{fontSize:13,color:'var(--text-tertiary)'}}>—</span>}
    </div>
  </div>;
}
window.BookItKit=Object.assign(window.BookItKit||{},{ProviderScreen});
