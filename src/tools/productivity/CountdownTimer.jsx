import { useEffect, useRef, useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { num } from '../../utils/calc.js'

const clock = (ms) => { const s = Math.ceil(ms / 1000); return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, '0')).join(':') }
const PRESETS = [['1 min', 0, 1, 0], ['5 min', 0, 5, 0], ['10 min', 0, 10, 0], ['15 min', 0, 15, 0], ['30 min', 0, 30, 0], ['1 hour', 1, 0, 0]]
export default function CountdownTimer() {
  const [hh, setHh] = useState('0')
  const [mm, setMm] = useState('5')
  const [ss, setSs] = useState('0')
  const [sound, setSound] = useState(true)
  const [left, setLeft] = useState(null) // ms remaining once started; null = idle
  const [end, setEnd] = useState(null)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const ctx = useRef(null)
  const finished = left === 0
  const idle = left === null || finished
  const parse = () => {
    const h = num(hh || 0), m = num(mm || 0), s = num(ss || 0)
    if ([h, m, s].some((v) => !Number.isInteger(v) || v < 0)) return { error: 'Hours, minutes and seconds must be whole numbers, 0 or more.' }
    const total = (h * 3600 + m * 60 + s) * 1000
    if (total < 1000) return { error: 'Set a time of at least 1 second.' }
    if (total > 359999000) return { error: 'The longest countdown is 99 hours, 59 minutes, 59 seconds.' }
    return { total }
  }
  const beep = () => {
    const c = ctx.current
    if (!c) return
    try {
      c.resume()
      ;[0, 0.35, 0.7].forEach((t) => { const o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.2) })
    } catch { /* sound unavailable */ }
  }
  useEffect(() => {
    if (!end) return
    const t = setInterval(() => {
      const rem = Math.max(0, end - Date.now())
      setLeft(rem)
      if (rem === 0) { setEnd(null); setDone(true); if (sound) beep() }
    }, 200)
    return () => clearInterval(t)
  }, [end, sound])
  const start = () => {
    let ms = left
    if (idle) { const p = parse(); if (p.error) return setErr(p.error); ms = p.total }
    if (sound && !ctx.current) { try { const C = window.AudioContext || window.webkitAudioContext; if (C) ctx.current = new C() } catch { /* ignore */ } }
    ctx.current?.resume?.()
    setErr(''); setDone(false); setLeft(ms); setEnd(Date.now() + ms)
  }
  const pause = () => { setLeft(Math.max(0, end - Date.now())); setEnd(null) }
  const reset = () => { setEnd(null); setLeft(null); setDone(false); setErr('') }
  const shown = finished ? 0 : idle ? (parse().total ?? 0) : left
  const running = !!end
  return (
    <div>
      <p className="clock" role="timer" aria-live="off">{clock(shown)}</p>
      {done && <Msg kind="ok">Time’s up!</Msg>}
      <div className="actions center">
        {running ? <button className="btn" onClick={pause}>Pause</button> : <button className="btn" onClick={start}>{idle ? 'Start' : 'Resume'}</button>}
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      <div className="row">
        <Field label="Hours"><input type="number" min="0" max="99" step="1" value={hh} disabled={!idle} onChange={(e) => setHh(e.target.value)} /></Field>
        <Field label="Minutes"><input type="number" min="0" step="1" value={mm} disabled={!idle} onChange={(e) => setMm(e.target.value)} /></Field>
        <Field label="Seconds"><input type="number" min="0" step="1" value={ss} disabled={!idle} onChange={(e) => setSs(e.target.value)} /></Field>
      </div>
      <div className="actions">
        {PRESETS.map(([l, h, m, s]) => <button key={l} className="btn ghost" disabled={!idle} onClick={() => { setHh(String(h)); setMm(String(m)); setSs(String(s)); setErr('') }}>{l}</button>)}
      </div>
      <label className="check"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Play a sound when time is up</label>
      <p className="hint">The timer uses your device clock, so it stays accurate if the tab is in the background. Browsers may delay sounds in background tabs. Press Reset to change the time while it is paused.</p>
    </div>
  )
}
