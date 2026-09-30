import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function InflationCalculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const a=parseFloat(amount),r=parseFloat(rate)/100,y=parseInt(years)
    if(!a||!r||!y){setErr('Fill all fields.');return}
    const future=a*Math.pow(1+r,y),purchasing=a/Math.pow(1+r,y)
    setResult({future:future.toFixed(2),purchasing:purchasing.toFixed(2),lostPct:((1-purchasing/a)*100).toFixed(1)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Amount ($)"><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="1000" /></Field>
        <Field label="Annual Inflation (%)"><input type="number" value={rate} onChange={e=>setRate(e.target.value)} placeholder="3" /></Field>
        <Field label="Years"><input type="number" value={years} onChange={e=>setYears(e.target.value)} placeholder="10" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>${amount} today</strong> will cost <strong>${result.future}</strong> in {years} years.</p><p><strong>${amount} in {years} years</strong> has today's buying power of <strong>${result.purchasing}</strong> ({result.lostPct}% loss).</p></div>}
      <p className="hint">Shows how inflation erodes purchasing power.</p>
    </div>
  )
}
