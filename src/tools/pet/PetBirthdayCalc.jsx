import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function PetBirthdayCalc() {
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const calculate = () => {
    setErr(''); setResult(null)
    const a=parseFloat(val1),b=parseFloat(val2)
    if(isNaN(a)){setErr('Enter a valid first value.');return}
    const r=!isNaN(b)?(a+b)/2:a
    setResult({value:r.toFixed(2)})
  }

  return (
    <div>
      <div className="row">
        <Field label="Value 1"><input type="number" value={val1} onChange={e=>setVal1(e.target.value)} placeholder="Enter value" /></Field>
        <Field label="Value 2"><input type="number" value={val2} onChange={e=>setVal2(e.target.value)} placeholder="Enter value" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Result:</strong> {result.value}</p></div>}
      <p className="hint">Enter values and calculate.</p>
    </div>
  )
}
