import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function MortgageEmiCalculator() {
  const [amount, setAmount] = useState(250000)
  const [rate, setRate] = useState(6.5)
  const [tenureYears, setTenureYears] = useState(30)
  const [extraTax, setExtraTax] = useState(200)

  const P = Number(amount) || 0
  const r = (Number(rate) || 0) / 12 / 100
  const n = (Number(tenureYears) || 0) * 12
  const tax = Number(extraTax) || 0

  let emi = 0
  if (P > 0 && r > 0 && n > 0) {
    emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  } else if (P > 0 && n > 0) {
    emi = P / n
  }

  const totalMonthly = emi + tax
  const totalPayment = emi * n
  const totalInterest = Math.max(0, totalPayment - P)
  const totalWithTax = totalPayment + tax * n

  const fmt = (num) => '$' + Math.round(num).toLocaleString('en-US')

  const reportText = `Mortgage & EMI Report
----------------------------------------
Loan Principal: ${fmt(P)}
Annual Interest Rate: ${rate}%
Tenure: ${tenureYears} years (${n} months)
Monthly Property Tax & Insurance: ${fmt(tax)}

Monthly EMI (Principal + Interest): ${fmt(emi)}
Total Monthly Payment: ${fmt(totalMonthly)}

Total Interest Payable: ${fmt(totalInterest)}
Total Principal & Interest: ${fmt(totalPayment)}
Total Amount Payable over Loan: ${fmt(totalWithTax)}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Loan Amount ($)">
          <input
            type="number"
            min="1000"
            max="10000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Annual Interest Rate (%)">
          <input
            type="number"
            step="0.1"
            min="0"
            max="30"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Field label="Loan Term (Years)">
          <input
            type="number"
            min="1"
            max="50"
            value={tenureYears}
            onChange={(e) => setTenureYears(e.target.value)}
          />
        </Field>
        <Field label="Monthly Tax & Insurance ($)">
          <input
            type="number"
            min="0"
            value={extraTax}
            onChange={(e) => setExtraTax(e.target.value)}
          />
        </Field>
      </div>

      <div className="out">
        <div>Monthly Loan EMI: <strong>{fmt(emi)}</strong> / month</div>
        <div>Total Monthly Payment (incl. tax/ins): <strong>{fmt(totalMonthly)}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Principal: {fmt(P)} | Total Interest: {fmt(totalInterest)} | Grand Total: {fmt(totalWithTax)}
        </div>
      </div>

      <div className="meter" style={{ marginTop: '1rem' }}>
        <span
          style={{
            width: `${totalPayment ? Math.min(100, (P / totalPayment) * 100) : 0}%`,
          }}
          title="Principal proportion"
        />
      </div>
      <div className="hint" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span>🔵 Principal: {totalPayment ? Math.round((P / totalPayment) * 100) : 0}%</span>
        <span>⚪ Interest: {totalPayment ? Math.round((totalInterest / totalPayment) * 100) : 0}%</span>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy Loan Summary" />
        <button
          type="button"
          className="btn ghost"
          onClick={() => download('mortgage-report.txt', reportText)}
        >
          Download Summary (.txt)
        </button>
      </div>
    </div>
  )
}
