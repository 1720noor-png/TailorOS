import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { num } from '../../utils/calc.js'

const ZONES = [
  ['Zone 1 — Warm up', 0.5, 0.6], ['Zone 2 — Fat burn', 0.6, 0.7], ['Zone 3 — Aerobic', 0.7, 0.8],
  ['Zone 4 — Anaerobic', 0.8, 0.9], ['Zone 5 — Max effort', 0.9, 1.0],
]

export default function HeartRateZoneCalculator() {
  const [age, setAge] = useState('')
  const [rest, setRest] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const a = num(age)
    const r = String(rest).trim() === '' ? null : num(rest)
    if (!Number.isFinite(a) || a <= 0 || a > 120) return setErr('Enter a valid age.'), setOut(null)
    setErr('')
    const max = 220 - a
    const zones = ZONES.map(([label, lo, hi]) => {
      if (r != null && Number.isFinite(r)) {
        // Karvonen method
        return [label, Math.round((max - r) * lo + r), Math.round((max - r) * hi + r)]
      }
      return [label, Math.round(max * lo), Math.round(max * hi)]
    })
    setOut({ max, zones })
  }
  return (
    <div>
      <div className="row">
        <Field label="Age"><input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} /></Field>
        <Field label="Resting heart rate (optional, for Karvonen method)"><input type="number" min="0" value={rest} onChange={(e) => setRest(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate zones</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Estimated max heart rate: <strong>{out.max} bpm</strong></p>
        {out.zones.map(([label, lo, hi]) => <p key={label}>{label}: <strong>{lo}–{hi} bpm</strong></p>)}
      </div>}
      <p className="hint">Max heart rate is estimated as 220 minus age; providing resting heart rate uses the more precise Karvonen method. General guidance, not medical advice.</p>
    </div>
  )
}
