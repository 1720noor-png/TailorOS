import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// Approximate lb of amendment per 100 sq ft to move pH by 1.0 point, in top 6-7 inches of soil (loam soil)
const RATE = {
  'Sandy': { down: 1.2, up: 3.5 },
  'Loam': { down: 1.5, up: 5 },
  'Clay': { down: 2, up: 7 },
}

export default function SoilPhAdjustmentCalculator() {
  const [cur, setCur] = useState('')
  const [target, setTarget] = useState('')
  const [area, setArea] = useState('')
  const [soil, setSoil] = useState('Loam')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(cur), t = Number(target), a = Number(area)
    if (!(c >= 3 && c <= 10) || !(t >= 3 && t <= 10) || !(a > 0)) { setOut(null); return setErr('Enter pH values between 3 and 10, and an area greater than 0.') }
    const diff = t - c
    if (Math.abs(diff) < 0.05) { setErr(''); return setOut({ msg: 'Current and target pH are already essentially equal — no amendment needed.' }) }
    const rate = diff > 0 ? RATE[soil].up : RATE[soil].down
    const lbs = Math.abs(diff) * rate * (a / 100)
    setErr('')
    setOut({ amount: lbs.toFixed(1), material: diff > 0 ? 'garden lime' : 'elemental sulfur', direction: diff > 0 ? 'raise' : 'lower' })
  }

  return (
    <div>
      <div className="row">
        <Field label="Current soil pH"><input type="number" step="0.1" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="e.g. 5.5" /></Field>
        <Field label="Target soil pH"><input type="number" step="0.1" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 6.5" /></Field>
      </div>
      <div className="row">
        <Field label="Bed area (sq ft)"><input type="number" min="1" value={area} onChange={(e) => setArea(e.target.value)} /></Field>
        <Field label="Soil type"><select value={soil} onChange={(e) => setSoil(e.target.value)}>{Object.keys(RATE).map((s) => <option key={s}>{s}</option>)}</select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && (out.msg
        ? <p className="out" role="status">{out.msg}</p>
        : <p className="out" role="status">Apply about <strong>{out.amount} lb</strong> of {out.material} per {area} sq ft to {out.direction} the pH toward your target.<br /><small>Work it into the top 6–7 inches and retest after a few weeks — large changes are best split into two applications.</small></p>)}
    </div>
  )
}
