import { useState, useRef, useEffect } from 'react'
export default function StopwatchTool() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const ref = useRef(null)
  const startTime = useRef(0)
  useEffect(() => () => clearInterval(ref.current), [])
  const start = () => {
    startTime.current = Date.now() - elapsed
    setRunning(true)
    ref.current = setInterval(() => setElapsed(Date.now() - startTime.current), 10)
  }
  const stop = () => { clearInterval(ref.current); setRunning(false) }
  const reset = () => { stop(); setElapsed(0); setLaps([]) }
  const lap = () => setLaps([...laps, elapsed])
  const fmt = ms => {
    const min = Math.floor(ms / 60000)
    const sec = Math.floor((ms % 60000) / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    return String(min).padStart(2,'0')+':'+String(sec).padStart(2,'0')+'.'+String(cs).padStart(2,'0')
  }
  return (
    <div>
      <div className="out" role="status" style={{textAlign:'center'}}>
        <p style={{fontSize:'3.5rem',fontWeight:'bold',fontVariantNumeric:'tabular-nums',fontFamily:'monospace'}}>{fmt(elapsed)}</p>
      </div>
      <div className="actions" style={{justifyContent:'center'}}>
        {!running ? <button className="btn" onClick={start}>{elapsed ? 'Resume' : 'Start'}</button> : <button className="btn" onClick={stop}>Stop</button>}
        {running && <button className="btn ghost" onClick={lap}>Lap</button>}
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      {laps.length > 0 && <div style={{marginTop:12}}>
        {laps.map((l,i) => <p key={i} style={{fontSize:'.85rem'}}>Lap {i+1}: {fmt(l)}{i>0?' (+'+fmt(l-laps[i-1])+')':''}</p>)}
      </div>}
      <p className="hint">Stopwatch with lap times.</p>
    </div>
  )
}
