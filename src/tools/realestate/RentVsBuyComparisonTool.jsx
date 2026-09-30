import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function RentVsBuyComparisonTool() {
  const [rent, setRent] = useState('1800')
  const [price, setPrice] = useState('350000')
  const [downPct, setDownPct] = useState('20')
  const [rate, setRate] = useState('6.5')
  const [years, setYears] = useState('5')
  const [maintPct, setMaintPct] = useState('1')
  const [apprPct, setApprPct] = useState('3')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const r = Number(rent), p = Number(price), dp = Number(downPct), rt = Number(rate), y = Number(years), m = Number(maintPct), a = Number(apprPct)
    if (!(r > 0 && p > 0 && y > 0)) { setOut(null); return setErr('Enter monthly rent, property price and years greater than 0.') }
    const down = p * (dp / 100)
    const loan = p - down
    const monthlyRate = rt / 100 / 12
    const n = 30 * 12
    const mortgagePmt = monthlyRate > 0 ? (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n)) : loan / n
    const monthlyMaint = (p * (m / 100)) / 12
    const totalRentCost = r * 12 * y
    const totalOwnCost = (mortgagePmt + monthlyMaint) * 12 * y + down
    const futureValue = p * Math.pow(1 + a / 100, y)
    const netOwnCost = totalOwnCost - (futureValue - p) // subtract appreciation gained
    setErr('')
    setOut({ totalRentCost: totalRentCost.toFixed(0), totalOwnCost: totalOwnCost.toFixed(0), netOwnCost: netOwnCost.toFixed(0), mortgagePmt: mortgagePmt.toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Monthly rent ($)"><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} /></Field>
        <Field label="Home price ($)"><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        <Field label="Down payment (%)"><input type="number" min="0" max="100" value={downPct} onChange={(e) => setDownPct(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Mortgage rate (%)"><input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
        <Field label="Years to compare"><input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
        <Field label="Annual maintenance/tax/insurance (% of value)"><input type="number" min="0" step="0.1" value={maintPct} onChange={(e) => setMaintPct(e.target.value)} /></Field>
        <Field label="Expected annual appreciation (%)"><input type="number" step="0.1" value={apprPct} onChange={(e) => setApprPct(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Compare</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Total renting cost over {years} years: <strong>${Number(out.totalRentCost).toLocaleString()}</strong><br />
          Total owning cost (before appreciation): <strong>${Number(out.totalOwnCost).toLocaleString()}</strong> (est. mortgage payment ${out.mortgagePmt}/mo)<br />
          Owning cost net of home appreciation: <strong>${Number(out.netOwnCost).toLocaleString()}</strong>
        </p>
      )}
      <Msg kind="status">A simplified comparison — doesn't include tax deductions, selling costs, or rent increases over time.</Msg>
    </div>
  )
}
