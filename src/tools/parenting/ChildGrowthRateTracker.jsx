import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function ChildGrowthRateTracker() {
  const [d1, setD1] = useState('')
  const [h1, setH1] = useState('')
  const [w1, setW1] = useState('')
  const [d2, setD2] = useState('')
  const [h2, setH2] = useState('')
  const [w2, setW2] = useState('')
  const [unit, setUnit] = useState('cm / kg')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    if (!d1 || !d2) { setOut(null); return setErr('Enter both measurement dates.') }
    const a = new Date(d1 + 'T00:00:00'), b = new Date(d2 + 'T00:00:00')
    if (isNaN(a) || isNaN(b) || b <= a) { setOut(null); return setErr('The second date must be after the first date.') }
    const H1 = Number(h1), H2 = Number(h2), W1 = Number(w1), W2 = Number(w2)
    if (!(H1 > 0 && H2 > 0 && W1 > 0 && W2 > 0)) { setOut(null); return setErr('Enter height and weight greater than 0 for both dates.') }
    const months = (b - a) / (86400000 * 30.44)
    const heightRate = (H2 - H1) / months
    const weightRate = (W2 - W1) / months
    setErr('')
    setOut({ months: months.toFixed(1), heightRate: heightRate.toFixed(2), weightRate: weightRate.toFixed(2) })
  }

  const hu = unit === 'cm / kg' ? 'cm' : 'in'
  const wu = unit === 'cm / kg' ? 'kg' : 'lb'

  return (
    <div>
      <Field label="Units"><select value={unit} onChange={(e) => setUnit(e.target.value)}><option>cm / kg</option><option>in / lb</option></select></Field>
      <div className="row">
        <Field label="First date"><input type="date" value={d1} onChange={(e) => setD1(e.target.value)} /></Field>
        <Field label={`Height (${hu})`}><input type="number" min="0" step="0.1" value={h1} onChange={(e) => setH1(e.target.value)} /></Field>
        <Field label={`Weight (${wu})`}><input type="number" min="0" step="0.1" value={w1} onChange={(e) => setW1(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Second date"><input type="date" value={d2} onChange={(e) => setD2(e.target.value)} /></Field>
        <Field label={`Height (${hu})`}><input type="number" min="0" step="0.1" value={h2} onChange={(e) => setH2(e.target.value)} /></Field>
        <Field label={`Weight (${wu})`}><input type="number" min="0" step="0.1" value={w2} onChange={(e) => setW2(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate growth rate</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Over {out.months} months: <strong>{out.heightRate} {hu}/month</strong> in height, <strong>{out.weightRate} {wu}/month</strong> in weight.</p>}
      <Msg kind="status">This tracks change over time only — it isn't a percentile or growth-chart comparison. Ask your pediatrician about how your child's growth compares to standard charts.</Msg>
    </div>
  )
}
