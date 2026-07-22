// REFERENCE ONLY — from Claude Design (BookIt Design System). See NavShell.jsx header.
// Composition reference for the shared dashboard appointment list (report §6.4 prompt F / M5).
const {Table,Badge,Tabs}=window.BookItDesignSystem_2f7aa6;
function BookingsScreen({bookings,dir='ltr'}){
  const [tab,setTab]=React.useState('up');
  const t=dir==='rtl'?{up:'القادمة',past:'السابقة',date:'التاريخ',provider:'مقدم الخدمة',status:'الحالة'}:{up:'Upcoming',past:'Past',date:'Date',provider:'Provider',status:'Status'};
  const rows=bookings.map(b=>({date:b.date,provider:b.provider,status:<Badge tone={b.tone} dot>{b.statusLabel}</Badge>}));
  return <div style={{padding:20,display:'flex',flexDirection:'column',gap:16}}>
    <Tabs tabs={[{label:t.up,value:'up'},{label:t.past,value:'past'}]} active={tab} onChange={setTab}/>
    {rows.length?<Table columns={[{key:'date',label:t.date},{key:'provider',label:t.provider},{key:'status',label:t.status}]} rows={rows}/>:
    <div style={{fontSize:14,color:'var(--text-tertiary)',padding:'24px 0'}}>{dir==='rtl'?'لا توجد حجوزات بعد':'No bookings yet — book a slot to see it here.'}</div>}
  </div>;
}
window.BookItKit=Object.assign(window.BookItKit||{},{BookingsScreen});
