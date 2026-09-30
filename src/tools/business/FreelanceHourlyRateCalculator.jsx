import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function FreelanceHourlyRateCalculator() {
  const [income, setIncome] = useState('80000')
  const [overhead, setOverhead] = useState('12000')
  const [taxRate, setTaxRate] = useState('25')
  const [billableHrs, setBillableHrs] = useState('25')
  const [weeksWorked, setWeeksWorked] = useState('48')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    const inc = parseFloat(income), ov = parseFloat(overhead), tx = parseFloat(taxRate), hrs = parseFloat(billableHrs), wks = parseFloat(weeksWorked)
    if (isNaN(inc) || isNaN(ov) || isNaN(tx) || isNaN(hrs) || isNaN(wks) || hrs <= 0 || wks <= 0) {
      return setErr('Enter valid positive values.')
    }
    setErr('')
    const totalNeededPreTax = (inc + ov) / (1 - tx / 100)
    const annualHours = hrs * wks
    const hourlyRate = totalNeededPreTax / annualHours
    const dayRate = hourlyRate * 8
    setRes({ hourlyRate: hourlyRate.toFixed(2), dayRate: dayRate.toFixed(2), annualHours, grossRevenue: totalNeededPreTax.toFixed(2) })
  }

  const reset = () => { setIncome('80000'); setOverhead('12000'); setTaxRate('25'); setBillableHrs('25'); setWeeksWorked('48'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        <Field label="Target Annual Net Income ($)"><input type="number" value={income} onChange={(e) => setIncome(e.target.value)} /></Field>
        <Field label="Annual Expenses & Overhead ($)"><input type="number" value={overhead} onChange={(e) => setOverhead(e.target.value)} /></Field>
      </div>
      <div className="row" style={{ marginTop: '0.5rem' }}>
        <Field label="Estimated Tax Rate (%)"><input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} /></Field>
        <Field label="Billable Hours / Week"><input type="number" value={billableHrs} onChange={(e) => setBillableHrs(e.target.value)} /></Field>
        <Field label="Working Weeks / Year"><input type="number" value={weeksWorked} onChange={(e) => setWeeksWorked(e.target.value)} /></Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate Hourly Rate</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          <p>Minimum Recommended Hourly Rate: <strong>${res.hourlyRate}/hr</strong></p>
          <p>Estimated Day Rate (8 hrs): <strong>${res.dayRate}/day</strong></p>
          <p>Required Gross Revenue: ${res.grossRevenue}/yr across {res.annualHours} billable hours.</p>
          <CopyBtn text={`Minimum Hourly Rate: \$${res.hourlyRate}/hr (\$${res.dayRate}/day). Target Gross: \$${res.grossRevenue}/yr.`} />
        </div>
      )}
    </div>
  )
}