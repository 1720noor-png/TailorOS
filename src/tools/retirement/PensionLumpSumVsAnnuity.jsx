import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function PensionLumpSumVsAnnuity() {
  const [lumpSum, setLumpSum] = useState('')
  const [monthlyAnnuity, setMonthlyAnnuity] = useState('')
  const [investReturn, setInvestReturn] = useState('5')
  const [years, setYears] = useState('25')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const l = Number(lumpSum), m = Number(monthlyAnnuity), r = Number(investReturn) / 100, y = Number(years)
    if (!(l > 0 && m > 0 && y > 0)) { setOut(null); return setErr('Enter lump sum, monthly annuity payment and years greater than 0.') }
    const totalAnnuityPaid = m * 12 * y
    const monthlyRate = r / 12
    const n = y * 12
    const lumpFV = monthlyRate > 0 ? l * Math.pow(1 + monthlyRate, n) : l
    const impliedRate = (() => {
      // solve rate where PV annuity = lump sum (approx via bisection)
      let lo = 0, hi = 0.3
      for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2
        const mr = mid / 12
        const pv = mr > 0 ? m * (1 - Math.pow(1 + mr, -n)) / mr : m * n
        if (pv > l) lo = mid; else hi = mid
      }
      return ((lo + hi) / 2 * 100)
    })()
    setErr('')
    setOut({ totalAnnuityPaid: totalAnnuityPaid.toFixed(0), lumpFV: lumpFV.toFixed(0), impliedRate: impliedRate.toFixed(2) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Lump sum offer ($)"><input type="number" min="0" value={lumpSum} onChange={(e) => setLumpSum(e.target.value)} /></Field>
        <Field label="Monthly annuity payment ($)"><input type="number" min="0" value={monthlyAnnuity} onChange={(e) => setMonthlyAnnuity(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Assumed investment return if you take the lump sum (%)"><input type="number" step="0.1" value={investReturn} onChange={(e) => setInvestReturn(e.target.value)} /></Field>
        <Field label="Years to compare"><input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Compare</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Total annuity payments over {years} years: <strong>${Number(out.totalAnnuityPaid).toLocaleString()}</strong><br />
          Lump sum grown at {investReturn}%/year: <strong>${Number(out.lumpFV).toLocaleString()}</strong><br />
          The annuity is equivalent to investing the lump sum at about <strong>{out.impliedRate}%/year</strong>.
        </p>
      )}
      <Msg kind="status">Ignores taxes, longevity risk and inflation adjustments — a financial advisor can factor those in for your specific pension.</Msg>
    </div>
  )
}
