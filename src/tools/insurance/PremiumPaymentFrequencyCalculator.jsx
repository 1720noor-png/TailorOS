import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function PremiumPaymentFrequencyCalculator() {
  const [annual, setAnnual] = useState('')
  const [monthly, setMonthly] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const a = Number(annual), m = Number(monthly)
    if (!(a > 0 && m > 0)) { setOut(null); return setErr('Enter both the annual and monthly premium options greater than 0.') }
    const monthlyTotal = m * 12
    const diff = monthlyTotal - a
    const surchargePct = (diff / a) * 100
    setErr('')
    setOut({ monthlyTotal: monthlyTotal.toFixed(2), diff: diff.toFixed(2), surchargePct: surchargePct.toFixed(1) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Pay-in-full annual premium ($)"><input type="number" min="0" value={annual} onChange={(e) => setAnnual(e.target.value)} /></Field>
        <Field label="Monthly payment option ($/mo)"><input type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Compare</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Paying monthly costs <strong>${out.monthlyTotal}/year</strong> total — <strong>${out.diff} more</strong> ({out.surchargePct}% surcharge) than paying annually.</p>}
      <Msg kind="status">Insurers often charge an installment fee for monthly billing — paying annually (if you can) usually saves money.</Msg>
    </div>
  )
}
