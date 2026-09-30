import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function GoldenHourCalc() {
  const [sunrise, setSunrise] = useState('')
  const [sunset, setSunset] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    if(!sunrise.trim()||!sunset.trim()){setErr('Enter sunrise and sunset.');return}
    const parse=t=>{const[h,m]=t.split(':').map(Number);return h*60+(m||0)}
    const add=(base,min)=>{const t=base+min;const h=Math.floor(((t%1440)+1440)%1440/60);const m=((t%1440)+1440)%1440%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')}
    const sr=parse(sunrise),ss=parse(sunset)
    setResult({morningStart:add(sr,-30),morningEnd:add(sr,60),eveningStart:add(ss,-60),eveningEnd:add(ss,30)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Sunrise Time"><input type="text" value={sunrise} onChange={e=>setSunrise(e.target.value)} placeholder="06:30" /></Field>
        <Field label="Sunset Time"><input type="text" value={sunset} onChange={e=>setSunset(e.target.value)} placeholder="18:45" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Morning Golden Hour:</strong> {result.morningStart} — {result.morningEnd}</p><p><strong>Evening Golden Hour:</strong> {result.eveningStart} — {result.eveningEnd}</p></div>}
      <p className="hint">Golden hour ≈ 30min before/60min after sunrise/sunset.</p>
    </div>
  )
}
