import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { money } from '../../components/print.js'
import { num } from '../../utils/calc.js'

export default function SalaryBreakdownCalculator() {
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('annual')
  const [hours, setHours] = useState('40')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const a = num(amount)
    const h = num(hours)
    if (!Number.isFinite(a) || a <= 0) return setErr('Enter a salary amount greater than zero.'), setOut(null)
    if (!Number.isFinite(h) || h <= 0) return setErr('Enter weekly hours greater than zero.'), setOut(null)
    setErr('')
    let annual
    if (period === 'annual') annual = a
    else if (period === 'monthly') annual = a * 12
    else if (period === 'weekly') annual = a * 52
    else annual = a * h * 52
    setOut({
      annual, monthly: annual / 12, weekly: annual / 52, daily: annual / 260, hourly: annual / (h * 52),
    })
  }
  return (
    <div>
      <div className="row">
        <Field label="Pay period"><select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="annual">Annual salary</option>
          <option value="monthly">Monthly salary</option>
          <option value="weekly">Weekly salary</option>
          <option value="hourly">Hourly rate</option>
        </select></Field>
        <Field label="Amount"><input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Field label="Hours worked per week"><input type="number" min="1" max="168" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Annual: <strong>{money(out.annual)}</strong></p>
        <p>Monthly: <strong>{money(out.monthly)}</strong></p>
        <p>Weekly: <strong>{money(out.weekly)}</strong></p>
        <p>Daily (260 working days): <strong>{money(out.daily)}</strong></p>
        <p>Hourly: <strong>{money(out.hourly)}</strong></p>
      </div>}
      <p className="hint">A gross-pay breakdown before tax and deductions — figures use 52 weeks and 260 working days a year.</p>
    </div>
  )
}
