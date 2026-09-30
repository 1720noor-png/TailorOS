import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function TentCapacityChecker() {
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [people, setPeople] = useState('2')
  const [gear, setGear] = useState('Moderate gear')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const GEAR_SQFT = { 'Minimal gear': 10, 'Moderate gear': 15, 'Bulky gear (winter/family)': 22 }

  const calc = () => {
    const w = Number(width), l = Number(length), p = Number(people)
    if (!(w > 0 && l > 0 && p > 0)) { setOut(null); return setErr('Enter tent floor width, length and number of people greater than 0.') }
    const area = w * l
    const perPersonComfort = area / p
    const realComfortRating = Math.floor(area / GEAR_SQFT[gear])
    setErr('')
    setOut({ area: area.toFixed(1), perPerson: perPersonComfort.toFixed(1), realRating: realComfortRating })
  }

  return (
    <div>
      <div className="row">
        <Field label="Tent floor width (ft)"><input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} /></Field>
        <Field label="Tent floor length (ft)"><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Number of people"><input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} /></Field>
        <Field label="Gear load"><select value={gear} onChange={(e) => setGear(e.target.value)}>{Object.keys(GEAR_SQFT).map((g) => <option key={g}>{g}</option>)}</select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Check comfort fit</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Floor area: <strong>{out.area} sq ft</strong> — {out.perPerson} sq ft per person as you've entered it.<br />
          Realistically comfortable for about <strong>{out.realRating} people</strong> with {gear.toLowerCase()}.
        </p>
      )}
      <Msg kind="status">Manufacturer "sleeps N" ratings usually assume everyone lying shoulder-to-shoulder with no gear inside.</Msg>
    </div>
  )
}
