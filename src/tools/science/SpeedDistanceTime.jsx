import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function SpeedDistanceTime() {
  const [speed, setSpeed] = useState('')
  const [distance, setDistance] = useState('')
  const [time, setTime] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const s=parseFloat(speed),d=parseFloat(distance),t=parseFloat(time)
    const has=[!isNaN(s),!isNaN(d),!isNaN(t)].filter(Boolean).length
    if(has<2){setErr('Enter any two values.');return}
    let rs=s,rd=d,rt=t
    if(isNaN(rs))rs=rd/rt;if(isNaN(rd))rd=rs*rt;if(isNaN(rt))rt=rd/rs
    setResult({s:rs.toFixed(2),d:rd.toFixed(2),t:rt.toFixed(2)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Speed"><input type="number" value={speed} onChange={e=>setSpeed(e.target.value)} placeholder="" /></Field>
        <Field label="Distance"><input type="number" value={distance} onChange={e=>setDistance(e.target.value)} placeholder="" /></Field>
        <Field label="Time"><input type="number" value={time} onChange={e=>setTime(e.target.value)} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Speed:</strong> {result.s} | <strong>Distance:</strong> {result.d} | <strong>Time:</strong> {result.t}</p></div>}
      <p className="hint">Enter any two values (speed=distance/time).</p>
    </div>
  )
}
