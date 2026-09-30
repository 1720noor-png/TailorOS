import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function TravelBudgetDailyPlanner() {
  const [totalBudget, setTotalBudget] = useState('2500')
  const [flights, setFlights] = useState('700')
  const [lodging, setLodging] = useState('900')
  const [days, setDays] = useState('7')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const b = parseFloat(totalBudget), f = parseFloat(flights)||0, l = parseFloat(lodging)||0, d = parseFloat(days)
      if (isNaN(b) || isNaN(d) || b <= 0 || d <= 0) return setErr('Enter valid budget and days.')
      setErr('')
      const remainingForDaily = b - (f + l)
      if (remainingForDaily <= 0) return setErr('Flights and lodging exceed total budget!')
      const dailyAllowance = remainingForDaily / d
      setRes({ val: `Daily Allowance: $${dailyAllowance.toFixed(2)}/day for food & activities ($${remainingForDaily.toFixed(2)} total remaining for ${d} days)`, copyText: `Daily Allowance: $${dailyAllowance.toFixed(2)}/day for ${d} days.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setTotalBudget('2500'); setFlights('700'); setLodging('900'); setDays('7'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Total Trip Budget ($)">
          <input type="number"  value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)} placeholder="" />
        </Field>
        <Field label="Flight / Transport Cost ($)">
          <input type="number"  value={flights} onChange={(e) => setFlights(e.target.value)} placeholder="" />
        </Field>
        <Field label="Total Hotel / Lodging ($)">
          <input type="number"  value={lodging} onChange={(e) => setLodging(e.target.value)} placeholder="" />
        </Field>
        <Field label="Trip Length (Days)">
          <input type="number"  value={days} onChange={(e) => setDays(e.target.value)} placeholder="" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}