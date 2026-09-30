import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function RequiredSavingsRateCalculator() {
  const [income, setIncome] = useState('')
  const [current, setCurrent] = useState('')
  const [target, setTarget] = useState('')
  const [years, setYears] = useState('30')
  const [returnRate, setReturnRate] = useState('7')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const i = Number(income), c = Number(current) || 0, t = Number(target), y = Number(years), r = Number(returnRate) / 100
    if (!(i > 0 && t > 0 && y > 0)) { setOut(null); return setErr('Enter income, target amount and years greater than 0.') }
    const futureCurrent = c * Math.pow(1 + r, y)
    const remaining = Math.max(0, t - futureCurrent)
    const monthlyRate = r / 12
    const n = y * 12
    const monthlyNeeded = monthlyRate > 0 ? remaining * monthlyRate / (Math.pow(1 + monthlyRate, n) - 1) : remaining / n
    const annualNeeded = monthlyNeeded * 12
    const rate = (annualNeeded / i) * 100
    setErr('')
    setOut({ monthlyNeeded: monthlyNeeded.toFixed(0), rate: rate.toFixed(1) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Annual income ($)"><input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} /></Field>
        <Field label="Current retirement savings ($)"><input type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Target nest egg ($)"><input type="number" min="0" value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        <Field label="Years to reach it"><input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
        <Field label="Assumed annual return (%)"><input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate required savings rate</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">You'd need to save about <strong>${Number(out.monthlyNeeded).toLocaleString()}/month</strong> — roughly <strong>{out.rate}%</strong> of your annual income.</p>}
    </div>
  )
}
