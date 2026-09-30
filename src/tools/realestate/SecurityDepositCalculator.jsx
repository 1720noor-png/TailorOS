import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, name: '', amt: '' })

export default function SecurityDepositCalculator() {
  const [deposit, setDeposit] = useState('')
  const [deductions, setDeductions] = useState([blank()])
  const upd = (id, k, v) => setDeductions((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const d = Number(deposit) || 0
  const totalDeductions = deductions.reduce((a, x) => a + (Number(x.amt) || 0), 0)
  const refund = d - totalDeductions

  return (
    <div>
      <Field label="Original security deposit ($)"><input type="number" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} /></Field>
      {deductions.map((x, i) => (
        <div className="row" key={x.id}>
          <Field label={`Deduction ${i + 1} reason`}><input value={x.name} onChange={(e) => upd(x.id, 'name', e.target.value)} placeholder="e.g. Carpet cleaning" /></Field>
          <Field label="Amount ($)"><input type="number" min="0" value={x.amt} onChange={(e) => upd(x.id, 'amt', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setDeductions((r) => (r.length > 1 ? r.filter((y) => y.id !== x.id) : r))} aria-label={`Remove deduction ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setDeductions((d) => [...d, blank()])}>Add deduction</button></div>
      <p className="out" role="status">
        Total deductions: <strong>${totalDeductions.toFixed(2)}</strong><br />
        Refund due: <strong style={{ color: refund >= 0 ? undefined : 'var(--danger, #c0392b)' }}>${refund.toFixed(2)}</strong>
        {refund < 0 && <> — tenant may owe the difference</>}
      </p>
    </div>
  )
}
