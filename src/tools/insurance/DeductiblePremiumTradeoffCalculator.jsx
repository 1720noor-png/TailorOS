import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function DeductiblePremiumTradeoffCalculator() {
  const [premiumHighDed, setPremiumHighDed] = useState('')
  const [dedHigh, setDedHigh] = useState('')
  const [premiumLowDed, setPremiumLowDed] = useState('')
  const [dedLow, setDedLow] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const ph = Number(premiumHighDed), dh = Number(dedHigh), pl = Number(premiumLowDed), dl = Number(dedLow)
    if (!(ph >= 0 && dh >= 0 && pl >= 0 && dl >= 0)) { setOut(null); return setErr('Enter all four values as 0 or more.') }
    const premiumDiff = pl - ph // extra you pay per year for the lower-deductible plan
    const deductibleDiff = dh - dl // extra you'd pay out of pocket if you claim, with the higher-deductible plan
    if (premiumDiff <= 0) { setErr(''); return setOut({ msg: 'The lower-deductible plan already costs the same or less in premium — it\u2019s the better choice either way.' }) }
    const breakEvenClaims = premiumDiff / deductibleDiff
    setErr('')
    setOut({ premiumDiff: premiumDiff.toFixed(2), deductibleDiff: deductibleDiff.toFixed(2), breakEvenClaims: breakEvenClaims.toFixed(2) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Annual premium — higher deductible plan ($)"><input type="number" min="0" value={premiumHighDed} onChange={(e) => setPremiumHighDed(e.target.value)} /></Field>
        <Field label="Deductible — that plan ($)"><input type="number" min="0" value={dedHigh} onChange={(e) => setDedHigh(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Annual premium — lower deductible plan ($)"><input type="number" min="0" value={premiumLowDed} onChange={(e) => setPremiumLowDed(e.target.value)} /></Field>
        <Field label="Deductible — that plan ($)"><input type="number" min="0" value={dedLow} onChange={(e) => setDedLow(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Compare plans</button></div>
      <Msg>{err}</Msg>
      {out && (out.msg
        ? <p className="out" role="status">{out.msg}</p>
        : <p className="out" role="status">You'd pay <strong>${out.premiumDiff}/year</strong> more for the lower-deductible plan.<br />That pays off if you'd file <strong>{out.breakEvenClaims} or more claims</strong> per year at the full deductible difference (${out.deductibleDiff}) each.</p>)}
    </div>
  )
}
