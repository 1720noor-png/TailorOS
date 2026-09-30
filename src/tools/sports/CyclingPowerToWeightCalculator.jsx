import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CyclingPowerToWeightCalculator() {
  const [watts, setWatts] = useState('250')
  const [weightKg, setWeightKg] = useState('72')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const w = parseFloat(watts), wt = parseFloat(weightKg)
      if (isNaN(w) || isNaN(wt) || w <= 0 || wt <= 0) return setErr('Enter valid power and weight.')
      setErr('')
      const wKg = w / wt
      const cat = wKg >= 4.5 ? 'Cat 1 / Pro' : wKg >= 3.8 ? 'Cat 2 / Advanced' : wKg >= 3.0 ? 'Cat 3 / Intermediate' : 'Cat 4 / Recreational'
      setRes({ val: `Power-to-Weight Ratio: ${wKg.toFixed(2)} W/kg (${cat})`, copyText: `Power-to-Weight: ${wKg.toFixed(2)} W/kg (${cat})` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setWatts('250'); setWeightKg('72'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Functional Threshold Power (Watts)">
          <input type="number"  value={watts} onChange={(e) => setWatts(e.target.value)} placeholder="" />
        </Field>
        <Field label="Rider Weight (kg)">
          <input type="number"  value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="" />
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