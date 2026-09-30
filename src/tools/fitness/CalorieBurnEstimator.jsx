import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { num } from '../../utils/calc.js'

const ACTIVITIES = [
  ['Walking (moderate)', 3.5], ['Running (6 mph)', 9.8], ['Cycling (moderate)', 7.5], ['Swimming (moderate)', 7.0],
  ['Weight training', 5.0], ['Yoga', 2.5], ['Hiking', 6.0], ['Dancing', 5.5], ['Jump rope', 11.0], ['Basketball', 6.5],
]

export default function CalorieBurnEstimator() {
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState('kg')
  const [activity, setActivity] = useState(ACTIVITIES[0][0])
  const [minutes, setMinutes] = useState('30')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const w = num(weight), m = num(minutes)
    if (!Number.isFinite(w) || w <= 0) return setErr('Enter your weight.'), setOut(null)
    if (!Number.isFinite(m) || m <= 0) return setErr('Enter the duration in minutes.'), setOut(null)
    setErr('')
    const kg = unit === 'kg' ? w : w * 0.453592
    const met = ACTIVITIES.find((a) => a[0] === activity)[1]
    const calories = met * kg * (m / 60)
    setOut({ calories })
  }
  return (
    <div>
      <div className="row">
        <Field label="Weight"><input type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} /></Field>
        <Field label="Unit"><select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="kg">kg</option><option value="lb">lb</option></select></Field>
        <Field label="Activity"><select value={activity} onChange={(e) => setActivity(e.target.value)}>{ACTIVITIES.map(([a]) => <option key={a} value={a}>{a}</option>)}</select></Field>
        <Field label="Duration (minutes)"><input type="number" min="0" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate calories burned</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status"><p>Estimated calories burned: <strong>{out.calories.toFixed(0)} kcal</strong></p></div>}
      <p className="hint">Based on standard MET (metabolic equivalent) values — actual burn varies with intensity, fitness level and individual metabolism.</p>
    </div>
  )
}
