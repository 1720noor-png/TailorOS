import { useState, useEffect } from 'react'
export default function FlipClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  const pad = n => String(n).padStart(2, '0')
  const h = pad(time.getHours()), m = pad(time.getMinutes()), s = pad(time.getSeconds())
  const digitStyle = {display:'inline-block',background:'#1a202c',color:'white',padding:'12px 16px',borderRadius:8,fontSize:'3rem',fontWeight:'bold',fontVariantNumeric:'tabular-nums',fontFamily:'monospace',margin:'0 2px'}
  const colonStyle = {display:'inline-block',fontSize:'3rem',fontWeight:'bold',padding:'12px 4px',color:'#666'}
  return (
    <div>
      <div className="out" role="status" style={{textAlign:'center',padding:24}}>
        <span style={digitStyle}>{h[0]}</span><span style={digitStyle}>{h[1]}</span>
        <span style={colonStyle}>:</span>
        <span style={digitStyle}>{m[0]}</span><span style={digitStyle}>{m[1]}</span>
        <span style={colonStyle}>:</span>
        <span style={digitStyle}>{s[0]}</span><span style={digitStyle}>{s[1]}</span>
        <p style={{marginTop:12,color:'#888'}}>{time.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>
      <p className="hint">A simple digital clock.</p>
    </div>
  )
}
