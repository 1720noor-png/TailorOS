import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const LAYOUTS = {
  'Living room (all legs on)': (w, l) => ({ w: Math.max(2, w - 2), l: Math.max(2, l - 2) }),
  'Living room (front legs on)': (w, l) => ({ w: Math.max(2, w - 3), l: Math.max(2, l - 3) }),
  'Dining room (chairs stay on)': (w, l) => ({ w: w + 4, l: l + 4 }),
  'Bedroom (under bed + nightstands)': (w, l) => ({ w: w + 4, l: l + 3 }),
}

export default function RugSizeCalculator() {
  const [space, setSpace] = useState('Living room (all legs on)')
  const [w, setW] = useState('')
  const [l, setL] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const W = Number(w), L = Number(l)
    if (!(W > 0 && L > 0)) { setOut(null); return setErr('Enter the furniture group or room dimensions greater than 0 (in feet).') }
    const r = LAYOUTS[space](W, L)
    setErr('')
    setOut({ w: r.w.toFixed(1), l: r.l.toFixed(1) })
  }

  return (
    <div>
      <Field label="Setup"><select value={space} onChange={(e) => setSpace(e.target.value)}>{Object.keys(LAYOUTS).map((s) => <option key={s}>{s}</option>)}</select></Field>
      <div className="row">
        <Field label={space.startsWith('Dining') || space.startsWith('Bedroom') ? 'Table/bed width (ft)' : 'Furniture group width (ft)'}><input type="number" min="0" step="0.1" value={w} onChange={(e) => setW(e.target.value)} /></Field>
        <Field label={space.startsWith('Dining') || space.startsWith('Bedroom') ? 'Table/bed length (ft)' : 'Furniture group length (ft)'}><input type="number" min="0" step="0.1" value={l} onChange={(e) => setL(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Suggest rug size</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Suggested rug size: <strong>{out.w}ft × {out.l}ft</strong> (round up to the nearest standard size, e.g. 8×10, 9×12).</p>}
    </div>
  )
}
