import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function LoanPayoffCalculator() {
  const [balance, setBalance] = useState(20000)
  const [rate, setRate] = useState(12)
  const [monthlyPayment, setMonthlyPayment] = useState(450)
  const [extraPayment, setExtraPayment] = useState(100)

  const B = Number(balance) || 0
  const r = (Number(rate) || 0) / 12 / 100
  const P = Number(monthlyPayment) || 0
  const E = Number(extraPayment) || 0

  function calcPayoff(extraP) {
    if (B <= 0 || r < 0 || (P + extraP) <= B * r) {
      return { months: Infinity, totalInterest: Infinity }
    }
    let cur = B
    let months = 0
    let totalInt = 0
    const totalMonthly = P + extraP

    while (cur > 0 && months < 600) {
      const interest = cur * r
      totalInt += interest
      const principal = totalMonthly - interest
      cur -= principal
      months++
    }
    return { months, totalInterest: totalInt }
  }

  const standard = calcPayoff(0)
  const accelerated = calcPayoff(E)

  const isInvalid = accelerated.months === Infinity
  const monthsSaved = !isInvalid && standard.months !== Infinity ? Math.max(0, standard.months - accelerated.months) : 0
  const interestSaved = !isInvalid && standard.totalInterest !== Infinity ? Math.max(0, standard.totalInterest - accelerated.totalInterest) : 0

  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US')
  const fmtMonths = (m) => {
    if (m === Infinity) return 'Never (payment too low to cover interest)'
    const y = Math.floor(m / 12)
    const rem = m % 12
    return `${m} months (${y} yrs ${rem} mos)`
  }

  const reportText = `Loan Payoff & Extra Payment Analysis
------------------------------------------------
Current Loan Balance: ${fmt(B)}
Interest Rate: ${rate}%
Standard Monthly Payment: ${fmt(P)}
Extra Monthly Payment: ${fmt(E)}

Standard Payoff: ${fmtMonths(standard.months)}
Accelerated Payoff: ${fmtMonths(accelerated.months)}

Time Saved: ${monthsSaved} months (${(monthsSaved / 12).toFixed(1)} years)
Interest Saved: ${fmt(interestSaved)}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Current Loan Balance ($)">
          <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </Field>
        <Field label="Interest Rate (%)">
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Standard Monthly Payment ($)">
          <input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} />
        </Field>
        <Field label="Extra Monthly Contribution ($)">
          <input type="number" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
        </Field>
      </div>

      {isInvalid ? (
        <div className="msg error">
          Monthly payment must be greater than monthly interest charges ({fmt(B * r)}/mo).
        </div>
      ) : (
        <>
          <div className="out">
            <div>Accelerated Payoff Time: <strong>{fmtMonths(accelerated.months)}</strong></div>
            <div className="good" style={{ fontWeight: 600, marginTop: '0.4rem' }}>
              🎉 Time Saved: {monthsSaved} months ({(monthsSaved / 12).toFixed(1)} yrs) | Interest Saved: {fmt(interestSaved)}
            </div>
          </div>

          <div className="scroll" style={{ marginTop: '1rem' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Monthly Payment</th>
                  <th>Payoff Time</th>
                  <th>Total Interest Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Standard Plan</td>
                  <td>{fmt(P)}</td>
                  <td>{fmtMonths(standard.months)}</td>
                  <td>{fmt(standard.totalInterest)}</td>
                </tr>
                <tr className="best">
                  <td>With Extra Payment</td>
                  <td>{fmt(P + E)}</td>
                  <td>{fmtMonths(accelerated.months)}</td>
                  <td>{fmt(accelerated.totalInterest)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="actions">
            <CopyBtn text={reportText} label="Copy Payoff Summary" />
            <button type="button" className="btn ghost" onClick={() => download('loan-payoff-report.txt', reportText)}>
              Download Report (.txt)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
