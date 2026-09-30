import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function ExponentCalculator() {
  const [base, setBase] = useState('')
  const [exp, setExp] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const b=parseFloat(base),e=parseFloat(exp)
    if(isNaN(b)||isNaN(e)){setErr('Enter valid numbers.');return}
    const r=Math.pow(b,e)
    setResult({value:r,base:b,exp:e})
  }
  return (
    <div>
      <div className="row">
        <Field label="Base"><input type="number" value={base} onChange={e=>setBase(e.target.value)} placeholder="2" /></Field>
        <Field label="Exponent"><input type="number" value={exp} onChange={e=>setExp(e.target.value)} placeholder="10" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>{result.base}^{result.exp} = {result.value}</strong></p></div>}
      <p className="hint">Calculates base raised to power.</p>
    </div>
  )
}
