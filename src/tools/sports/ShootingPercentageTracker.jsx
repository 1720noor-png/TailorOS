import { useState } from 'react'
import { Field } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, label: '', made: '', att: '' })

export default function ShootingPercentageTracker() {
  const [rows, setRows] = useState([{ ...blank(), label: 'Game 1' }])
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const withPct = rows.map((r) => {
    const m = Number(r.made), a = Number(r.att)
    const pct = a > 0 ? ((m / a) * 100).toFixed(1) : null
    return { ...r, pct }
  })
  const totMade = rows.reduce((a, r) => a + (Number(r.made) || 0), 0)
  const totAtt = rows.reduce((a, r) => a + (Number(r.att) || 0), 0)
  const overall = totAtt > 0 ? ((totMade / totAtt) * 100).toFixed(1) : null

  return (
    <div>
      {withPct.map((r, i) => (
        <div className="row" key={r.id}>
          <Field label={`Entry ${i + 1}`}><input value={r.label} onChange={(e) => upd(r.id, 'label', e.target.value)} placeholder="Game / practice name" /></Field>
          <Field label="Made"><input type="number" min="0" value={r.made} onChange={(e) => upd(r.id, 'made', e.target.value)} /></Field>
          <Field label="Attempts"><input type="number" min="0" value={r.att} onChange={(e) => upd(r.id, 'att', e.target.value)} /></Field>
          <span className="out">{r.pct !== null ? `${r.pct}%` : '—'}</span>
          <button type="button" className="btn ghost" onClick={() => setRows((x) => (x.length > 1 ? x.filter((y) => y.id !== r.id) : x))} aria-label={`Remove entry ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setRows((r) => [...r, blank()])}>Add entry</button></div>
      {overall !== null && <p className="out" role="status">Overall: <strong>{totMade}/{totAtt}</strong> — <strong>{overall}%</strong></p>}
    </div>
  )
}
