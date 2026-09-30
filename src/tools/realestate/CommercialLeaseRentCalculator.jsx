import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CommercialLeaseRentCalculator() {
  const [sqft, setSqft] = useState('2500')
  const [ratePerSqft, setRatePerSqft] = useState('28')
  const [camFee, setCamFee] = useState('450')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const sf = parseFloat(sqft), r = parseFloat(ratePerSqft), cam = parseFloat(camFee) || 0
      if (isNaN(sf) || isNaN(r) || sf <= 0 || r <= 0) return setErr('Enter valid area and rate.')
      setErr('')
      const annualBaseRent = sf * r
      const monthlyBaseRent = annualBaseRent / 12
      const totalMonthly = monthlyBaseRent + cam
      const totalAnnual = totalMonthly * 12
      setRes({ val: `Total Monthly Rent: $${totalMonthly.toFixed(2)}/mo (Base: $${monthlyBaseRent.toFixed(2)} + CAM: $${cam.toFixed(2)})`, copyText: `Base Rent: $${monthlyBaseRent.toFixed(2)}/mo, CAM: $${cam.toFixed(2)}/mo. Total Monthly: $${totalMonthly.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setSqft('2500'); setRatePerSqft('28'); setCamFee('450'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Lease Area (Square Feet)">
          <input type="number"  value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="" />
        </Field>
        <Field label="Annual Rate ($ / sq ft)">
          <input type="number" step="0.5" value={ratePerSqft} onChange={(e) => setRatePerSqft(e.target.value)} placeholder="" />
        </Field>
        <Field label="Monthly CAM / NNN Fees ($)">
          <input type="number"  value={camFee} onChange={(e) => setCamFee(e.target.value)} placeholder="" />
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