import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// yards per square foot by weight category (approx, worsted-weight baseline scaled)
const WEIGHT = { 'Lace / Fingering': 400, 'Sport / DK': 250, 'Worsted': 160, 'Bulky': 100, 'Super Bulky': 60 }

export default function YarnRequirementEstimator() {
  const [w, setW] = useState('20')
  const [h, setH] = useState('60')
  const [weight, setWeight] = useState('Worsted')
  const [skeinYd, setSkeinYd] = useState('220')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const width = Number(w), height = Number(h), sy = Number(skeinYd)
    if (!(width > 0 && height > 0 && sy > 0)) { setOut(null); return setErr('Enter width, height and skein yardage greater than 0.') }
    const sqft = (width * height) / 144
    const ydPerSqft = WEIGHT[weight]
    const totalYd = sqft * ydPerSqft
    const skeins = Math.ceil(totalYd / sy)
    setErr('')
    setOut({ totalYd: Math.round(totalYd), skeins })
  }

  return (
    <div>
      <div className="row">
        <Field label="Project width (in)"><input type="number" min="1" value={w} onChange={(e) => setW(e.target.value)} /></Field>
        <Field label="Project height/length (in)"><input type="number" min="1" value={h} onChange={(e) => setH(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Yarn weight"><select value={weight} onChange={(e) => setWeight(e.target.value)}>{Object.keys(WEIGHT).map((w2) => <option key={w2}>{w2}</option>)}</select></Field>
        <Field label="Yardage per skein"><input type="number" min="1" value={skeinYd} onChange={(e) => setSkeinYd(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate yarn needed</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Approximately <strong>{out.totalYd} yards</strong> needed — about <strong>{out.skeins} skein{out.skeins === 1 ? '' : 's'}</strong>.</p>}
      <Msg kind="status">Rough estimate based on typical density for the weight chosen — stitch pattern and tension change actual usage, so buy one extra skein when possible.</Msg>
    </div>
  )
}
