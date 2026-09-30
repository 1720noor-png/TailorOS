import { useState, useEffect } from 'react'
import { Field } from '../../components/ui.jsx'
export default function CourtDateCountdown() {
  const [date, setDate] = useState('')
  const [label, setLabel] = useState('')
  const [diff, setDiff] = useState(null)
  useEffect(() => {
    if (!date) { setDiff(null); return }
    const update = () => {
      const ms = new Date(date).getTime() - Date.now()
      if (ms <= 0) { setDiff('Past'); return }
      const d = Math.floor(ms/86400000), h = Math.floor((ms%86400000)/3600000)
      const m = Math.floor((ms%3600000)/60000)
      setDiff(d + ' days, ' + h + ' hrs, ' + m + ' min')
    }
    update(); const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [date])
  return (
    <div>
      <div className="row">
        <Field label="Event"><input value={label} onChange={e => setLabel(e.target.value)} placeholder="Hearing" /></Field>
        <Field label="Date"><input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} /></Field>
      </div>
      {diff && <div className="out" role="status"><p>{label && <strong>{label}: </strong>}{diff}</p></div>}
      <p className="hint">Set the date to see the countdown.</p>
    </div>
  )
}
