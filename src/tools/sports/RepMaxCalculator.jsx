import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function RepMaxCalculator() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const w=parseFloat(weight),r=parseInt(reps)
    if(!w||!r||r<1){setErr('Enter weight and reps (≥1).');return}
    const oneRM=w*(1+r/30)
    const pcts=[100,95,90,85,80,75,70,65,60]
    const table=pcts.map(p=>({pct:p,weight:Math.round(oneRM*p/100)}))
    setResult({oneRM:Math.round(oneRM),table})
  }
  return (
    <div>
      <div className="row">
        <Field label="Weight Lifted"><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="100" /></Field>
        <Field label="Reps Performed"><input type="number" value={reps} onChange={e=>setReps(e.target.value)} placeholder="5" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Estimated 1RM:</strong> {result.oneRM}</p><table style={{width:'100%',fontSize:'.85rem',marginTop:8}}><thead><tr><th>%</th><th>Weight</th></tr></thead><tbody>{result.table.map(r=><tr key={r.pct}><td>{r.pct}%</td><td>{r.weight}</td></tr>)}</tbody></table></div>}
      <p className="hint">Epley formula: 1RM = W × (1 + R/30).</p>
    </div>
  )
}
