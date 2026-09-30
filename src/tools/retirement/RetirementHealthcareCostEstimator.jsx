import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function RetirementHealthcareCostEstimator() {
  const [retireAge, setRetireAge] = useState('65')
  const [lifeExpectancy, setLifeExpectancy] = useState('85')
  const [annualCostToday, setAnnualCostToday] = useState('7000')
  const [inflation, setInflation] = useState('5')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const r = Number(retireAge), l = Number(lifeExpectancy), a = Number(annualCostToday), infl = Number(inflation) / 100
    if (!(l > r && a > 0)) { setOut(null); return setErr('Enter a life expectancy greater than retirement age, and an annual cost greater than 0.') }
    const years = l - r
    let total = 0
    for (let i = 0; i < years; i++) total += a * Math.pow(1 + infl, i)
    setErr('')
    setOut({ total: total.toFixed(0), years, firstYear: a.toFixed(0), lastYear: (a * Math.pow(1 + infl, years - 1)).toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Retirement age"><input type="number" min="40" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} /></Field>
        <Field label="Life expectancy"><input type="number" min="40" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Annual healthcare cost today ($)"><input type="number" min="0" value={annualCostToday} onChange={(e) => setAnnualCostToday(e.target.value)} /></Field>
        <Field label="Healthcare inflation rate (%)"><input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate total healthcare cost</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Estimated lifetime healthcare cost over {out.years} years: <strong>${Number(out.total).toLocaleString()}</strong><br /><small>First year: ${Number(out.firstYear).toLocaleString()} — final year: ${Number(out.lastYear).toLocaleString()}</small></p>}
      <Msg kind="status">Healthcare costs historically rise faster than general inflation — this is a rough planning estimate, not a quote.</Msg>
    </div>
  )
}
