import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { num } from '../../utils/calc.js'

const G = 6.674e-11

export default function OrbitalPeriodCalculator() {
  const [mode, setMode] = useState('earth')
  const [semiMajor, setSemiMajor] = useState('1')
  const [centralMass, setCentralMass] = useState('1.989e30')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const a = num(semiMajor)
    if (!Number.isFinite(a) || a <= 0) return setErr('Enter a semi-major axis greater than zero.'), setOut(null)
    setErr('')
    if (mode === 'earth') {
      const years = Math.pow(a, 1.5)
      setOut({ years, days: years * 365.25 })
    } else {
      const M = num(centralMass)
      if (!Number.isFinite(M) || M <= 0) return setErr('Enter the central body mass in kg.'), setOut(null)
      const aMeters = a * 1.496e11
      const seconds = 2 * Math.PI * Math.sqrt(Math.pow(aMeters, 3) / (G * M))
      setOut({ years: seconds / (365.25 * 86400), days: seconds / 86400 })
    }
  }
  return (
    <div>
      <div className="row">
        <Field label="Method"><select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="earth">Kepler's third law (relative to Earth's orbit)</option>
          <option value="mass">From central body mass (Newton's form)</option>
        </select></Field>
        <Field label="Semi-major axis (AU)"><input type="number" min="0" step="0.001" value={semiMajor} onChange={(e) => setSemiMajor(e.target.value)} /></Field>
        {mode === 'mass' && <Field label="Central body mass (kg)"><input value={centralMass} onChange={(e) => setCentralMass(e.target.value)} placeholder="e.g. 1.989e30 for the Sun" /></Field>}
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate period</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Orbital period: <strong>{out.years.toFixed(4)} years</strong> (~{out.days.toFixed(1)} days)</p>
      </div>}
      <p className="hint">Kepler's third law (T² ∝ a³) assumes the orbit is around a Sun-like star; the mass-based form works for any two-body orbit.</p>
    </div>
  )
}
