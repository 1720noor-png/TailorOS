import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// oz per person per day guidelines
const RATE = { water: 64, food: 24, fuel: 2.5 }

export default function CampingFoodQuantityCalculator() {
  const [people, setPeople] = useState('4')
  const [days, setDays] = useState('3')
  const [activity, setActivity] = useState('Moderate')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const ACTIVITY_FACTOR = { Light: 0.85, Moderate: 1, Strenuous: 1.25 }

  const calc = () => {
    const p = Number(people), d = Number(days)
    if (!(p > 0 && d > 0)) { setOut(null); return setErr('Enter number of people and days greater than 0.') }
    const f = ACTIVITY_FACTOR[activity]
    const waterOz = p * d * RATE.water
    const foodOz = p * d * RATE.food * f
    const fuelOz = p * d * RATE.fuel
    setErr('')
    setOut({
      waterGal: (waterOz / 128).toFixed(1),
      foodLb: (foodOz / 16).toFixed(1),
      fuelOz: fuelOz.toFixed(1),
    })
  }

  return (
    <div>
      <div className="row">
        <Field label="Number of people"><input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} /></Field>
        <Field label="Number of days"><input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} /></Field>
        <Field label="Activity level"><select value={activity} onChange={(e) => setActivity(e.target.value)}><option>Light</option><option>Moderate</option><option>Strenuous</option></select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate quantities</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Water: <strong>{out.waterGal} gallons</strong> total<br />
          Food: <strong>{out.foodLb} lb</strong> total<br />
          Stove fuel: <strong>{out.fuelOz} oz</strong>
        </p>
      )}
      <Msg kind="status">Standard backcountry rules of thumb — add extra water if you can't rely on a water source to filter from.</Msg>
    </div>
  )
}
