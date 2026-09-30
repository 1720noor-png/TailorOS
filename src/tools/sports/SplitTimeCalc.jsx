import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function SplitTimeCalc() {
  const [totalDist, setTotalDist] = useState('')
  const [totalTime, setTotalTime] = useState('')
  const [splits, setSplits] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const d=parseFloat(totalDist),t=parseFloat(totalTime),s=parseInt(splits)
    if(!d||!t||!s){setErr('Fill all fields.');return}
    const splitDist=d/s,splitTime=t/s
    const table=Array.from({length:s},(_,i)=>({split:i+1,dist:((i+1)*splitDist).toFixed(2),time:((i+1)*splitTime).toFixed(1)}))
    setResult({splitDist:splitDist.toFixed(2),splitTime:splitTime.toFixed(1),table})
  }
  return (
    <div>
      <div className="row">
        <Field label="Total Distance"><input type="number" value={totalDist} onChange={e=>setTotalDist(e.target.value)} placeholder="10" /></Field>
        <Field label="Total Time (min)"><input type="number" value={totalTime} onChange={e=>setTotalTime(e.target.value)} placeholder="50" /></Field>
        <Field label="Number of Splits"><input type="number" value={splits} onChange={e=>setSplits(e.target.value)} placeholder="5" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Per Split:</strong> {result.splitDist} distance in {result.splitTime} min</p><table style={{width:'100%',fontSize:'.85rem',marginTop:8}}><thead><tr><th>Split</th><th>Distance</th><th>Time</th></tr></thead><tbody>{result.table.map(r=><tr key={r.split}><td>{r.split}</td><td>{r.dist}</td><td>{r.time}m</td></tr>)}</tbody></table></div>}
      <p className="hint">Even split targets for your race.</p>
    </div>
  )
}
