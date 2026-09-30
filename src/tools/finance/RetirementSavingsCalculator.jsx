import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { money } from '../../components/print.js'
import { num } from '../../utils/calc.js'

export default function RetirementSavingsCalculator() {
  const [current, setCurrent] = useState('')
  const [monthly, setMonthly] = useState('')
  const [years, setYears] = useState('')
  const [returnRate, setReturnRate] = useState('7')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = num(current), m = num(monthly), y = num(years), r = num(returnRate)
    if (![c, m, y, r].every(Number.isFinite) || y <= 0 || c < 0 || m < 0) return setErr('Fill in current savings, monthly contribution, years, and a return rate.'), setOut(null)
    setErr('')
    const months = y * 12
    const mr = r / 100 / 12
    let balance = c
    let contributed = c
    for (let i = 0; i < months; i++) { balance = balance * (1 + mr) + m; contributed += m }
    setOut({ balance, contributed, growth: balance - contributed })
  }
  return (
    <div>
      <div className="row">
        <Field label="Current savings"><input type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
        <Field label="Monthly contribution"><input type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Years until retirement"><input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
        <Field label="Expected annual return (%)"><input type="number" min="0" step="0.1" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Projected balance at retirement: <strong>{money(out.balance)}</strong></p>
        <p>Total contributed: <strong>{money(out.contributed)}</strong></p>
        <p>Investment growth: <strong>{money(out.growth)}</strong></p>
      </div>}
      <p className="hint">Assumes a constant monthly return and contribution — real markets fluctuate. Not financial advice.</p>
    </div>
  )
}
