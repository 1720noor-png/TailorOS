import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function PhotographyExposureCalc() {
  const [iso, setIso] = useState('')
  const [aperture, setAperture] = useState('')
  const [shutter, setShutter] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const i=parseFloat(iso),a=parseFloat(aperture),s=parseFloat(shutter)
    if(!i||!a||!s){setErr('Fill all fields.');return}
    const ev=Math.log2(a*a*s/i)
    setResult({ev:ev.toFixed(1),iso:i,aperture:a,shutter:'1/'+s})
  }
  return (
    <div>
      <div className="row">
        <Field label="ISO"><input type="number" value={iso} onChange={e=>setIso(e.target.value)} placeholder="100" /></Field>
        <Field label="Aperture (f/)"><input type="number" value={aperture} onChange={e=>setAperture(e.target.value)} placeholder="5.6" /></Field>
        <Field label="Shutter (1/x)"><input type="number" value={shutter} onChange={e=>setShutter(e.target.value)} placeholder="125" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>EV:</strong> {result.ev}</p><p>ISO {result.iso} | f/{result.aperture} | {result.shutter}s</p></div>}
      <p className="hint">EV = log₂(f²×S/ISO)</p>
    </div>
  )
}
