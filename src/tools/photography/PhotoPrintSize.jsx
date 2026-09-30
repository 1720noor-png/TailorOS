import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const SIZES=[{"Print":"4×6\"","MinMP":"2 MP","MinPx":"1200×1800"},{"Print":"5×7\"","MinMP":"3 MP","MinPx":"1500×2100"},{"Print":"8×10\"","MinMP":"5 MP","MinPx":"2400×3000"},{"Print":"11×14\"","MinMP":"8 MP","MinPx":"3300×4200"},{"Print":"16×20\"","MinMP":"12 MP","MinPx":"4800×6000"},{"Print":"20×30\"","MinMP":"18 MP","MinPx":"6000×9000"},{"Print":"24×36\"","MinMP":"24 MP","MinPx":"7200×10800"}]
export default function PhotoPrintSize() {
  const [q, setQ] = useState('')
  const f = SIZES.filter(s => !q.trim() || s.Print.includes(q) || s.MinMP.includes(q))
  return (
    <div>
      <Field label="Search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="8x10" /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th style={{textAlign:'left',padding:'4px 8px'}}>Print Size</th><th style={{padding:'4px 8px'}}>Min Resolution</th><th style={{padding:'4px 8px'}}>Min Pixels</th></tr></thead>
          <tbody>{f.map((s,i) => <tr key={i}><td style={{padding:'4px 8px'}}>{s.Print}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{s.MinMP}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{s.MinPx}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">Minimum resolution at 300 DPI print quality.</p>
    </div>
  )
}
