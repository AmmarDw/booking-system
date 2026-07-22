// REFERENCE ONLY — from Claude Design (BookIt Design System).
// Uses the Claude Design sandbox globals (window.BookItDesignSystem_2f7aa6 / window.BookItKit),
// NOT ES imports. Do not import directly. Use it as a composition/visual reference when building
// the real Next.js pages: replace the window.* globals with `import { ... } from '@/components/ds'`
// and swap the mock data for API data.
const {Badge}=window.BookItDesignSystem_2f7aa6;
function NavShell({active,onNav,children,dir='ltr'}){
  const items=dir==='rtl'?[['bookings','حجوزاتي'],['search','استكشاف']]:[['search','Explore'],['bookings','My bookings']];
  return <div dir={dir} style={{fontFamily:dir==='rtl'?"'IBM Plex Sans Arabic',sans-serif":'Inter,sans-serif',background:'var(--surface-page)',minHeight:640,borderRadius:16,overflow:'hidden',border:'1px solid var(--border-default)'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',background:'var(--surface-card)',borderBottom:'1px solid var(--border-default)'}}>
      <div style={{fontWeight:700,fontSize:18,color:'var(--color-primary)'}}>BookIt</div>
      <div style={{display:'flex',gap:6}}>
        {items.map(([key,label])=><button key={key} onClick={()=>onNav(key)} style={{background:active===key?'var(--color-primary-tint-weak)':'transparent',color:active===key?'var(--color-primary-hover)':'var(--text-secondary)',border:'none',borderRadius:8,padding:'8px 14px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{label}</button>)}
      </div>
    </div>
    {children}
  </div>;
}
window.BookItKit=Object.assign(window.BookItKit||{},{NavShell});
