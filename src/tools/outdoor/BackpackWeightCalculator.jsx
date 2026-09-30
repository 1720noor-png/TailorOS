import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, item: '', oz: '' })

export default function BackpackWeightCalculator() {
  const [bodyWeight, setBodyWeight] = useState('160')
  const [items, setItems] = useState([blank(), blank(), blank()])
  const upd = (id, k, v) => setItems((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const totalOz = items.reduce((a, i) => a + (Number(i.oz) || 0), 0)
  const totalLb = totalOz / 16
  const bw = Number(bodyWeight) || 0
  const pct = bw > 0 ? (totalLb / bw) * 100 : 0

  return (
    <div>
      <Field label="Your body weight (lb)"><input type="number" min="0" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} /></Field>
      {items.map((it, i) => (
        <div className="row" key={it.id}>
          <Field label={`Item ${i + 1}`}><input value={it.item} onChange={(e) => upd(it.id, 'item', e.target.value)} placeholder="e.g. Sleeping bag" /></Field>
          <Field label="Weight (oz)"><input type="number" min="0" step="0.1" value={it.oz} onChange={(e) => upd(it.id, 'oz', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setItems((x) => (x.length > 1 ? x.filter((y) => y.id !== it.id) : x))} aria-label={`Remove item ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setItems((i) => [...i, blank()])}>Add item</button></div>
      <p className="out" role="status">Total pack weight: <strong>{totalLb.toFixed(1)} lb</strong> ({totalOz.toFixed(0)} oz){bw > 0 && <> — <strong>{pct.toFixed(1)}%</strong> of your body weight</>}</p>
      {pct > 20 && <Msg>Over 20% of body weight is generally considered heavy for backpacking — look for lighter gear or fewer items.</Msg>}
    </div>
  )
}
