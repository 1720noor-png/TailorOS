import { useState, useRef, useEffect } from 'react'
import { Field } from '../../components/ui.jsx'
export default function PostureReminder() {
  const [interval, setInterval_] = useState('30')
  const [active, setActive] = useState(false)
  const [count, setCount] = useState(0)
  const [last, setLast] = useState('')
  const ref = useRef(null)
  useEffect(() => () => clearInterval(ref.current), [])
  const start = () => {
    const ms = Math.max(1, Number(interval) || 30) * 60000
    setActive(true)
    ref.current = setInterval(() => {
      setCount(c => c + 1)
      setLast(new Date().toLocaleTimeString())
      if (Notification.permission === 'granted') new Notification('Posture Check! 🧘')
      else alert('Posture Check! 🧘 Sit up straight.')
    }, ms)
    if (Notification.permission === 'default') Notification.requestPermission()
  }
  const stop = () => { clearInterval(ref.current); setActive(false) }
  return (
    <div>
      <Field label="Reminder Interval (minutes)"><input type="number" min="1" value={interval} onChange={e => setInterval_(e.target.value)} /></Field>
      <div className="actions">
        {!active ? <button className="btn" onClick={start}>Start Reminders</button> : <button className="btn" onClick={stop}>Stop</button>}
      </div>
      <div className="out" role="status">
        <p><strong>Status:</strong> {active ? '🟢 Active' : '⚪ Stopped'}</p>
        <p><strong>Checks:</strong> {count}</p>
        {last && <p><strong>Last reminder:</strong> {last}</p>}
      </div>
      <p className="hint">Get periodic reminders to check your posture.</p>
    </div>
  )
}
