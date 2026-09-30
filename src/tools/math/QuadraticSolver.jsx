import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function QuadraticSolver() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const A=parseFloat(a),B=parseFloat(b),C=parseFloat(c)
    if(!A){setErr('a cannot be zero.');return}
    const disc=B*B-4*A*C
    if(disc<0){setResult({roots:'No real roots',disc:disc.toFixed(2)});return}
    const x1=(-B+Math.sqrt(disc))/(2*A),x2=(-B-Math.sqrt(disc))/(2*A)
    setResult({x1:x1.toFixed(4),x2:x2.toFixed(4),disc:disc.toFixed(2)})
  }
  return (
    <div>
      <div className="row">
        <Field label="a"><input type="number" value={a} onChange={e=>setA(e.target.value)} placeholder="1" /></Field>
        <Field label="b"><input type="number" value={b} onChange={e=>setB(e.target.value)} placeholder="-5" /></Field>
        <Field label="c"><input type="number" value={c} onChange={e=>setC(e.target.value)} placeholder="6" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p>{result.roots||<><strong>x₁ = {result.x1}</strong>, <strong>x₂ = {result.x2}</strong></>}</p><p>Discriminant: {result.disc}</p></div>}
      <p className="hint">Solves ax² + bx + c = 0</p>
    </div>
  )
}
