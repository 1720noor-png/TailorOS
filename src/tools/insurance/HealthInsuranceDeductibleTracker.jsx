import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, desc: '', amt: '' })

export default function HealthInsuranceDeductibleTracker() {
  const [deductible, setDeductible] = useState('')
  const [expenses, setExpenses] = useState([blank()])
  const upd = (id, k, v) => setExpenses((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const d = Number(deductible) || 0
  const spent = expenses.reduce((a, e) => a + (Number(e.amt) || 0), 0)
  const remaining = Math.max(0, d - spent)
  const pct = d > 0 ? Math.min(100, (spent / d) * 100) : 0

  return (
    <div>
      <Field label="Annual deductible ($)"><input type="number" min="0" value={deductible} onChange={(e) => setDeductible(e.target.value)} /></Field>
      {expenses.map((e, i) => (
        <div className="row" key={e.id}>
          <Field label={`Expense ${i + 1}`}><input value={e.desc} onChange={(ev) => upd(e.id, 'desc', ev.target.value)} placeholder="e.g. Doctor visit" /></Field>
          <Field label="Amount paid ($)"><input type="number" min="0" value={e.amt} onChange={(ev) => upd(e.id, 'amt', ev.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setExpenses((r) => (r.length > 1 ? r.filter((y) => y.id !== e.id) : r))} aria-label={`Remove expense ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setExpenses((e) => [...e, blank()])}>Add expense</button></div>
      <p className="out" role="status">Spent toward deductible: <strong>${spent.toFixed(2)}</strong> ({pct.toFixed(0)}%)<br />Remaining until met: <strong>${remaining.toFixed(2)}</strong></p>
    </div>
  )
}
