import { useEffect, useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { useStored, uid } from '../../components/hooks.js'
export default function ExamCountdown() {
  const [ex, setEx] = useStored('toolhub.exams', [])
  const [name, setName] = useState('')
  const [dt, setDt] = useState('')
  const [err, setErr] = useState('')
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const add = () => {
    if (!name.trim()) return setErr('Enter the exam name.')
    const at = new Date(dt).getTime()
    if (!dt || Number.isNaN(at)) return setErr('Choose the exam date and time.')
    setEx([...ex, { id: uid(), name: name.trim(), at }]); setName(''); setDt(''); setErr('')
  }
  const left = (ms) => `${Math.floor(ms / 864e5)} days, ${Math.floor((ms % 864e5) / 36e5)} hours, ${Math.floor((ms % 36e5) / 6e4)} minutes, ${Math.floor((ms % 6e4) / 1e3)} seconds`
  return (
    <div>
      <div className="row">
        <Field label="Exam name"><input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Date and time"><input type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} /></Field>
        <button className="btn" onClick={add}>Add exam</button>
      </div>
      <Msg>{err}</Msg>
      {!ex.length && <div className="empty"><p>No exams yet. Add one to start the countdown.</p></div>}
      <ul className="items">
        {[...ex].sort((a, b) => a.at - b.at).map((e) => (
          <li className="item" key={e.id}>
            <div><strong>{e.name}</strong> · {new Date(e.at).toLocaleString()}<br />{e.at > now ? left(e.at - now) : 'This exam time has passed.'}</div>
            <button className="btn ghost" onClick={() => setEx(ex.filter((x) => x.id !== e.id))} aria-label={`Delete ${e.name}`}>Delete</button>
          </li>
        ))}
      </ul>
      <p className="hint">Saved only in this browser. Times use your device’s time zone.</p>
    </div>
  )
}
