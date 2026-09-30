import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

let n = 0
const CATS = ['Furniture', 'Electronics', 'Clothing', 'Kitchen items', 'Jewelry & valuables', 'Other']
const blank = () => CATS.map((c) => ({ id: ++n, cat: c, value: '' }))

export default function RentersInsuranceCoverageEstimator() {
  const [rows, setRows] = useState(blank())
  const upd = (id, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, value: v } : x)))
  const total = rows.reduce((a, r) => a + (Number(r.value) || 0), 0)
  const recommended = total * 1.1 // small buffer for replacement cost vs actual cash value

  const text = 'Renters insurance inventory\n' + rows.map((r) => `${r.cat}: $${Number(r.value || 0).toFixed(2)}`).join('\n') + `\n\nTotal value: $${total.toFixed(2)}\nSuggested coverage (with buffer): $${recommended.toFixed(2)}`

  return (
    <div>
      {rows.map((r) => (
        <div className="row" key={r.id}>
          <Field label={r.cat}><input type="number" min="0" value={r.value} onChange={(e) => upd(r.id, e.target.value)} /></Field>
        </div>
      ))}
      <p className="out" role="status">Total belongings value: <strong>${total.toFixed(2)}</strong><br />Suggested coverage amount: <strong>${recommended.toFixed(2)}</strong></p>
      <div className="actions"><CopyBtn text={text} /></div>
    </div>
  )
}
