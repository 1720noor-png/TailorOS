import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, thick: '1', width: '6', length: '8', qty: '1' })

export default function LumberBoardFeetCalculator() {
  const [rows, setRows] = useState([blank()])
  const [price, setPrice] = useState('')
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const totalBf = rows.reduce((a, r) => {
    const t = Number(r.thick), w = Number(r.width), l = Number(r.length), q = Number(r.qty)
    if (!(t > 0 && w > 0 && l > 0 && q > 0)) return a
    return a + (t * w * l * q) / 12
  }, 0)
  const cost = price !== '' ? totalBf * Number(price) : null

  return (
    <div>
      {rows.map((r, i) => (
        <div className="row" key={r.id}>
          <Field label={`Board ${i + 1} thickness (in)`}><input type="number" min="0" step="0.25" value={r.thick} onChange={(e) => upd(r.id, 'thick', e.target.value)} /></Field>
          <Field label="Width (in)"><input type="number" min="0" step="0.5" value={r.width} onChange={(e) => upd(r.id, 'width', e.target.value)} /></Field>
          <Field label="Length (ft)"><input type="number" min="0" step="0.5" value={r.length} onChange={(e) => upd(r.id, 'length', e.target.value)} /></Field>
          <Field label="Quantity"><input type="number" min="1" value={r.qty} onChange={(e) => upd(r.id, 'qty', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setRows((x) => (x.length > 1 ? x.filter((y) => y.id !== r.id) : x))} aria-label={`Remove board ${i + 1}`}>Remove</button>
        </div>
      ))}
      <Field label="Price per board foot ($, optional)"><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
      <div className="actions"><button className="btn ghost" onClick={() => setRows((r) => [...r, blank()])}>Add board</button></div>
      <p className="out" role="status">Total: <strong>{totalBf.toFixed(2)} board feet</strong>{cost !== null && <> — estimated cost <strong>${cost.toFixed(2)}</strong></>}</p>
      <Msg kind="status">Board feet = (thickness in × width in × length ft) ÷ 12, summed and multiplied by quantity for each board.</Msg>
    </div>
  )
}
