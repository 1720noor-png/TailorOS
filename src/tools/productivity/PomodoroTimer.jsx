import { useEffect, useState } from 'react'
import { Field } from '../../components/ui.jsx'
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
const clamp = (v) => Math.min(180, Math.max(1, Math.round(Number(v)) || 1))
export default function PomodoroTimer() {
  const [work, setWork] = useState(25)
  const [brk, setBrk] = useState(5)
  const [mode, setMode] = useState('focus')
  const [left, setLeft] = useState(25 * 60)
  const [end, setEnd] = useState(null)
  const [done, setDone] = useState(0)
  useEffect(() => {
    if (!end) return
    const t = setInterval(() => {
      const l = Math.max(0, Math.round((end - Date.now()) / 1000))
      setLeft(l)
      if (l === 0) {
        setEnd(null)
        const next = mode === 'focus' ? 'break' : 'focus'
        if (mode === 'focus') setDone((d) => d + 1)
        setMode(next); setLeft((next === 'focus' ? clamp(work) : clamp(brk)) * 60)
      }
    }, 250)
    return () => clearInterval(t)
  }, [end, mode, work, brk])
  useEffect(() => { document.title = end ? `${mmss(left)} – ${mode}` : document.title }, [left, end, mode])
  const reset = () => { setEnd(null); setMode('focus'); setWork(clamp(work)); setBrk(clamp(brk)); setLeft(clamp(work) * 60) }
  return (
    <div>
      <p className="clock" role="timer" aria-live="off">{mmss(left)}</p>
      <p className="center">{mode === 'focus' ? 'Focus time' : 'Break time'} · Sessions completed: {done}</p>
      <div className="actions center">
        {end ? <button className="btn" onClick={() => setEnd(null)}>Pause</button> : <button className="btn" onClick={() => setEnd(Date.now() + left * 1000)} disabled={left === 0}>{left === (mode === 'focus' ? work : brk) * 60 ? 'Start' : 'Resume'}</button>}
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <div className="row">
        <Field label="Focus minutes"><input type="number" min="1" max="180" value={work} disabled={!!end} onChange={(e) => setWork(e.target.value)} /></Field>
        <Field label="Break minutes"><input type="number" min="1" max="180" value={brk} disabled={!!end} onChange={(e) => setBrk(e.target.value)} /></Field>
      </div>
    </div>
  )
}
