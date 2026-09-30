import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const SUBS=[{"Spice":"Allspice","Substitute":"½ tsp cinnamon + ½ tsp cloves"},{"Spice":"Cardamom","Substitute":"½ tsp cinnamon + ½ tsp ginger"},{"Spice":"Chili Powder","Substitute":"Cayenne + cumin + garlic powder"},{"Spice":"Cinnamon","Substitute":"Allspice or nutmeg (¼ amount)"},{"Spice":"Cumin","Substitute":"Chili powder or caraway seeds"},{"Spice":"Ginger (fresh)","Substitute":"⅛ tsp ground ginger per 1 tbsp"},{"Spice":"Nutmeg","Substitute":"Cinnamon, allspice, or mace"},{"Spice":"Oregano","Substitute":"Marjoram or thyme"},{"Spice":"Paprika","Substitute":"Cayenne (use less) or chili powder"},{"Spice":"Saffron","Substitute":"Turmeric (for color only)"}]
export default function SpiceSubstitution() {
  const [q, setQ] = useState('')
  const f = SUBS.filter(s => !q.trim() || s.Spice.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <Field label="Search Spice"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="cumin" /></Field>
      <div className="out" role="status">
        {f.map((s,i) => <p key={i}><strong>{s.Spice}:</strong> {s.Substitute}</p>)}
      </div>
      <p className="hint">Emergency spice substitutions for cooking.</p>
    </div>
  )
}
