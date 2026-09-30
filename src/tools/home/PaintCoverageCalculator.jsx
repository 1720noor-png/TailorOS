import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, w: '', h: '' })

export default function PaintCoverageCalculator() {
  const [walls, setWalls] = useState([blank(), blank()])
  const [opening, setOpening] = useState('20')
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState('350')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)
  const upd = (id, k, v) => setWalls((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const calc = () => {
    const used = walls.filter((w) => Number(w.w) > 0 && Number(w.h) > 0)
    if (!used.length) { setOut(null); return setErr('Add at least one wall with a width and height greater than 0.') }
    const c = Number(coats), cov = Number(coverage), op = Number(opening) || 0
    if (!(c > 0 && cov > 0)) { setOut(null); return setErr('Enter coats and coverage per gallon greater than 0.') }
    const area = used.reduce((a, w) => a + Number(w.w) * Number(w.h), 0) - op
    const netArea = Math.max(0, area)
    const gallons = (netArea * c) / cov
    setErr('')
    setOut({ area: netArea.toFixed(0), gallons: gallons.toFixed(2), gallonsRound: Math.ceil(gallons * 4) / 4 })
  }

  return (
    <div>
      {walls.map((w, i) => (
        <div className="row" key={w.id}>
          <Field label={`Wall ${i + 1} width (ft)`}><input type="number" min="0" value={w.w} onChange={(e) => upd(w.id, 'w', e.target.value)} /></Field>
          <Field label={`Wall ${i + 1} height (ft)`}><input type="number" min="0" value={w.h} onChange={(e) => upd(w.id, 'h', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setWalls((x) => (x.length > 1 ? x.filter((y) => y.id !== w.id) : x))} aria-label={`Remove wall ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="row">
        <Field label="Doors/windows to subtract (sq ft)"><input type="number" min="0" value={opening} onChange={(e) => setOpening(e.target.value)} /></Field>
        <Field label="Number of coats"><input type="number" min="1" value={coats} onChange={(e) => setCoats(e.target.value)} /></Field>
        <Field label="Coverage per gallon (sq ft)"><input type="number" min="1" value={coverage} onChange={(e) => setCoverage(e.target.value)} /></Field>
      </div>
      <div className="actions">
        <button className="btn ghost" onClick={() => setWalls((w) => [...w, blank()])}>Add wall</button>
        <button className="btn" onClick={calc}>Calculate</button>
      </div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Paintable area: <strong>{out.area} sq ft</strong><br />You'll need about <strong>{out.gallons} gallons</strong> — round up to <strong>{out.gallonsRound} gallons</strong> when buying.</p>}
    </div>
  )
}
