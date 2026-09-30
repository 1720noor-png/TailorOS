import { useState } from 'react'
import { Msg } from '../../components/ui.jsx'

export default function FallRiskChecklist() {
  const items = ["Item 1: Review and verify","Item 2: Document and record","Item 3: Check compliance","Item 4: Verify completeness","Item 5: Confirm accuracy","Item 6: Update records","Item 7: Notify stakeholders","Item 8: Archive documentation","Item 9: Schedule follow-up","Item 10: Final review"]
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
      <p className="hint">Check each item as completed.</p>
    </div>
  )
}
