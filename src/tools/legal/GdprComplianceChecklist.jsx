import { useState } from 'react'
import { Msg } from '../../components/ui.jsx'

export default function GdprComplianceChecklist() {
  const items = ["Privacy policy published and accessible","Consent mechanism for data collection","Data processing records maintained","Data Protection Officer designated if required","Data breach notification process documented","Right to erasure process implemented","Data portability process available","Legitimate interest assessments documented","Third-party processor agreements in place","Cookie consent banner implemented","Privacy impact assessments conducted","Data retention periods defined","Cross-border transfer safeguards in place","Employee data protection training conducted","Regular compliance audits scheduled"]
  const [checked, setChecked] = useState({})

  const toggle = i => setChecked(prev => ({...prev, [i]: !prev[i]}))
  const total = items.length
  const done = Object.values(checked).filter(Boolean).length
  const pct = total ? Math.round(done / total * 100) : 0

  return (
    <div>
      <div className="out" role="status">
        <p><strong>Progress:</strong> {done}/{total} ({pct}%)</p>
        <div style={{background:'#e2e8f0',borderRadius:4,height:8,marginBottom:12}}>
          <div style={{background:'var(--accent,#3182ce)',height:8,borderRadius:4,width:pct+'%',transition:'width .3s'}} />
        </div>
      </div>
      {items.map((item, i) => (
        <label key={i} className="check" style={{display:'block',padding:'4px 0'}}>
          <input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} /> {item}
        </label>
      ))}
      <p className="hint">Check each item as you review.</p>
    </div>
  )
}
