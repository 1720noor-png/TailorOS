import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function LoanComparisonCalculator() {
  const [aAmt, setAAmt] = useState('250000')
  const [aRate, setARate] = useState('6.5')
  const [aYrs, setAYrs] = useState('30')

  const [bAmt, setBAmt] = useState('250000')
  const [bRate, setBRate] = useState('5.9')
  const [bYrs, setBYrs] = useState('15')

  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calcLoan = (amt, rate, yrs) => {
    const p = parseFloat(amt), r = parseFloat(rate) / 100 / 12, n = parseFloat(yrs) * 12
    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) return null
    const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = m * n
    const interest = total - p
    return { monthly: m.toFixed(2), total: total.toFixed(2), interest: interest.toFixed(2) }
  }

  const calc = () => {
    const lA = calcLoan(aAmt, aRate, aYrs)
    const lB = calcLoan(bAmt, bRate, bYrs)
    if (!lA || !lB) return setErr('Enter valid positive loan values for both options.')
    setErr('')
    setRes({ lA, lB })
  }

  const reset = () => { setAAmt('250000'); setARate('6.5'); setAYrs('30'); setBAmt('250000'); setBRate('5.9'); setBYrs('15'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        <div style={{ flex: 1 }}>
          <h3>Option A</h3>
          <Field label="Loan Amount ($)"><input type="number" value={aAmt} onChange={(e) => setAAmt(e.target.value)} /></Field>
          <Field label="Interest Rate (%)"><input type="number" step="0.1" value={aRate} onChange={(e) => setARate(e.target.value)} /></Field>
          <Field label="Term (Years)"><input type="number" value={aYrs} onChange={(e) => setAYrs(e.target.value)} /></Field>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Option B</h3>
          <Field label="Loan Amount ($)"><input type="number" value={bAmt} onChange={(e) => setBAmt(e.target.value)} /></Field>
          <Field label="Interest Rate (%)"><input type="number" step="0.1" value={bRate} onChange={(e) => setBRate(e.target.value)} /></Field>
          <Field label="Term (Years)"><input type="number" value={bYrs} onChange={(e) => setBYrs(e.target.value)} /></Field>
        </div>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Compare Loans</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          <p><strong>Option A:</strong> ${res.lA.monthly}/mo | Total Interest: ${res.lA.interest} | Total Cost: ${res.lA.total}</p>
          <p><strong>Option B:</strong> ${res.lB.monthly}/mo | Total Interest: ${res.lB.interest} | Total Cost: ${res.lB.total}</p>
          <CopyBtn text={`Option A: \$${res.lA.monthly}/mo (Total Int: \$${res.lA.interest}) vs Option B: \$${res.lB.monthly}/mo (Total Int: \$${res.lB.interest})`} />
        </div>
      )}
    </div>
  )
}