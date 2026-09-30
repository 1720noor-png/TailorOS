import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, day: '', min: '' })
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ScreenTimeTracker() {
  const [limit, setLimit] = useState('120')
  const [rows, setRows] = useState(DAYS.map((d) => ({ id: ++n, day: d, min: '' })))
  const upd = (id, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, min: v } : x)))
  const used = rows.filter((r) => r.min !== '')
  const total = used.reduce((a, r) => a + Number(r.min), 0)
  const avg = used.length ? total / used.length : 0
  const lim = Number(limit) || 0

  return (
    <div>
      <Field label="Recommended daily limit (minutes)"><input type="number" min="0" value={limit} onChange={(e) => setLimit(e.target.value)} /></Field>
      {rows.map((r) => (
        <div className="row" key={r.id}>
          <Field label={r.day}><input type="number" min="0" value={r.min} onChange={(e) => upd(r.id, e.target.value)} placeholder="minutes" /></Field>
          {lim > 0 && r.min !== '' && Number(r.min) > lim && <Msg>Over the {lim}-min limit by {Number(r.min) - lim} min</Msg>}
        </div>
      ))}
      {used.length > 0 && (
        <p className="out" role="status">
          Weekly total: <strong>{Math.floor(total / 60)}h {total % 60}m</strong><br />
          Daily average: <strong>{Math.round(avg)} min</strong> {lim > 0 && (avg > lim ? <span>— above the {lim}-min target</span> : <span>— within the {lim}-min target</span>)}
        </p>
      )}
    </div>
  )
}
