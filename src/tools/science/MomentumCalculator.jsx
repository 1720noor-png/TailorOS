import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function MomentumCalculator() {
  const [mass, setMass] = useState('')
  const [velocity, setVelocity] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const m=parseFloat(mass),v=parseFloat(velocity)
    if(isNaN(m)||isNaN(v)){setErr('Enter mass and velocity.');return}
    setResult({momentum:(m*v).toFixed(4),ke:(0.5*m*v*v).toFixed(4)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Mass (kg)"><input type="number" value={mass} onChange={e=>setMass(e.target.value)} placeholder="5" /></Field>
        <Field label="Velocity (m/s)"><input type="number" value={velocity} onChange={e=>setVelocity(e.target.value)} placeholder="10" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Momentum:</strong> {result.momentum} kg⋅m/s</p><p><strong>Kinetic Energy:</strong> {result.ke} J</p></div>}
      <p className="hint">p = m × v</p>
    </div>
  )
}
