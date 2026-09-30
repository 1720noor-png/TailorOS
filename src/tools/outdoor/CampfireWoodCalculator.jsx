import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// approx lb of firewood per hour by fire purpose
const RATE = { 'Small cooking fire': 3, 'Evening campfire (social)': 6, 'Large bonfire': 12, 'Cold-weather survival fire': 10 }

export default function CampfireWoodCalculator() {
  const [hours, setHours] = useState('4')
  const [purpose, setPurpose] = useState('Evening campfire (social)')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const h = Number(hours)
    if (!(h > 0)) { setOut(null); return setErr('Enter hours greater than 0.') }
    const lb = h * RATE[purpose]
    setErr('')
    setOut({ lb: lb.toFixed(0), bundles: Math.ceil(lb / 20) }) // typical store bundle ~20lb
  }

  return (
    <div>
      <div className="row">
        <Field label="Hours you'll keep it burning"><input type="number" min="0.5" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
        <Field label="Fire purpose"><select value={purpose} onChange={(e) => setPurpose(e.target.value)}>{Object.keys(RATE).map((p) => <option key={p}>{p}</option>)}</select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate wood needed</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">You'll need about <strong>{out.lb} lb</strong> of firewood — roughly <strong>{out.bundles} store bundles</strong> (~20 lb each).</p>}
      <Msg kind="status">Only gather or buy wood where it's legal and permitted — check local fire restrictions before you go.</Msg>
    </div>
  )
}
