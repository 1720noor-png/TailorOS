import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function PressureCalculator() {
  const [force, setForce] = useState('')
  const [area, setArea] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const f=parseFloat(force),a=parseFloat(area)
    if(!f||!a){setErr('Enter force and area.');return}
    const p=f/a
    setResult({pascal:p.toFixed(2),atm:(p/101325).toFixed(6),psi:(p/6894.76).toFixed(4)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Force (N)"><input type="number" value={force} onChange={e=>setForce(e.target.value)} placeholder="100" /></Field>
        <Field label="Area (m²)"><input type="number" value={area} onChange={e=>setArea(e.target.value)} placeholder="0.5" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>{result.pascal}</strong> Pa</p><p>{result.atm} atm | {result.psi} psi</p></div>}
      <p className="hint">P = Force / Area</p>
    </div>
  )
}
