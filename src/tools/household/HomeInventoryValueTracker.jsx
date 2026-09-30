import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, item: '', room: '', value: '' })

export default function HomeInventoryValueTracker() {
  const [rows, setRows] = useState([blank(), blank(), blank()])
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))
  const total = rows.reduce((a, r) => a + (Number(r.value) || 0), 0)

  const byRoom = {}
  rows.forEach((r) => { if (r.room) byRoom[r.room] = (byRoom[r.room] || 0) + (Number(r.value) || 0) })

  const text = 'Home inventory\n\n' + rows.filter((r) => r.item).map((r) => `${r.item} (${r.room || 'Unspecified'}) — $${Number(r.value || 0).toFixed(2)}`).join('\n') + `\n\nTotal insured value: $${total.toFixed(2)}`

  return (
    <div>
      {rows.map((r, i) => (
        <div className="row" key={r.id}>
          <Field label={`Item ${i + 1}`}><input value={r.item} onChange={(e) => upd(r.id, 'item', e.target.value)} placeholder="e.g. Laptop" /></Field>
          <Field label="Room"><input value={r.room} onChange={(e) => upd(r.id, 'room', e.target.value)} placeholder="e.g. Office" /></Field>
          <Field label="Value ($)"><input type="number" min="0" step="0.01" value={r.value} onChange={(e) => upd(r.id, 'value', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setRows((x) => (x.length > 1 ? x.filter((y) => y.id !== r.id) : x))} aria-label={`Remove item ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setRows((r) => [...r, blank()])}>Add item</button></div>
      <p className="out" role="status">Total value: <strong>${total.toFixed(2)}</strong></p>
      {Object.keys(byRoom).length > 0 && <div className="out">{Object.entries(byRoom).map(([room, v]) => <p key={room}>{room}: ${v.toFixed(2)}</p>)}</div>}
      <div className="actions"><CopyBtn text={text} /><button className="btn ghost" onClick={() => download('home-inventory.txt', text)}>Download</button></div>
    </div>
  )
}
