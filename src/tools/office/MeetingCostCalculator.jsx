import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { money } from '../../components/print.js'
import { num } from '../../utils/calc.js'

export default function MeetingCostCalculator() {
  const [people, setPeople] = useState('5')
  const [avgSalary, setAvgSalary] = useState('60000')
  const [minutes, setMinutes] = useState('30')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const p = num(people), s = num(avgSalary), m = num(minutes)
    if (!Number.isFinite(p) || p <= 0) return setErr('Enter the number of attendees.'), setOut(null)
    if (!Number.isFinite(s) || s <= 0) return setErr('Enter an average annual salary.'), setOut(null)
    if (!Number.isFinite(m) || m <= 0) return setErr('Enter the meeting length in minutes.'), setOut(null)
    setErr('')
    const hourlyPerPerson = s / (52 * 40)
    const cost = hourlyPerPerson * p * (m / 60)
    setOut({ cost, perPerson: hourlyPerPerson * (m / 60), weekly: cost * 5, yearly: cost * 5 * 52 })
  }
  return (
    <div>
      <div className="row">
        <Field label="Number of attendees"><input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} /></Field>
        <Field label="Average annual salary"><input type="number" min="0" value={avgSalary} onChange={(e) => setAvgSalary(e.target.value)} /></Field>
        <Field label="Meeting length (minutes)"><input type="number" min="1" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate cost</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>This meeting costs about <strong>{money(out.cost)}</strong> in salary time.</p>
        <p>Cost per attendee: <strong>{money(out.perPerson)}</strong></p>
        <p>If held daily on weekdays: <strong>{money(out.weekly)}</strong>/week, <strong>{money(out.yearly)}</strong>/year</p>
      </div>}
      <p className="hint">Assumes a 40-hour work week and 52 weeks a year; a rough estimate to gauge whether a recurring meeting is worth its cost.</p>
    </div>
  )
}
