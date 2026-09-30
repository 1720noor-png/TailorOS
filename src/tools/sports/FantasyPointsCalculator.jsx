import { useState } from 'react'
import { Field } from '../../components/ui.jsx'

let n = 0
const defaultStats = () => [
  { id: ++n, name: 'Points', value: '', weight: '1' },
  { id: ++n, name: 'Rebounds', value: '', weight: '1.2' },
  { id: ++n, name: 'Assists', value: '', weight: '1.5' },
  { id: ++n, name: 'Steals', value: '', weight: '3' },
  { id: ++n, name: 'Blocks', value: '', weight: '3' },
  { id: ++n, name: 'Turnovers', value: '', weight: '-1' },
]

export default function FantasyPointsCalculator() {
  const [stats, setStats] = useState(defaultStats())
  const upd = (id, k, v) => setStats((s) => s.map((x) => (x.id === id ? { ...x, [k]: v } : x)))
  const total = stats.reduce((a, s) => a + (Number(s.value) || 0) * (Number(s.weight) || 0), 0)

  return (
    <div>
      {stats.map((s, i) => (
        <div className="row" key={s.id}>
          <Field label={`Stat ${i + 1} name`}><input value={s.name} onChange={(e) => upd(s.id, 'name', e.target.value)} /></Field>
          <Field label="Value"><input type="number" step="0.1" value={s.value} onChange={(e) => upd(s.id, 'value', e.target.value)} /></Field>
          <Field label="Points per unit"><input type="number" step="0.1" value={s.weight} onChange={(e) => upd(s.id, 'weight', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setStats((x) => x.filter((y) => y.id !== s.id))} aria-label={`Remove ${s.name}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setStats((s) => [...s, { id: ++n, name: '', value: '', weight: '1' }])}>Add stat category</button></div>
      <p className="out" role="status">Total fantasy points: <strong>{total.toFixed(2)}</strong></p>
      <small>Default weights follow a common basketball scoring format — edit the name, value and per-unit points for any sport or league rules.</small>
    </div>
  )
}
