import { useState, useRef, useEffect } from 'react'
import { Field } from '../../components/ui.jsx'

export default function RestTimer() {
  const [minutes, setMinutes] = useState('5')
  const [label, setLabel] = useState('')
  const [remaining, setRemaining] = useState(null)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => () => clearInterval(ref.current), [])

  const start = () => {
    const secs = Math.max(1, Math.round((Number(minutes) || 1) * 60))
    setRemaining(secs); setRunning(true)
    clearInterval(ref.current)
    const end = Date.now() + secs * 1000
    ref.current = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) { clearInterval(ref.current); setRunning(false) }
    }, 250)
  }
  const stop = () => { clearInterval(ref.current); setRunning(false) }
  const reset = () => { stop(); setRemaining(null) }
  const fmt = s => String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')

  return (
    <div>
      <div className="row">
        <Field label="Minutes"><input type="number" min="0.5" step="0.5" value={minutes} onChange={e => setMinutes(e.target.value)} /></Field>
        <Field label="Label"><input value={label} onChange={e => setLabel(e.target.value)} placeholder="Session" /></Field>
      </div>
      <div className="actions">
        {!running && <button className="btn" onClick={start}>Start</button>}
        {running && <button className="btn" onClick={stop}>Pause</button>}
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      {remaining !== null && <div className="out" role="status" style={{textAlign:'center'}}>
        <p style={{fontSize:'3rem',fontWeight:'bold',fontVariantNumeric:'tabular-nums'}}>{fmt(remaining)}</p>
        {remaining === 0 && <p style={{color:'var(--red,#e53e3e)'}}>⏰ Time up!</p>}
      </div>}
      <p className="hint">Timer runs in your browser.</p>
    </div>
  )
}
