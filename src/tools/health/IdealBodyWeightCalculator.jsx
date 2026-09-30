import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function IdealBodyWeightCalculator() {
  const [heightCm, setHeightCm] = useState('175')
  const [gender, setGender] = useState('male')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const h = parseFloat(heightCm), g = gender
      if (isNaN(h) || h < 100 || h > 250) return setErr('Enter a valid height between 100cm and 250cm.')
      setErr('')
      const inchesOver60 = (h / 2.54) - 60
      const baseDevine = g === 'male' ? 50 : 45.5
      const devineKg = baseDevine + (2.3 * Math.max(0, inchesOver60))
      const ibwLbs = devineKg * 2.20462
      setRes({ val: `Ideal Weight: ${devineKg.toFixed(1)} kg (${ibwLbs.toFixed(1)} lbs) [Devine Formula]`, copyText: `Ideal Body Weight: ${devineKg.toFixed(1)} kg (${ibwLbs.toFixed(1)} lbs)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setHeightCm('175'); setGender('male'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Gender">
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        
        <Field label="Height (cm)">
          <input type="number"  value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="" />
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