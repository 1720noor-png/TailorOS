import { useState } from 'react'
import { useStored, uid } from '../../components/hooks.js'
import { Field, Msg } from '../../components/ui.jsx'
import { money } from '../../components/print.js'

function simulate(debts, extra, order) {
  let list = debts.map((d) => ({ ...d, remaining: d.balance }))
  list = order === 'snowball' ? [...list].sort((a, b) => a.remaining - b.remaining) : [...list].sort((a, b) => b.rate - a.rate)
  let months = 0
  let totalInterest = 0
  const guard = 1200
  while (list.some((d) => d.remaining > 0.005) && months < guard) {
    months++
    let pool = extra
    for (const d of list) {
      if (d.remaining <= 0) continue
      const interest = d.remaining * (d.rate / 100 / 12)
      totalInterest += interest
      d.remaining += interest
      const pay = Math.min(d.remaining, d.minPay)
      d.remaining -= pay
    }
    for (const d of list) {
      if (pool <= 0) break
      if (d.remaining <= 0) continue
      const pay = Math.min(d.remaining, pool)
      d.remaining -= pay
      pool -= pay
    }
  }
  return { months, totalInterest }
}

export default function DebtPayoffStrategyPlanner() {
  const [debts, setDebts] = useStored('toolhub.debt-planner', [])
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [rate, setRate] = useState('')
  const [minPay, setMinPay] = useState('')
  const [extra, setExtra] = useState('100')
  const [err, setErr] = useState('')
  const [result, setResult] = useState(null)

  const add = () => {
    const b = Number(balance), r = Number(rate), m = Number(minPay)
    if (!name.trim() || !Number.isFinite(b) || b <= 0 || !Number.isFinite(r) || !Number.isFinite(m) || m <= 0) return setErr('Fill in name, balance, interest rate and minimum payment.')
    setErr('')
    setDebts([...debts, { id: uid(), name: name.trim(), balance: b, rate: r, minPay: m }])
    setName(''); setBalance(''); setRate(''); setMinPay('')
  }
  const remove = (id) => setDebts(debts.filter((d) => d.id !== id))

  const compare = () => {
    if (!debts.length) return setErr('Add at least one debt.')
    const ex = Number(extra) || 0
    setErr('')
    setResult({ snowball: simulate(debts, ex, 'snowball'), avalanche: simulate(debts, ex, 'avalanche') })
  }
  return (
    <div>
      <div className="row">
        <Field label="Debt name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Credit card" /></Field>
        <Field label="Balance"><input type="number" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} /></Field>
        <Field label="Interest rate (% APR)"><input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
        <Field label="Minimum monthly payment"><input type="number" min="0" value={minPay} onChange={(e) => setMinPay(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn ghost" onClick={add}>Add debt</button></div>
      {debts.length > 0 && <ul className="items">
        {debts.map((d) => <li className="item" key={d.id}>{d.name} — {money(d.balance)} at {d.rate}% <button className="btn ghost" onClick={() => remove(d.id)}>Remove</button></li>)}
      </ul>}
      <Field label="Extra monthly payment beyond the minimums"><input type="number" min="0" value={extra} onChange={(e) => setExtra(e.target.value)} /></Field>
      <div className="actions"><button className="btn" onClick={compare}>Compare strategies</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <p><strong>Snowball</strong> (smallest balance first): {result.snowball.months} months, {money(result.snowball.totalInterest)} total interest</p>
        <p><strong>Avalanche</strong> (highest interest rate first): {result.avalanche.months} months, {money(result.avalanche.totalInterest)} total interest</p>
        <p className="muted">Avalanche usually saves more interest; snowball often keeps you more motivated by clearing debts sooner.</p>
      </div>}
      <p className="hint">Saved only in this browser. A simulation, not financial advice — actual results depend on your lender's terms.</p>
    </div>
  )
}
