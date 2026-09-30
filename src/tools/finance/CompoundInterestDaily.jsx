import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function CompoundInterestDaily() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const p=parseFloat(principal),r=parseFloat(rate)/100,y=parseFloat(years)
    if(!p||!r||!y){setErr('Fill all fields.');return}
    const amount=p*Math.pow(1+r/365,365*y)
    setResult({amount:amount.toFixed(2),interest:(amount-p).toFixed(2)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Principal ($)"><input type="number" value={principal} onChange={e=>setPrincipal(e.target.value)} placeholder="10000" /></Field>
        <Field label="Annual Rate (%)"><input type="number" value={rate} onChange={e=>setRate(e.target.value)} placeholder="5" /></Field>
        <Field label="Years"><input type="number" value={years} onChange={e=>setYears(e.target.value)} placeholder="10" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Final Amount:</strong> ${result.amount}</p><p><strong>Interest Earned:</strong> ${result.interest}</p></div>}
      <p className="hint">Daily compounding shows maximum growth.</p>
    </div>
  )
}
