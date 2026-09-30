import { useState, useRef, useEffect } from 'react'
export default function PomodoroCounter() {
  const [remaining, setRemaining] = useState(null)
  const [isWork, setIsWork] = useState(true)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(0)
  const ref = useRef(null)
  useEffect(() => () => clearInterval(ref.current), [])
  const start = (work) => {
    setIsWork(work); setRunning(true)
    const secs = work ? 25*60 : 5*60
    const end = Date.now() + secs * 1000
    clearInterval(ref.current)
    ref.current = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        clearInterval(ref.current); setRunning(false)
        if (work) setCompleted(c => c + 1)
      }
    }, 250)
  }
  const stop = () => { clearInterval(ref.current); setRunning(false); setRemaining(null) }
  const fmt = s => s===null?'--:--':String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')
  return (
    <div>
      <div className="out" role="status" style={{textAlign:'center'}}>
        <p style={{fontSize:'3rem',fontWeight:'bold',fontVariantNumeric:'tabular-nums'}}>{fmt(remaining)}</p>
        <p>{running?(isWork?'🍅 Working':'☕ Break'):'Ready'}</p>
        <p>Completed: {'🍅'.repeat(completed)} ({completed})</p>
      </div>
      <div className="actions" style={{justifyContent:'center'}}>
        {!running && <button className="btn" onClick={() => start(true)}>Start Work (25m)</button>}
        {!running && <button className="btn ghost" onClick={() => start(false)}>Start Break (5m)</button>}
        {running && <button className="btn" onClick={stop}>Stop</button>}
      </div>
      <p className="hint">Classic Pomodoro: 25min work, 5min break.</p>
    </div>
  )
}
