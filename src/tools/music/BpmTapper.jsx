import { useState, useRef } from 'react'
export default function BpmTapper() {
  const [bpm, setBpm] = useState(null)
  const [taps, setTaps] = useState(0)
  const times = useRef([])
  const tap = () => {
    const now = Date.now()
    times.current.push(now)
    if (times.current.length > 8) times.current.shift()
    setTaps(t => t + 1)
    if (times.current.length >= 2) {
      const diffs = []
      for (let i = 1; i < times.current.length; i++) diffs.push(times.current[i] - times.current[i-1])
      const avg = diffs.reduce((a,b) => a+b, 0) / diffs.length
      setBpm(Math.round(60000 / avg))
    }
  }
  const reset = () => { times.current = []; setBpm(null); setTaps(0) }
  return (
    <div>
      <div className="out" role="status" style={{textAlign:'center'}}>
        <p style={{fontSize:'4rem',fontWeight:'bold'}}>{bpm || '—'}</p>
        <p>BPM ({taps} taps)</p>
      </div>
      <div className="actions" style={{justifyContent:'center'}}>
        <button className="btn" onClick={tap} style={{padding:'16px 48px',fontSize:'1.2rem'}}>TAP</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <p className="hint">Tap the button rhythmically to detect BPM.</p>
    </div>
  )
}
