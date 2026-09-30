import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function RunningPaceCalc() {
  const [distance, setDistance] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const d=parseFloat(distance),h=parseInt(hours)||0,m=parseInt(minutes)||0,s=parseInt(seconds)||0
    if(!d){setErr('Enter distance.');return}
    const totalSec=h*3600+m*60+s
    if(!totalSec){setErr('Enter time.');return}
    const paceSec=totalSec/d,paceMin=Math.floor(paceSec/60),paceSec2=Math.round(paceSec%60)
    const speed=(d/(totalSec/3600)).toFixed(2)
    setResult({pace:paceMin+':'+String(paceSec2).padStart(2,'0')+'/km',speed:speed+' km/h',total:h+'h '+m+'m '+s+'s'})
  }
  return (
    <div>
      <div className="row">
        <Field label="Distance (km)"><input type="number" value={distance} onChange={e=>setDistance(e.target.value)} placeholder="5" /></Field>
        <Field label="Hours"><input type="number" value={hours} onChange={e=>setHours(e.target.value)} placeholder="0" /></Field>
        <Field label="Minutes"><input type="number" value={minutes} onChange={e=>setMinutes(e.target.value)} placeholder="25" /></Field>
        <Field label="Seconds"><input type="number" value={seconds} onChange={e=>setSeconds(e.target.value)} placeholder="0" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Pace:</strong> {result.pace}</p><p><strong>Speed:</strong> {result.speed}</p><p><strong>Total Time:</strong> {result.total}</p></div>}
      <p className="hint">Calculate pace from distance and time.</p>
    </div>
  )
}
