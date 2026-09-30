import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function TermVsWholeLifeComparison() {
  const [termPremium, setTermPremium] = useState('')
  const [wholePremium, setWholePremium] = useState('')
  const [years, setYears] = useState('20')
  const [investReturn, setInvestReturn] = useState('6')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const t = Number(termPremium), w = Number(wholePremium), y = Number(years), r = Number(investReturn)
    if (!(t >= 0 && w >= 0 && y > 0)) { setOut(null); return setErr('Enter both annual premiums (≥0) and years greater than 0.') }
    if (w <= t) { setErr(''); return setOut({ msg: 'Whole life premium isn\u2019t higher than term here — there\u2019s no difference to invest.' }) }
    const diff = w - t
    const rate = r / 100
    const futureValue = rate > 0 ? diff * ((Math.pow(1 + rate, y) - 1) / rate) : diff * y
    setErr('')
    setOut({ diff: diff.toFixed(2), futureValue: futureValue.toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Term life annual premium ($)"><input type="number" min="0" value={termPremium} onChange={(e) => setTermPremium(e.target.value)} /></Field>
        <Field label="Whole life annual premium ($)"><input type="number" min="0" value={wholePremium} onChange={(e) => setWholePremium(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Years to compare"><input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
        <Field label="Assumed investment return (%)"><input type="number" step="0.1" value={investReturn} onChange={(e) => setInvestReturn(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Compare ("buy term, invest the difference")</button></div>
      <Msg>{err}</Msg>
      {out && (out.msg
        ? <p className="out" role="status">{out.msg}</p>
        : <p className="out" role="status">Annual premium difference: <strong>${out.diff}</strong><br />If invested instead at {investReturn}%/year for {years} years: <strong>${Number(out.futureValue).toLocaleString()}</strong></p>)}
      <Msg kind="status">This models the classic "buy term, invest the difference" comparison — it ignores whole life's cash value growth and guarantees, which matter for some people's situations.</Msg>
    </div>
  )
}
