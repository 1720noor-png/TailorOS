import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function VacancyRateCalculator() {
  const [units, setUnits] = useState('10')
  const [vacantDays, setVacantDays] = useState('30')
  const [period, setPeriod] = useState('365')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const u = Number(units), v = Number(vacantDays), p = Number(period)
    if (!(u > 0 && v >= 0 && p > 0)) { setOut(null); return setErr('Enter units greater than 0, vacant unit-days ≥ 0, and a period greater than 0.') }
    const totalUnitDays = u * p
    const rate = (v / totalUnitDays) * 100
    setErr('')
    setOut(rate.toFixed(2))
  }

  return (
    <div>
      <div className="row">
        <Field label="Total units"><input type="number" min="1" value={units} onChange={(e) => setUnits(e.target.value)} /></Field>
        <Field label="Total vacant unit-days in period"><input type="number" min="0" value={vacantDays} onChange={(e) => setVacantDays(e.target.value)} /></Field>
        <Field label="Period length (days)"><input type="number" min="1" value={period} onChange={(e) => setPeriod(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate vacancy rate</button></div>
      <Msg>{err}</Msg>
      {out !== null && <p className="out" role="status">Vacancy rate: <strong>{out}%</strong></p>}
      <Msg kind="status">Vacancy rate = total vacant unit-days ÷ (units × period days). E.g. one unit vacant 30 days out of a 365-day year across 10 units.</Msg>
    </div>
  )
}
