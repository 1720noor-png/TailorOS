import { useState } from 'react'
import { Field } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, name: '', count: '1', status: 'Pending' })

export default function RsvpTracker() {
  const [rows, setRows] = useState([blank(), blank()])
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const attending = rows.filter((r) => r.status === 'Yes').reduce((a, r) => a + (Number(r.count) || 0), 0)
  const declined = rows.filter((r) => r.status === 'No').length
  const pending = rows.filter((r) => r.status === 'Pending').length

  return (
    <div>
      {rows.map((r, i) => (
        <div className="row" key={r.id}>
          <Field label={`Guest ${i + 1}`}><input value={r.name} onChange={(e) => upd(r.id, 'name', e.target.value)} placeholder="Name / party" /></Field>
          <Field label="Party size"><input type="number" min="1" value={r.count} onChange={(e) => upd(r.id, 'count', e.target.value)} /></Field>
          <Field label="Response"><select value={r.status} onChange={(e) => upd(r.id, 'status', e.target.value)}><option>Pending</option><option>Yes</option><option>No</option></select></Field>
          <button type="button" className="btn ghost" onClick={() => setRows((x) => (x.length > 1 ? x.filter((y) => y.id !== r.id) : x))} aria-label={`Remove guest ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setRows((r) => [...r, blank()])}>Add guest</button></div>
      <p className="out" role="status">Attending: <strong>{attending}</strong> guests · Declined: <strong>{declined}</strong> · Pending: <strong>{pending}</strong></p>
    </div>
  )
}
