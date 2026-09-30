import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function CustomerLifetimeCalc() {
  const [avgPurchase, setAvgPurchase] = useState('')
  const [frequency, setFrequency] = useState('')
  const [lifespan, setLifespan] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const a=parseFloat(avgPurchase),f=parseFloat(frequency),l=parseFloat(lifespan)
    if(!a||!f||!l){setErr('Fill all fields.');return}
    const clv=a*f*l
    setResult({clv:clv.toFixed(2),annual:(a*f).toFixed(2)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Avg Purchase ($)"><input type="number" value={avgPurchase} onChange={e=>setAvgPurchase(e.target.value)} placeholder="50" /></Field>
        <Field label="Purchases/Year"><input type="number" value={frequency} onChange={e=>setFrequency(e.target.value)} placeholder="4" /></Field>
        <Field label="Customer Lifespan (years)"><input type="number" value={lifespan} onChange={e=>setLifespan(e.target.value)} placeholder="5" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>CLV:</strong> ${result.clv}</p><p><strong>Annual Value:</strong> ${result.annual}/year</p></div>}
      <p className="hint">CLV = Avg Purchase × Frequency × Lifespan</p>
    </div>
  )
}
