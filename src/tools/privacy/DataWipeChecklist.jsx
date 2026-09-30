import { useState } from 'react'
export default function DataWipeChecklist() {
  const items = ['Browser history cleared','Cookies and cache cleared','Saved passwords removed','Autofill data deleted','Download history cleared','Bookmarks reviewed','Extensions audited','Saved form data removed','Site permissions reset','Location history cleared','Search history cleared','Synced data reviewed']
  const [checked, setChecked] = useState({})
  const toggle = i => setChecked(p => ({...p, [i]: !p[i]}))
  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round(done / items.length * 100)
  return (
    <div>
      <div className="out" role="status">
        <p><strong>Progress:</strong> {done}/{items.length} ({pct}%)</p>
        <div style={{background:'#e2e8f0',borderRadius:4,height:8,marginBottom:12}}><div style={{background:'var(--accent,#3182ce)',height:8,borderRadius:4,width:pct+'%',transition:'width .3s'}} /></div>
      </div>
      {items.map((item, i) => <label key={i} style={{display:'block',padding:'4px 0'}}><input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} /> {item}</label>)}
      <p className="hint">Complete all steps before selling or donating a device.</p>
    </div>
  )
}
