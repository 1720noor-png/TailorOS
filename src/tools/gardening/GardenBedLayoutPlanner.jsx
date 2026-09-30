import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, name: '', spacing: '' })

export default function GardenBedLayoutPlanner() {
  const [w, setW] = useState('')
  const [l, setL] = useState('')
  const [rows, setRows] = useState([{ ...blank(), name: 'Tomatoes', spacing: '24' }])
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const calc = () => {
    const width = Number(w), length = Number(l)
    if (!(width > 0 && length > 0)) { setOut(null); return setErr('Enter a bed width and length greater than 0 (in feet).') }
    const used = rows.filter((r) => r.name && Number(r.spacing) > 0)
    if (!used.length) { setOut(null); return setErr('Add at least one crop with a spacing in inches.') }
    const results = used.map((r) => {
      const spacingFt = Number(r.spacing) / 12
      const cols = Math.max(1, Math.floor(width / spacingFt))
      const linesAlongLength = Math.max(1, Math.floor(length / spacingFt))
      return { name: r.name, count: cols * linesAlongLength, cols, rowsCount: linesAlongLength }
    })
    setErr(''); setOut(results)
  }

  return (
    <div>
      <div className="row">
        <Field label="Bed width (ft)"><input type="number" min="0.5" step="0.5" value={w} onChange={(e) => setW(e.target.value)} /></Field>
        <Field label="Bed length (ft)"><input type="number" min="0.5" step="0.5" value={l} onChange={(e) => setL(e.target.value)} /></Field>
      </div>
      {rows.map((r, i) => (
        <div className="row" key={r.id}>
          <Field label={`Crop ${i + 1}`}><input value={r.name} onChange={(e) => upd(r.id, 'name', e.target.value)} placeholder="e.g. Carrots" /></Field>
          <Field label="Spacing needed (in)"><input type="number" min="1" value={r.spacing} onChange={(e) => upd(r.id, 'spacing', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setRows((x) => (x.length > 1 ? x.filter((y) => y.id !== r.id) : x))} aria-label={`Remove crop ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions">
        <button className="btn ghost" onClick={() => setRows((r) => [...r, blank()])}>Add crop</button>
        <button className="btn" onClick={calc}>Calculate layout</button>
      </div>
      <Msg>{err}</Msg>
      {out && (
        <div className="out" role="status">
          {out.map((o) => <p key={o.name}><strong>{o.name}</strong>: about {o.count} plants ({o.cols} across × {o.rowsCount} deep)</p>)}
        </div>
      )}
    </div>
  )
}
