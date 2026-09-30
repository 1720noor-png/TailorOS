import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { money } from '../../components/print.js'
import { num } from '../../utils/calc.js'

export default function AdBudgetEstimator() {
  const [budget, setBudget] = useState('1000')
  const [cpc, setCpc] = useState('1.5')
  const [ctr, setCtr] = useState('2')
  const [convRate, setConvRate] = useState('3')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const b = num(budget), c = num(cpc), ct = num(ctr), cr = num(convRate)
    if (![b, c, ct, cr].every(Number.isFinite) || b <= 0 || c <= 0 || ct <= 0 || cr <= 0) return setErr('Fill in every field with a positive number.'), setOut(null)
    setErr('')
    const clicks = b / c
    const impressions = clicks / (ct / 100)
    const conversions = clicks * (cr / 100)
    const cpm = (c * ct / 100) * 1000
    const cpa = conversions > 0 ? b / conversions : Infinity
    setOut({ clicks, impressions, conversions, cpm, cpa })
  }
  return (
    <div>
      <div className="row">
        <Field label="Budget"><input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} /></Field>
        <Field label="Expected CPC"><input type="number" min="0" step="0.01" value={cpc} onChange={(e) => setCpc(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Expected CTR (%)"><input type="number" min="0" step="0.1" value={ctr} onChange={(e) => setCtr(e.target.value)} /></Field>
        <Field label="Expected conversion rate (%)"><input type="number" min="0" step="0.1" value={convRate} onChange={(e) => setConvRate(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Estimated clicks: <strong>{out.clicks.toFixed(0)}</strong></p>
        <p>Estimated impressions: <strong>{out.impressions.toFixed(0)}</strong></p>
        <p>Estimated conversions: <strong>{out.conversions.toFixed(1)}</strong></p>
        <p>Effective CPM: <strong>{money(out.cpm)}</strong></p>
        <p>Cost per conversion (CPA): <strong>{Number.isFinite(out.cpa) ? money(out.cpa) : '—'}</strong></p>
      </div>}
      <p className="hint">A planning estimate based on the rates you enter — real campaign performance will vary.</p>
    </div>
  )
}
