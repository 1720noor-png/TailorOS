import { useState } from 'react'
import { useStored, uid } from '../../components/hooks.js'
import { Field, Msg } from '../../components/ui.jsx'
import { money } from '../../components/print.js'

export default function SubscriptionCostTracker() {
  const [subs, setSubs] = useStored('toolhub.subscriptions', [])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cycle, setCycle] = useState('monthly')
  const [err, setErr] = useState('')

  const add = () => {
    const a = Number(amount)
    if (!name.trim()) return setErr('Enter a subscription name.')
    if (!Number.isFinite(a) || a <= 0) return setErr('Enter a cost greater than zero.')
    setErr('')
    setSubs([...subs, { id: uid(), name: name.trim(), amount: a, cycle }])
    setName(''); setAmount('')
  }
  const remove = (id) => setSubs(subs.filter((s) => s.id !== id))
  const monthly = (s) => (s.cycle === 'monthly' ? s.amount : s.cycle === 'yearly' ? s.amount / 12 : s.amount * 52 / 12)
  const totalMonthly = subs.reduce((sum, s) => sum + monthly(s), 0)

  return (
    <div>
      <div className="row">
        <Field label="Subscription name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Streaming service" /></Field>
        <Field label="Cost"><input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Field label="Billed"><select value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option value="monthly">Monthly</option><option value="yearly">Yearly</option><option value="weekly">Weekly</option>
        </select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add subscription</button></div>
      <Msg>{err}</Msg>
      {!subs.length ? <div className="empty"><p>No subscriptions added yet.</p></div> : <>
        <ul className="items">
          {subs.map((s) => (
            <li className="item" key={s.id}>{s.name} — {money(s.amount)} / {s.cycle} <button className="btn ghost" onClick={() => remove(s.id)}>Remove</button></li>
          ))}
        </ul>
        <div className="out" role="status">
          <p>Total: <strong>{money(totalMonthly)}</strong> / month</p>
          <p>That's about <strong>{money(totalMonthly * 12)}</strong> / year</p>
        </div>
      </>}
      <p className="hint">Saved only in this browser.</p>
    </div>
  )
}
