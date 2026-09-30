import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function CalorieBurnCalc() {
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const w=parseFloat(weight),met=parseFloat(activity),d=parseFloat(duration)
    if(!w||!met||!d){setErr('Fill all fields.');return}
    const cal=met*w*3.5/200*d
    setResult({calories:Math.round(cal),perMin:(cal/d).toFixed(1)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Weight (kg)"><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="70" /></Field>
        <Field label="MET Value"><input type="number" value={activity} onChange={e=>setActivity(e.target.value)} placeholder="7" /></Field>
        <Field label="Duration (min)"><input type="number" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="30" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Calories Burned:</strong> {result.calories}</p><p>{result.perMin} cal/min</p></div>}
      <p className="hint">Common METs: Walking=3.5, Running=7, Cycling=8, Swimming=6.</p>
    </div>
  )
}
