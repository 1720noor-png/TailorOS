import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function LegalFeeEstimator() {
  const [hours, setHours] = useState('')
  const [rate, setRate] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const calculate = () => {
    setErr(''); setResult(null)
    const h=parseFloat(hours)||0,r=parseFloat(rate)||0
    if(!h||!r){setErr('Enter hours and rate.');return}
    setResult({total:(h*r).toFixed(2),hours:h,rate:r})
  }

  return (
    <div>
      <div className="row">
        <Field label="Hours"><input type="number" value={hours} onChange={e=>setHours(e.target.value)} placeholder="10" /></Field>
        <Field label="Rate ($/hr)"><input type="number" value={rate} onChange={e=>setRate(e.target.value)} placeholder="250" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Total Fee:</strong> ${result.total}</p><p>{result.hours} hours × ${'{result.rate}'}/hr</p></div>}
      <p className="hint">Adjust hours and rate for your situation.</p>
    </div>
  )
}
