import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function EvChargingVsGasCostCalculator() {
  const [annualMiles, setAnnualMiles] = useState('12000')
  const [gasMpg, setGasMpg] = useState('28')
  const [gasPrice, setGasPrice] = useState('3.75')
  const [evEfficiency, setEvEfficiency] = useState('30')
  const [elecRate, setElecRate] = useState('0.14')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const m = parseFloat(annualMiles), mpg = parseFloat(gasMpg), gp = parseFloat(gasPrice)
      const evEff = parseFloat(evEfficiency), er = parseFloat(elecRate)
      if (isNaN(m) || isNaN(mpg) || isNaN(gp) || isNaN(evEff) || isNaN(er) || m <= 0 || mpg <= 0 || evEff <= 0) {
        return setErr('Enter valid positive values.')
      }
      setErr('')
      const annualGasCost = (m / mpg) * gp
      const annualEvCost = (m / 100) * evEff * er
      const savings = annualGasCost - annualEvCost
      setRes({ val: `EV: $${annualEvCost.toFixed(2)}/yr vs Gas: $${annualGasCost.toFixed(2)}/yr | Annual Savings: $${savings.toFixed(2)}`, copyText: `EV Annual Cost: $${annualEvCost.toFixed(2)}, Gas Annual Cost: $${annualGasCost.toFixed(2)}, Annual Savings: $${savings.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAnnualMiles('12000'); setGasMpg('28'); setGasPrice('3.75'); setEvEfficiency('30'); setElecRate('0.14'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Annual Miles Driven">
          <input type="number"  value={annualMiles} onChange={(e) => setAnnualMiles(e.target.value)} placeholder="" />
        </Field>
        <Field label="Gas Car MPG">
          <input type="number"  value={gasMpg} onChange={(e) => setGasMpg(e.target.value)} placeholder="" />
        </Field>
        <Field label="Gas Price ($ / Gallon)">
          <input type="number" step="0.01" value={gasPrice} onChange={(e) => setGasPrice(e.target.value)} placeholder="" />
        </Field>
        <Field label="EV Efficiency (kWh / 100 miles)">
          <input type="number"  value={evEfficiency} onChange={(e) => setEvEfficiency(e.target.value)} placeholder="" />
        </Field>
        <Field label="Home Electricity Rate ($ / kWh)">
          <input type="number" step="0.01" value={elecRate} onChange={(e) => setElecRate(e.target.value)} placeholder="" />
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