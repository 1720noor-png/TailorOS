import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function FractionSimplifier() {
  const [num, setNum] = useState('')
  const [den, setDen] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const n=parseInt(num),d=parseInt(den)
    if(!d){setErr('Denominator cannot be zero.');return}
    const gcd=(a,b)=>b?gcd(b,a%b):a
    const g=gcd(Math.abs(n),Math.abs(d))
    setResult({num:n/g,den:d/g,decimal:(n/d).toFixed(6)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Numerator"><input type="number" value={num} onChange={e=>setNum(e.target.value)} placeholder="24" /></Field>
        <Field label="Denominator"><input type="number" value={den} onChange={e=>setDen(e.target.value)} placeholder="36" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>{result.num}/{result.den}</strong></p><p>Decimal: {result.decimal}</p></div>}
      <p className="hint">Reduces fractions to simplest form.</p>
    </div>
  )
}
