import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, name: '', qty: '1', cost: '' })

export default function CraftProjectCostCalculator() {
  const [mats, setMats] = useState([blank(), blank()])
  const [hours, setHours] = useState('2')
  const [rate, setRate] = useState('15')
  const [markup, setMarkup] = useState('50')
  const upd = (id, k, v) => setMats((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const matCost = mats.reduce((a, m) => a + (Number(m.qty) || 0) * (Number(m.cost) || 0), 0)
  const laborCost = (Number(hours) || 0) * (Number(rate) || 0)
  const total = matCost + laborCost
  const price = total * (1 + (Number(markup) || 0) / 100)

  return (
    <div>
      {mats.map((m, i) => (
        <div className="row" key={m.id}>
          <Field label={`Material ${i + 1}`}><input value={m.name} onChange={(e) => upd(m.id, 'name', e.target.value)} placeholder="e.g. Beads" /></Field>
          <Field label="Quantity"><input type="number" min="0" value={m.qty} onChange={(e) => upd(m.id, 'qty', e.target.value)} /></Field>
          <Field label="Cost each ($)"><input type="number" min="0" step="0.01" value={m.cost} onChange={(e) => upd(m.id, 'cost', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setMats((x) => (x.length > 1 ? x.filter((y) => y.id !== m.id) : x))} aria-label={`Remove material ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setMats((m) => [...m, blank()])}>Add material</button></div>
      <div className="row">
        <Field label="Time spent (hours)"><input type="number" min="0" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
        <Field label="Your hourly rate ($)"><input type="number" min="0" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
        <Field label="Markup for selling (%)"><input type="number" min="0" value={markup} onChange={(e) => setMarkup(e.target.value)} /></Field>
      </div>
      <p className="out" role="status">
        Materials: <strong>${matCost.toFixed(2)}</strong> · Labor: <strong>${laborCost.toFixed(2)}</strong> · Total cost: <strong>${total.toFixed(2)}</strong><br />
        Suggested sale price: <strong>${price.toFixed(2)}</strong>
      </p>
      <Msg kind="status">Everything updates live as you type — no button needed.</Msg>
    </div>
  )
}
