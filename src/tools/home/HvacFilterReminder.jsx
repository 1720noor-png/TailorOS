import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const TYPES = { 'Fiberglass (basic)': 30, 'Pleated 1-inch': 60, 'Pleated 4-5 inch': 120, 'HEPA': 180, 'Washable / reusable': 30 }

export default function HvacFilterReminder() {
  const [type, setType] = useState('Pleated 1-inch')
  const [last, setLast] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    if (!last) { setOut(null); return setErr('Enter the date you last replaced the filter.') }
    const l = new Date(last + 'T00:00:00')
    if (isNaN(l)) { setOut(null); return setErr('Enter a valid date.') }
    const days = TYPES[type]
    const next = new Date(l); next.setDate(next.getDate() + days)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const daysLeft = Math.round((next - today) / 86400000)
    setErr('')
    setOut({ next: next.toLocaleDateString(), daysLeft })
  }

  return (
    <div>
      <div className="row">
        <Field label="Filter type"><select value={type} onChange={(e) => setType(e.target.value)}>{Object.keys(TYPES).map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Last replaced"><input type="date" value={last} onChange={(e) => setLast(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate next change</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Replace again around <strong>{out.next}</strong>.<br />
          {out.daysLeft < 0
            ? <strong style={{ color: 'var(--danger, #c0392b)' }}>Overdue by {Math.abs(out.daysLeft)} day{Math.abs(out.daysLeft) === 1 ? '' : 's'}!</strong>
            : <>That's <strong>{out.daysLeft} day{out.daysLeft === 1 ? '' : 's'}</strong> from today.</>}
        </p>
      )}
    </div>
  )
}
