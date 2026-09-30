import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const TEMPS=[{"Food":"Chicken","Internal":"165°F / 74°C","Notes":"All poultry"},{"Food":"Ground Beef","Internal":"160°F / 71°C","Notes":"Burgers, meatloaf"},{"Food":"Beef Steak (Medium)","Internal":"145°F / 63°C","Notes":"3 min rest"},{"Food":"Pork","Internal":"145°F / 63°C","Notes":"3 min rest"},{"Food":"Fish","Internal":"145°F / 63°C","Notes":"Flakes easily"},{"Food":"Ham","Internal":"145°F / 63°C","Notes":"Fresh ham"},{"Food":"Eggs","Internal":"160°F / 71°C","Notes":"Dishes with eggs"},{"Food":"Leftovers","Internal":"165°F / 74°C","Notes":"Reheating"}]
export default function CookingTempGuide() {
  const [q, setQ] = useState('')
  const f = TEMPS.filter(t => !q.trim() || t.Food.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <Field label="Search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="chicken" /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th style={{textAlign:'left',padding:'4px 8px'}}>Food</th><th style={{padding:'4px 8px'}}>Safe Internal Temp</th><th style={{padding:'4px 8px'}}>Notes</th></tr></thead>
          <tbody>{f.map((t,i) => <tr key={i}><td style={{padding:'4px 8px',fontWeight:'bold'}}>{t.Food}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{t.Internal}</td><td style={{padding:'4px 8px',color:'#666'}}>{t.Notes}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">USDA safe minimum cooking temperatures.</p>
    </div>
  )
}
