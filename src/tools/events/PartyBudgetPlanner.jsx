import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const defaultCats = () => [
  { id: ++n, name: 'Venue', pct: '25' },
  { id: ++n, name: 'Food & drink', pct: '35' },
  { id: ++n, name: 'Decorations', pct: '15' },
  { id: ++n, name: 'Entertainment', pct: '15' },
  { id: ++n, name: 'Miscellaneous', pct: '10' },
]

export default function PartyBudgetPlanner() {
  const [budget, setBudget] = useState('1000')
  const [cats, setCats] = useState(defaultCats())
  const upd = (id, k, v) => setCats((c) => c.map((x) => (x.id === id ? { ...x, [k]: v } : x)))
  const b = Number(budget) || 0
  const totalPct = cats.reduce((a, c) => a + (Number(c.pct) || 0), 0)

  return (
    <div>
      <Field label="Total budget ($)"><input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} /></Field>
      {cats.map((c) => (
        <div className="row" key={c.id}>
          <Field label="Category"><input value={c.name} onChange={(e) => upd(c.id, 'name', e.target.value)} /></Field>
          <Field label="% of budget"><input type="number" min="0" max="100" value={c.pct} onChange={(e) => upd(c.id, 'pct', e.target.value)} /></Field>
          <span className="out">${((b * (Number(c.pct) || 0)) / 100).toFixed(2)}</span>
          <button type="button" className="btn ghost" onClick={() => setCats((x) => x.filter((y) => y.id !== c.id))} aria-label={`Remove ${c.name}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setCats((c) => [...c, { id: ++n, name: '', pct: '0' }])}>Add category</button></div>
      {totalPct !== 100 && <Msg kind={totalPct > 100 ? 'error' : 'status'}>Allocations total {totalPct}% — {totalPct > 100 ? 'over' : 'under'} your budget by {Math.abs(100 - totalPct)}%.</Msg>}
      <p className="out" role="status">Remaining unallocated: <strong>${(b * (100 - totalPct) / 100).toFixed(2)}</strong></p>
    </div>
  )
}
