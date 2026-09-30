import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function RentIncreaseCalculator() {
  const [current, setCurrent] = useState('')
  const [pct, setPct] = useState('5')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(current), p = Number(pct)
    if (!(c > 0)) { setOut(null); return setErr('Enter your current rent greater than 0.') }
    const increase = c * (p / 100)
    setErr('')
    setOut({ increase: increase.toFixed(2), newRent: (c + increase).toFixed(2), annual: (increase * 12).toFixed(2) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Current monthly rent ($)"><input type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
        <Field label="Proposed increase (%)"><input type="number" step="0.1" value={pct} onChange={(e) => setPct(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate new rent</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Increase: <strong>${out.increase}/mo</strong> · New rent: <strong>${out.newRent}/mo</strong><br />That's ${out.annual} more per year.</p>}
    </div>
  )
}
