import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function LifeInsuranceNeedsCalculator() {
  const [income, setIncome] = useState('')
  const [years, setYears] = useState('10')
  const [debts, setDebts] = useState('')
  const [savings, setSavings] = useState('')
  const [futureExpenses, setFutureExpenses] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const i = Number(income), y = Number(years), d = Number(debts) || 0, s = Number(savings) || 0, f = Number(futureExpenses) || 0
    if (!(i >= 0 && y > 0)) { setOut(null); return setErr('Enter annual income (≥0) and years of income replacement greater than 0.') }
    const need = (i * y) + d + f - s
    setErr('')
    setOut(Math.max(0, need).toFixed(0))
  }

  return (
    <div>
      <div className="row">
        <Field label="Annual income to replace ($)"><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} /></Field>
        <Field label="Years of income to replace"><input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Outstanding debts (mortgage, loans) ($)"><input type="number" min="0" value={debts} onChange={(e) => setDebts(e.target.value)} /></Field>
        <Field label="Future expenses (college, etc.) ($)"><input type="number" min="0" value={futureExpenses} onChange={(e) => setFutureExpenses(e.target.value)} /></Field>
        <Field label="Existing savings/insurance ($)"><input type="number" min="0" value={savings} onChange={(e) => setSavings(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate coverage need</button></div>
      <Msg>{err}</Msg>
      {out !== null && <p className="out" role="status">Suggested coverage amount: <strong>${Number(out).toLocaleString()}</strong></p>}
      <Msg kind="status">A simplified income-replacement method (DIME-style) — a licensed advisor can refine this for your situation.</Msg>
    </div>
  )
}
