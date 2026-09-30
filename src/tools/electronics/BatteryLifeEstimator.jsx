import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function BatteryLifeEstimator() {
  const [cap, setCap] = useState('3000')
  const [draw, setDraw] = useState('150')
  const [eff, setEff] = useState('85')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(cap), d = Number(draw), e = Number(eff)
    if (!(c > 0 && d > 0 && e > 0 && e <= 100)) { setOut(null); return setErr('Enter capacity and current draw greater than 0, and an efficiency between 1 and 100%.') }
    const hours = (c / d) * (e / 100)
    const h = Math.floor(hours), m = Math.round((hours - h) * 60)
    setErr('')
    setOut({ h, m, raw: hours.toFixed(2) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Battery capacity (mAh)"><input type="number" min="1" value={cap} onChange={(e) => setCap(e.target.value)} /></Field>
        <Field label="Average current draw (mA)"><input type="number" min="0.1" step="0.1" value={draw} onChange={(e) => setDraw(e.target.value)} /></Field>
        <Field label="Efficiency / derating (%)"><input type="number" min="1" max="100" value={eff} onChange={(e) => setEff(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate runtime</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Estimated runtime: <strong>{out.h}h {out.m}m</strong> <small>({out.raw} hours)</small></p>}
      <Msg kind="status">Real-world runtime is usually lower than the datasheet number — the efficiency field lets you account for converter losses and non-ideal discharge.</Msg>
    </div>
  )
}
