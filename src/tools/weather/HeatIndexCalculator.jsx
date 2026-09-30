import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function HeatIndexCalculator() {
  const [temp, setTemp] = useState('90')
  const [rh, setRh] = useState('60')
  const [unit, setUnit] = useState('Fahrenheit')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    let T = Number(temp), R = Number(rh)
    if (!(R >= 0 && R <= 100)) { setOut(null); return setErr('Enter relative humidity between 0 and 100%.') }
    if (unit === 'Celsius') T = T * 9 / 5 + 32
    if (T < 80) { setErr(''); setOut({ val: T.toFixed(1), note: true }) ; return }
    const c = [-42.379, 2.04901523, 10.14333127, -0.22475541, -0.00683783, -0.05481717, 0.00122874, 0.00085282, -0.00000199]
    const hi = c[0] + c[1] * T + c[2] * R + c[3] * T * R + c[4] * T * T + c[5] * R * R + c[6] * T * T * R + c[7] * T * R * R + c[8] * T * T * R * R
    const out = unit === 'Celsius' ? (hi - 32) * 5 / 9 : hi
    setErr('')
    setOut({ val: out.toFixed(1), note: false })
  }

  const u = unit === 'Celsius' ? '°C' : '°F'

  return (
    <div>
      <Field label="Units"><select value={unit} onChange={(e) => setUnit(e.target.value)}><option>Fahrenheit</option><option>Celsius</option></select></Field>
      <div className="row">
        <Field label={`Air temperature (${u})`}><input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} /></Field>
        <Field label="Relative humidity (%)"><input type="number" min="0" max="100" value={rh} onChange={(e) => setRh(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate heat index</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">{out.note ? <>Below 80°F, heat index equals air temperature: <strong>{out.val}{u}</strong></> : <>Heat index (feels like): <strong>{out.val}{u}</strong></>}</p>}
    </div>
  )
}
