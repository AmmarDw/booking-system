// REFERENCE ONLY — from Claude Design (BookIt Design System). See NavShell.jsx header.
// Composition reference for the consumer booking-services list (report §6.4 prompt D / SearchScreen).
const {Card,Badge,Select}=window.BookItDesignSystem_2f7aa6;
const providers=[
  {id:1,name:'Dr. Layla Hassan',role:'Dermatologist',rating:'4.9',avail:'high',count:5},
  {id:2,name:'Dr. Omar Nasser',role:'Physiotherapist',rating:'4.7',avail:'low',count:1},
  {id:3,name:'Dr. Farah Idris',role:'Dentist',rating:'4.8',avail:'medium',count:3},
  {id:4,name:'Dr. Sami Rahal',role:'General Practitioner',rating:'4.6',avail:'none',count:0}
];
const tone={high:'success',medium:'warning',low:'danger',none:'neutral'};
const label={high:'5 slots today',medium:'3 slots today',low:'1 slot left',none:'Fully booked'};
function SearchScreen({onSelectProvider,dir='ltr'}){
  return <div style={{padding:20,display:'flex',flexDirection:'column',gap:16}}>
    <div style={{display:'flex',gap:12}}>
      <div style={{flex:1}}><Select label={dir==='rtl'?'التخصص':'Specialty'} options={[{label:dir==='rtl'?'الكل':'All',value:'all'}]} value="all" onChange={()=>{}}/></div>
      <div style={{flex:1}}><Select label={dir==='rtl'?'الموقع':'Location'} options={[{label:dir==='rtl'?'الأقرب':'Nearest',value:'near'}]} value="near" onChange={()=>{}}/></div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
      {providers.map(p=><div key={p.id} onClick={()=>p.avail!=='none'&&onSelectProvider(p)} style={{cursor:p.avail==='none'?'not-allowed':'pointer'}}>
        <Card title={p.name} description={p.role}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
            <span style={{fontSize:13,color:'var(--text-tertiary)'}}>★ {p.rating}</span>
            <Badge tone={tone[p.avail]} dot>{label[p.avail]}</Badge>
          </div>
        </Card>
      </div>)}
    </div>
  </div>;
}
window.BookItKit=Object.assign(window.BookItKit||{},{SearchScreen});
