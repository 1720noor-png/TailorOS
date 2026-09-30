import { useState } from 'react'
import { Msg } from '../../components/ui.jsx'

export default function ContractChecklist() {
  const items = ["Parties clearly identified","Scope of work defined","Payment terms specified","Delivery dates/milestones set","Intellectual property rights addressed","Confidentiality clause present","Termination conditions defined","Liability limitations included","Dispute resolution method specified","Force majeure clause included","Non-compete/non-solicitation reviewed","Insurance requirements specified","Amendment process defined","Governing law specified","Signature blocks complete"]
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
