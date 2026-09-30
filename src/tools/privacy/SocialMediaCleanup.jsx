import { useState } from 'react'
export default function SocialMediaCleanup() {
  const items = ['Review and remove old posts','Delete embarrassing photos','Remove location check-ins','Review tagged photos','Audit friend/follower lists','Remove unused apps and connections','Update privacy settings','Review ad preferences','Delete old direct messages','Check what info is public','Remove phone number if unnecessary','Review login activity']
  const [checked, setChecked] = useState({})
  const toggle = i => setChecked(p => ({...p, [i]: !p[i]}))
  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round(done / items.length * 100)
  return (
    <div>
      <div className="out" role="status">
        <p><strong>Cleanup Progress:</strong> {done}/{items.length} ({pct}%)</p>
        <div style={{background:'#e2e8f0',borderRadius:4,height:8,marginBottom:12}}><div style={{background:'var(--accent,#3182ce)',height:8,borderRadius:4,width:pct+'%',transition:'width .3s'}} /></div>
      </div>
      {items.map((item, i) => <label key={i} style={{display:'block',padding:'4px 0'}}><input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} /> {item}</label>)}
      <p className="hint">Protect your digital footprint.</p>
    </div>
  )
}
