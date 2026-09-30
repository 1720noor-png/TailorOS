import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function InvestmentDoublingCalc() {
  const [rate, setRate] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const r=parseFloat(rate)
    if(!r){setErr('Enter a rate.');return}
    const rule72=72/r,actual=Math.log(2)/Math.log(1+r/100)
    setResult({rule72:rule72.toFixed(1),actual:actual.toFixed(1)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Annual Return (%)"><input type="number" value={rate} onChange={e=>setRate(e.target.value)} placeholder="7" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Rule of 72:</strong> ~{result.rule72} years</p><p><strong>Exact:</strong> {result.actual} years</p></div>}
      <p className="hint">Rule of 72 estimates doubling time.</p>
    </div>
  )
}
