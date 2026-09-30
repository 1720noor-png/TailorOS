import { useState, useRef, useEffect } from 'react'
export default function StretchTimer() {
  const stretches = ['Neck rolls','Shoulder shrugs','Wrist circles','Standing hamstring stretch','Chest opener','Cat-cow stretch','Standing quad stretch','Side bends']
  const [current, setCurrent] = useState(0)
  const [remaining, setRemaining] = useState(null)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)
  useEffect(() => () => clearInterval(ref.current), [])
  const start = () => {
    setCurrent(0); setRunning(true)
    let end = Date.now() + 30000
    ref.current = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        setCurrent(c => {
          if (c >= stretches.length - 1) { clearInterval(ref.current); setRunning(false); return c }
          end = Date.now() + 30000; return c + 1
        })
      }
    }, 250)
  }
  const stop = () => { clearInterval(ref.current); setRunning(false); setRemaining(null) }
  return (
    <div>
      <div className="actions">
        {!running ? <button className="btn" onClick={start}>Start Stretching</button> : <button className="btn" onClick={stop}>Stop</button>}
      </div>
      {running && <div className="out" role="status" style={{textAlign:'center'}}>
        <p style={{fontSize:'1.5rem',fontWeight:'bold'}}>{stretches[current]}</p>
        <p style={{fontSize:'2.5rem',fontVariantNumeric:'tabular-nums'}}>{remaining}s</p>
        <p>{current+1} of {stretches.length}</p>
      </div>}
      <div style={{marginTop:12}}>
        {stretches.map((s, i) => <p key={i} style={{opacity:i<current?0.4:1,fontWeight:i===current&&running?'bold':'normal'}}>
          {i<current?'✅':'⬜'} {s} (30s)
        </p>)}
      </div>
      <p className="hint">Each stretch is 30 seconds.</p>
    </div>
  )
}
