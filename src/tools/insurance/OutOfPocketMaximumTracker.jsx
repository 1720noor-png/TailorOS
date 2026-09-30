import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, desc: '', amt: '' })

export default function OutOfPocketMaximumTracker() {
  const [max, setMax] = useState('')
  const [expenses, setExpenses] = useState([blank()])
  const upd = (id, k, v) => setExpenses((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const m = Number(max) || 0
  const spent = expenses.reduce((a, e) => a + (Number(e.amt) || 0), 0)
  const remaining = Math.max(0, m - spent)
  const met = m > 0 && spent >= m

  return (
    <div>
      <Field label="Annual out-of-pocket maximum ($)"><input type="number" min="0" value={max} onChange={(e) => setMax(e.target.value)} /></Field>
      {expenses.map((e, i) => (
        <div className="row" key={e.id}>
          <Field label={`Expense ${i + 1}`}><input value={e.desc} onChange={(ev) => upd(e.id, 'desc', ev.target.value)} placeholder="e.g. ER visit copay" /></Field>
          <Field label="Amount paid ($)"><input type="number" min="0" value={e.amt} onChange={(ev) => upd(e.id, 'amt', ev.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setExpenses((r) => (r.length > 1 ? r.filter((y) => y.id !== e.id) : r))} aria-label={`Remove expense ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setExpenses((e) => [...e, blank()])}>Add expense</button></div>
      <p className="out" role="status">Total paid so far: <strong>${spent.toFixed(2)}</strong><br />{met ? <>You've reached your out-of-pocket max — the plan should cover 100% of further covered costs this year.</> : <>Remaining until max: <strong>${remaining.toFixed(2)}</strong></>}</p>
    </div>
  )
}
