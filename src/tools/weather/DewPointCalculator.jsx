import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function DewPointCalculator() {
  const [temp, setTemp] = useState('25')
  const [rh, setRh] = useState('50')
  const [unit, setUnit] = useState('Celsius')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    let T = Number(temp), R = Number(rh)
    if (!(R > 0 && R <= 100)) { setOut(null); return setErr('Enter relative humidity between 1 and 100%.') }
    if (unit === 'Fahrenheit') T = (T - 32) * 5 / 9
    const a = 17.27, b = 237.7
    const alpha = (a * T) / (b + T) + Math.log(R / 100)
    let dp = (b * alpha) / (a - alpha)
    if (unit === 'Fahrenheit') dp = dp * 9 / 5 + 32
    setErr('')
    setOut(dp.toFixed(1))
  }

  const u = unit === 'Fahrenheit' ? '°F' : '°C'

  return (
    <div>
      <Field label="Units"><select value={unit} onChange={(e) => setUnit(e.target.value)}><option>Celsius</option><option>Fahrenheit</option></select></Field>
      <div className="row">
        <Field label={`Air temperature (${u})`}><input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} /></Field>
        <Field label="Relative humidity (%)"><input type="number" min="1" max="100" value={rh} onChange={(e) => setRh(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate dew point</button></div>
      <Msg>{err}</Msg>
      {out !== null && <p className="out" role="status">Dew point: <strong>{out}{u}</strong></p>}
      <Msg kind="status">Uses the Magnus formula — accurate for typical outdoor temperature and humidity ranges.</Msg>
    </div>
  )
}
