import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function ApplianceElectricityCostCalculator() {
  const [watts, setWatts] = useState('1500')
  const [hrs, setHrs] = useState('4')
  const [rate, setRate] = useState('0.15')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const w = parseFloat(watts), h = parseFloat(hrs), r = parseFloat(rate)
      if (isNaN(w) || isNaN(h) || isNaN(r) || w <= 0 || h <= 0 || r <= 0) return setErr('Enter valid positive wattage, hours, and rate.')
      setErr('')
      const kWhPerDay = (w * h) / 1000
      const dailyCost = kWhPerDay * r
      const monthlyCost = dailyCost * 30.5
      const annualCost = dailyCost * 365
      setRes({ val: `$${monthlyCost.toFixed(2)} / month ($${annualCost.toFixed(2)} / yr) | ${kWhPerDay.toFixed(2)} kWh/day`, copyText: `Daily: $${dailyCost.toFixed(2)}, Monthly: $${monthlyCost.toFixed(2)}, Annual: $${annualCost.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setWatts('1500'); setHrs('4'); setRate('0.15'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Appliance Power (Watts)">
          <input type="number"  value={watts} onChange={(e) => setWatts(e.target.value)} placeholder="" />
        </Field>
        <Field label="Usage (Hours / Day)">
          <input type="number" step="0.5" value={hrs} onChange={(e) => setHrs(e.target.value)} placeholder="" />
        </Field>
        <Field label="Electricity Rate ($ / kWh)">
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="" />
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