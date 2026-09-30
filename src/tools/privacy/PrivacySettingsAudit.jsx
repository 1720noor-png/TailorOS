import { useState } from 'react'
export default function PrivacySettingsAudit() {
  const items = ['Two-factor authentication enabled','Strong unique passwords on all accounts','Password manager in use','Recovery email/phone updated','App permissions reviewed','Location sharing disabled where unneeded','Social media privacy settings tightened','Email forwarding rules checked','Connected apps/services audited','Old unused accounts deleted','Privacy-focused search engine considered','VPN usage for public WiFi']
  const [checked, setChecked] = useState({})
  const toggle = i => setChecked(p => ({...p, [i]: !p[i]}))
  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round(done / items.length * 100)
  return (
    <div>
      <div className="out" role="status">
        <p><strong>Score:</strong> {done}/{items.length} ({pct}%)</p>
        <div style={{background:'#e2e8f0',borderRadius:4,height:8,marginBottom:12}}><div style={{background:pct>70?'#38a169':pct>40?'#d69e2e':'#e53e3e',height:8,borderRadius:4,width:pct+'%',transition:'width .3s'}} /></div>
      </div>
      {items.map((item, i) => <label key={i} style={{display:'block',padding:'4px 0'}}><input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} /> {item}</label>)}
      <p className="hint">Audit your digital privacy posture.</p>
    </div>
  )
}
