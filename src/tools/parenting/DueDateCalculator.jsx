import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function DueDateCalculator() {
  const [mode, setMode] = useState('Last period')
  const [date, setDate] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    if (!date) { setOut(null); return setErr('Enter a date.') }
    const d = new Date(date + 'T00:00:00')
    if (isNaN(d)) { setOut(null); return setErr('Enter a valid date.') }
    const due = new Date(d)
    due.setDate(due.getDate() + (mode === 'Last period' ? 280 : 266))
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const daysAlong = Math.round((today - d) / 86400000)
    const weeks = Math.floor(daysAlong / 7), days = daysAlong % 7
    setErr('')
    setOut({ due: due.toLocaleDateString(), weeks, days, valid: daysAlong >= 0 && daysAlong <= 300 })
  }

  return (
    <div>
      <div className="row">
        <Field label="Calculate from"><select value={mode} onChange={(e) => setMode(e.target.value)}><option>Last period</option><option>Conception date</option></select></Field>
        <Field label={mode === 'Last period' ? 'First day of last period' : 'Conception date'}><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate due date</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Estimated due date: <strong>{out.due}</strong>
          {out.valid && <><br />As of today, that's about <strong>{out.weeks} weeks, {out.days} days</strong> along.</>}
        </p>
      )}
      <Msg kind="status">Estimate only, using Naegele's rule (280 days from LMP or 266 from conception) — your provider's ultrasound-based estimate is more accurate.</Msg>
    </div>
  )
}
