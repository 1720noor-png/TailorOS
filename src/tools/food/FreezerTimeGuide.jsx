import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const DATA=[{"Food":"Ground Meat","Months":"3-4"},{"Food":"Steaks/Roasts","Months":"4-12"},{"Food":"Poultry (whole)","Months":"12"},{"Food":"Poultry (pieces)","Months":"9"},{"Food":"Fish (lean)","Months":"6-8"},{"Food":"Fish (fatty)","Months":"2-3"},{"Food":"Bread","Months":"3"},{"Food":"Soups/Stews","Months":"2-3"},{"Food":"Fruits","Months":"8-12"},{"Food":"Vegetables","Months":"8-12"}]
export default function FreezerTimeGuide() {
  const [q, setQ] = useState('')
  const f = DATA.filter(d => !q.trim() || d.Food.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <Field label="Search Food"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="chicken" /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th style={{textAlign:'left',padding:'4px 8px'}}>Food</th><th style={{padding:'4px 8px'}}>Months in Freezer</th></tr></thead>
          <tbody>{f.map((d,i) => <tr key={i}><td style={{padding:'4px 8px'}}>{d.Food}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{d.Months}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">Maximum recommended freezer storage times.</p>
    </div>
  )
}
