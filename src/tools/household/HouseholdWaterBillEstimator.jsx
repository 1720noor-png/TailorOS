import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function HouseholdWaterBillEstimator() {
  const [people, setPeople] = useState('3')
  const [showers, setShowers] = useState('1')
  const [laundry, setLaundry] = useState('5')
  const [ratePerGal, setRatePerGal] = useState('8.5')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const p = parseFloat(people), s = parseFloat(showers), l = parseFloat(laundry), r = parseFloat(ratePerGal)
      if (isNaN(p) || isNaN(s) || isNaN(l) || isNaN(r) || p <= 0 || r <= 0) return setErr('Enter valid household parameters.')
      setErr('')
      const showerGallonsDaily = p * s * 17.2 // avg shower
      const laundryGallonsDaily = (l * 25) / 7
      const miscGallonsDaily = p * 20 // toilets, sinks
      const totalDaily = showerGallonsDaily + laundryGallonsDaily + miscGallonsDaily
      const monthlyGallons = totalDaily * 30.5
      const monthlyCost = (monthlyGallons / 1000) * r
      setRes({ val: `Est. ${Math.round(monthlyGallons).toLocaleString()} gal/mo = $${monthlyCost.toFixed(2)} / month`, copyText: `Monthly Usage: ${Math.round(monthlyGallons)} gallons (${totalDaily.toFixed(1)} gal/day). Est. Cost: $${monthlyCost.toFixed(2)}/mo.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setPeople('3'); setShowers('1'); setLaundry('5'); setRatePerGal('8.5'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Number of Occupants">
          <input type="number"  value={people} onChange={(e) => setPeople(e.target.value)} placeholder="" />
        </Field>
        <Field label="Showers per Person / Day">
          <input type="number"  value={showers} onChange={(e) => setShowers(e.target.value)} placeholder="" />
        </Field>
        <Field label="Laundry Loads / Week">
          <input type="number"  value={laundry} onChange={(e) => setLaundry(e.target.value)} placeholder="" />
        </Field>
        <Field label="Water Cost ($ per 1,000 Gallons)">
          <input type="number" step="0.1" value={ratePerGal} onChange={(e) => setRatePerGal(e.target.value)} placeholder="" />
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