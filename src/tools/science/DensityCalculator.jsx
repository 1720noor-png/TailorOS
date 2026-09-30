import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function DensityCalculator() {
  const [mass, setMass] = useState('')
  const [volume, setVolume] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const m=parseFloat(mass),v=parseFloat(volume)
    if(!m||!v){setErr('Enter mass and volume.');return}
    const d=m/v
    let material='Unknown'
    if(d<0.9)material='~Ice/Foam';else if(d<1.1)material='~Water';else if(d<2.7)material='~Plastic/Aluminum';else if(d<8)material='~Iron/Steel';else material='~Lead/Gold'
    setResult({density:d.toFixed(4),material})
  }
  return (
    <div>
      <div className="row">
        <Field label="Mass (g)"><input type="number" value={mass} onChange={e=>setMass(e.target.value)} placeholder="100" /></Field>
        <Field label="Volume (cm³)"><input type="number" value={volume} onChange={e=>setVolume(e.target.value)} placeholder="50" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Density:</strong> {result.density} g/cm³</p><p><strong>Similar to:</strong> {result.material}</p></div>}
      <p className="hint">D = mass / volume</p>
    </div>
  )
}
