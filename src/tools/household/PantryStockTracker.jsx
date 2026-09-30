import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, item: '', have: '', par: '' })

export default function PantryStockTracker() {
  const [rows, setRows] = useState([blank(), blank(), blank()])
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))
  const lowStock = rows.filter((r) => r.item && Number(r.have) < Number(r.par))

  return (
    <div>
      {rows.map((r, i) => (
        <div className="row" key={r.id}>
          <Field label={`Item ${i + 1}`}><input value={r.item} onChange={(e) => upd(r.id, 'item', e.target.value)} placeholder="e.g. Rice" /></Field>
          <Field label="Have (qty)"><input type="number" min="0" value={r.have} onChange={(e) => upd(r.id, 'have', e.target.value)} /></Field>
          <Field label="Target stock level"><input type="number" min="0" value={r.par} onChange={(e) => upd(r.id, 'par', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setRows((x) => (x.length > 1 ? x.filter((y) => y.id !== r.id) : x))} aria-label={`Remove item ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setRows((r) => [...r, blank()])}>Add item</button></div>
      {lowStock.length > 0 ? (
        <div className="out" role="status">
          <p><strong>Shopping list ({lowStock.length}):</strong></p>
          {lowStock.map((r) => <p key={r.id}>{r.item} — need {Number(r.par) - Number(r.have)} more</p>)}
        </div>
      ) : <Msg kind="status">Everything is at or above target stock levels.</Msg>}
    </div>
  )
}
