import { useState } from 'react'
import { Msg } from '../../components/ui.jsx'

export default function IconSizeRef() {
  const items = ["Step 1: Review and complete this item","Step 2: Review and complete this item","Step 3: Review and complete this item","Step 4: Review and complete this item","Step 5: Review and complete this item","Step 6: Review and complete this item","Step 7: Review and complete this item","Step 8: Review and complete this item","Step 9: Review and complete this item","Step 10: Review and complete this item"]
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
