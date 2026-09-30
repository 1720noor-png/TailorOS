import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function CarOwnershipCostCalculator() {
  const [loanPayment, setLoanPayment] = useState(450) // monthly
  const [insurance, setInsurance] = useState(150) // monthly
  const [fuel, setFuel] = useState(180) // monthly
  const [maintenance, setMaintenance] = useState(800) // annual
  const [registration, setRegistration] = useState(250) // annual

  const monthlyLoan = Number(loanPayment) || 0
  const monthlyIns = Number(insurance) || 0
  const monthlyFuel = Number(fuel) || 0
  const annualMaint = Number(maintenance) || 0
  const annualReg = Number(registration) || 0

  const totalMonthlyCost = monthlyLoan + monthlyIns + monthlyFuel + (annualMaint + annualReg) / 12
  const totalAnnualCost = totalMonthlyCost * 12

  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US')

  const reportText = `Car Ownership Cost Breakdown
--------------------------------------------
Monthly Loan / Lease Payment: ${fmt(monthlyLoan)}
Monthly Insurance: ${fmt(monthlyIns)}
Monthly Fuel / Charging: ${fmt(monthlyFuel)}
Annual Maintenance & Tires: ${fmt(annualMaint)}
Annual Registration & Taxes: ${fmt(annualReg)}

Estimated Monthly Ownership Cost: ${fmt(totalMonthlyCost)} / month
Estimated Annual Ownership Cost: ${fmt(totalAnnualCost)} / year`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Monthly Loan / Lease ($)">
          <input type="number" min="0" value={loanPayment} onChange={(e) => setLoanPayment(e.target.value)} />
        </Field>
        <Field label="Monthly Insurance ($)">
          <input type="number" min="0" value={insurance} onChange={(e) => setInsurance(e.target.value)} />
        </Field>
        <Field label="Monthly Fuel / Charging ($)">
          <input type="number" min="0" value={fuel} onChange={(e) => setFuel(e.target.value)} />
        </Field>
        <Field label="Annual Maintenance & Repairs ($)">
          <input type="number" min="0" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} />
        </Field>
        <Field label="Annual Registration & Tax ($)">
          <input type="number" min="0" value={registration} onChange={(e) => setRegistration(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Total Annual Ownership Cost: <strong>{fmt(totalAnnualCost)}</strong> / year</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Total Monthly Equivalent: <strong>{fmt(totalMonthlyCost)}</strong> / month
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Expense Category</th>
              <th>Monthly Equivalent</th>
              <th>Annual Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Loan / Lease Payment</td>
              <td>{fmt(monthlyLoan)}</td>
              <td>{fmt(monthlyLoan * 12)}</td>
            </tr>
            <tr>
              <td>Auto Insurance</td>
              <td>{fmt(monthlyIns)}</td>
              <td>{fmt(monthlyIns * 12)}</td>
            </tr>
            <tr>
              <td>Fuel & Energy</td>
              <td>{fmt(monthlyFuel)}</td>
              <td>{fmt(monthlyFuel * 12)}</td>
            </tr>
            <tr>
              <td>Maintenance & Repairs</td>
              <td>{fmt(annualMaint / 12)}</td>
              <td>{fmt(annualMaint)}</td>
            </tr>
            <tr>
              <td>Registration & Licensing</td>
              <td>{fmt(annualReg / 12)}</td>
              <td>{fmt(annualReg)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Cost Report" />
        <button type="button" className="btn ghost" onClick={() => download('car-ownership-costs.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
