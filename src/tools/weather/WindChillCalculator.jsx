import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function WindChillCalculator() {
  const [temp, setTemp] = useState('20')
  const [wind, setWind] = useState('15')
  const [unit, setUnit] = useState('F / mph')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    let t = Number(temp), w = Number(wind)
    if (!(w >= 0)) { setOut(null); return setErr('Enter a wind speed of 0 or more.') }
    if (unit === 'C / km/h') { t = t * 9 / 5 + 32; w = w * 0.621371 }
    if (t > 50 || w < 3) { setOut(null); return setErr('Wind chill only applies below 50°F (10°C) with wind of at least 3 mph (5 km/h).') }
    const wc = 35.74 + 0.6215 * t - 35.75 * Math.pow(w, 0.16) + 0.4275 * t * Math.pow(w, 0.16)
    const wcOut = unit === 'C / km/h' ? (wc - 32) * 5 / 9 : wc
    setErr('')
    setOut(wcOut.toFixed(1))
  }

  const u = unit === 'C / km/h' ? '°C' : '°F'

  return (
    <div>
      <Field label="Units"><select value={unit} onChange={(e) => setUnit(e.target.value)}><option>F / mph</option><option>C / km/h</option></select></Field>
      <div className="row">
        <Field label={`Air temperature (${u})`}><input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} /></Field>
        <Field label={`Wind speed (${unit === 'C / km/h' ? 'km/h' : 'mph'})`}><input type="number" min="0" value={wind} onChange={(e) => setWind(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate wind chill</button></div>
      <Msg>{err}</Msg>
      {out !== null && <p className="out" role="status">Wind chill: <strong>{out}{u}</strong></p>}
    </div>
  )
}
