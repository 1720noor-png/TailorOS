import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, w: '', h: '' })

export default function DrywallSheetCalculator() {
  const [surfaces, setSurfaces] = useState([blank(), blank()])
  const [sheetSize, setSheetSize] = useState('4x8')
  const [waste, setWaste] = useState('10')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)
  const upd = (id, k, v) => setSurfaces((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const SHEET_AREA = { '4x8': 32, '4x10': 40, '4x12': 48 }

  const calc = () => {
    const used = surfaces.filter((s) => Number(s.w) > 0 && Number(s.h) > 0)
    if (!used.length) { setOut(null); return setErr('Add at least one wall/ceiling surface with width and height.') }
    const area = used.reduce((a, s) => a + Number(s.w) * Number(s.h), 0)
    const withWaste = area * (1 + (Number(waste) || 0) / 100)
    const sheets = Math.ceil(withWaste / SHEET_AREA[sheetSize])
    setErr('')
    setOut({ area: area.toFixed(0), sheets })
  }

  return (
    <div>
      {surfaces.map((s, i) => (
        <div className="row" key={s.id}>
          <Field label={`Surface ${i + 1} width (ft)`}><input type="number" min="0" value={s.w} onChange={(e) => upd(s.id, 'w', e.target.value)} /></Field>
          <Field label="Height (ft)"><input type="number" min="0" value={s.h} onChange={(e) => upd(s.id, 'h', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setSurfaces((x) => (x.length > 1 ? x.filter((y) => y.id !== s.id) : x))} aria-label={`Remove surface ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="row">
        <Field label="Sheet size"><select value={sheetSize} onChange={(e) => setSheetSize(e.target.value)}><option value="4x8">4×8 ft</option><option value="4x10">4×10 ft</option><option value="4x12">4×12 ft</option></select></Field>
        <Field label="Waste allowance (%)"><input type="number" min="0" value={waste} onChange={(e) => setWaste(e.target.value)} /></Field>
      </div>
      <div className="actions">
        <button className="btn ghost" onClick={() => setSurfaces((s) => [...s, blank()])}>Add surface</button>
        <button className="btn" onClick={calc}>Calculate sheets needed</button>
      </div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Total area: <strong>{out.area} sq ft</strong><br />You'll need about <strong>{out.sheets} sheets</strong> of drywall.</p>}
    </div>
  )
}
