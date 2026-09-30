import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function CarbonTravelCalc() {
  const [distance, setDistance] = useState('')
  const [mode, setMode] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const d=parseFloat(distance),m=(mode||'car').toLowerCase()
    if(!d){setErr('Enter distance.');return}
    const factors={car:0.21,bus:0.089,train:0.041,plane:0.255,bike:0,walk:0}
    const f=factors[m]||factors.car
    const kg=(d*f).toFixed(1),trees=Math.ceil(d*f/22)
    setResult({kg,mode:m,trees})
  }
  return (
    <div>
      <div className="row">
        <Field label="Distance (km)"><input type="number" value={distance} onChange={e=>setDistance(e.target.value)} placeholder="1000" /></Field>
        <Field label="Mode (car/bus/train/plane)"><input type="text" value={mode} onChange={e=>setMode(e.target.value)} placeholder="plane" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>{result.kg} kg CO₂</strong> by {result.mode}</p><p>Offset: ~{result.trees} trees/year</p></div>}
      <p className="hint">CO₂ per km: car=0.21, bus=0.089, train=0.041, plane=0.255 kg.</p>
    </div>
  )
}
