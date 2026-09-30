import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, w: '', l: '', qty: '1' })

export default function FabricYardageCalculator() {
  const [pieces, setPieces] = useState([blank()])
  const [fabricW, setFabricW] = useState('45')
  const [waste, setWaste] = useState('10')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)
  const upd = (id, k, v) => setPieces((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const calc = () => {
    const used = pieces.filter((p) => Number(p.w) > 0 && Number(p.l) > 0 && Number(p.qty) > 0)
    const fw = Number(fabricW)
    if (!used.length || !(fw > 0)) { setOut(null); return setErr('Add at least one piece with width, length and quantity greater than 0, and a fabric width.') }
    // pieces per row across fabric width, then rows needed for total qty, sum length used
    let totalLenIn = 0
    used.forEach((p) => {
      const piecesPerRow = Math.max(1, Math.floor(fw / Number(p.w)))
      const rows = Math.ceil(Number(p.qty) / piecesPerRow)
      totalLenIn += rows * Number(p.l)
    })
    const wastePct = Number(waste) || 0
    const totalWithWaste = totalLenIn * (1 + wastePct / 100)
    const yards = totalWithWaste / 36
    setErr('')
    setOut({ yards: yards.toFixed(2), yardsRound: Math.ceil(yards * 4) / 4 })
  }

  return (
    <div>
      {pieces.map((p, i) => (
        <div className="row" key={p.id}>
          <Field label={`Piece ${i + 1} width (in)`}><input type="number" min="0" value={p.w} onChange={(e) => upd(p.id, 'w', e.target.value)} /></Field>
          <Field label="Length (in)"><input type="number" min="0" value={p.l} onChange={(e) => upd(p.id, 'l', e.target.value)} /></Field>
          <Field label="Quantity"><input type="number" min="1" value={p.qty} onChange={(e) => upd(p.id, 'qty', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setPieces((x) => (x.length > 1 ? x.filter((y) => y.id !== p.id) : x))} aria-label={`Remove piece ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="row">
        <Field label="Fabric width (in)"><input type="number" min="1" value={fabricW} onChange={(e) => setFabricW(e.target.value)} /></Field>
        <Field label="Waste / seam allowance buffer (%)"><input type="number" min="0" value={waste} onChange={(e) => setWaste(e.target.value)} /></Field>
      </div>
      <div className="actions">
        <button className="btn ghost" onClick={() => setPieces((p) => [...p, blank()])}>Add piece</button>
        <button className="btn" onClick={calc}>Calculate yardage</button>
      </div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">You'll need about <strong>{out.yards} yards</strong> — round up to <strong>{out.yardsRound} yards</strong> when buying.</p>}
    </div>
  )
}
