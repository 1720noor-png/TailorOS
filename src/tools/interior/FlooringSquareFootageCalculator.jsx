import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, w: '', l: '' })

export default function FlooringSquareFootageCalculator() {
  const [rooms, setRooms] = useState([blank()])
  const [boxCoverage, setBoxCoverage] = useState('20')
  const [waste, setWaste] = useState('10')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)
  const upd = (id, k, v) => setRooms((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const calc = () => {
    const used = rooms.filter((r) => Number(r.w) > 0 && Number(r.l) > 0)
    const bc = Number(boxCoverage)
    if (!used.length || !(bc > 0)) { setOut(null); return setErr('Add at least one room with width and length, and a box coverage greater than 0.') }
    const area = used.reduce((a, r) => a + Number(r.w) * Number(r.l), 0)
    const withWaste = area * (1 + (Number(waste) || 0) / 100)
    const boxes = Math.ceil(withWaste / bc)
    setErr('')
    setOut({ area: area.toFixed(0), boxes })
  }

  return (
    <div>
      {rooms.map((r, i) => (
        <div className="row" key={r.id}>
          <Field label={`Room ${i + 1} width (ft)`}><input type="number" min="0" value={r.w} onChange={(e) => upd(r.id, 'w', e.target.value)} /></Field>
          <Field label="Length (ft)"><input type="number" min="0" value={r.l} onChange={(e) => upd(r.id, 'l', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setRooms((x) => (x.length > 1 ? x.filter((y) => y.id !== r.id) : x))} aria-label={`Remove room ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="row">
        <Field label="Coverage per box (sq ft)"><input type="number" min="1" value={boxCoverage} onChange={(e) => setBoxCoverage(e.target.value)} /></Field>
        <Field label="Waste allowance (%)"><input type="number" min="0" value={waste} onChange={(e) => setWaste(e.target.value)} /></Field>
      </div>
      <div className="actions">
        <button className="btn ghost" onClick={() => setRooms((r) => [...r, blank()])}>Add room</button>
        <button className="btn" onClick={calc}>Calculate</button>
      </div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Total floor area: <strong>{out.area} sq ft</strong><br />You'll need about <strong>{out.boxes} boxes</strong> of flooring.</p>}
    </div>
  )
}
