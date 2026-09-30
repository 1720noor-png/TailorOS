import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function DofCalculator() {
  const [focal, setFocal] = useState('')
  const [aperture, setAperture] = useState('')
  const [distance, setDistance] = useState('')
  const [sensor, setSensor] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const f=parseFloat(focal),a=parseFloat(aperture),d=parseFloat(distance)*1000,sw=parseFloat(sensor)
    if(!f||!a||!d){setErr('Fill required fields.');return}
    const coc=sw/1500||0.024
    const h=f*f/(a*coc)
    const near=d*h/(h+(d-f)),far=d<h?d*h/(h-(d-f)):Infinity
    const dof=far===Infinity?'∞':((far-near)/1000).toFixed(2)+'m'
    setResult({near:(near/1000).toFixed(2),far:far===Infinity?'∞':(far/1000).toFixed(2),dof})
  }
  return (
    <div>
      <div className="row">
        <Field label="Focal Length (mm)"><input type="number" value={focal} onChange={e=>setFocal(e.target.value)} placeholder="50" /></Field>
        <Field label="Aperture (f/)"><input type="number" value={aperture} onChange={e=>setAperture(e.target.value)} placeholder="2.8" /></Field>
        <Field label="Subject Distance (m)"><input type="number" value={distance} onChange={e=>setDistance(e.target.value)} placeholder="3" /></Field>
        <Field label="Sensor Width (mm)"><input type="number" value={sensor} onChange={e=>setSensor(e.target.value)} placeholder="36" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Near:</strong> {result.near}m | <strong>Far:</strong> {result.far}m</p><p><strong>DoF:</strong> {result.dof}</p></div>}
      <p className="hint">Based on circle of confusion.</p>
    </div>
  )
}
