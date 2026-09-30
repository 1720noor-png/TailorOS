import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function YearsToRetirementCountdown() {
  const [birthDate, setBirthDate] = useState('')
  const [retireAge, setRetireAge] = useState('65')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    if (!birthDate) { setOut(null); return setErr('Enter your birth date.') }
    const b = new Date(birthDate + 'T00:00:00')
    if (isNaN(b)) { setOut(null); return setErr('Enter a valid date.') }
    const r = Number(retireAge)
    const retireDate = new Date(b); retireDate.setFullYear(retireDate.getFullYear() + r)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const diffDays = Math.round((retireDate - today) / 86400000)
    setErr('')
    setOut({ date: retireDate.toLocaleDateString(), years: (diffDays / 365.25).toFixed(1), days: diffDays, weekdaysLeft: Math.round(diffDays * 5 / 7) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Your birth date"><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></Field>
        <Field label="Target retirement age"><input type="number" min="30" max="90" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate countdown</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Target retirement date: <strong>{out.date}</strong><br />That's about <strong>{out.years} years</strong> ({out.days.toLocaleString()} days, ~{out.weekdaysLeft.toLocaleString()} working days) from today.</p>}
    </div>
  )
}
