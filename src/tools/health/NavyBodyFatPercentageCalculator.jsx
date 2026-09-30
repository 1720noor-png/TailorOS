import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function NavyBodyFatPercentageCalculator() {
  const [heightCm, setHeightCm] = useState('178')
  const [neckCm, setNeckCm] = useState('38')
  const [waistCm, setWaistCm] = useState('84')
  const [hipCm, setHipCm] = useState('95')
  const [weightKg, setWeightKg] = useState('78')
  const [gender, setGender] = useState('male')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const h = parseFloat(heightCm), n = parseFloat(neckCm), w = parseFloat(waistCm), hp = parseFloat(hipCm)||0, wt = parseFloat(weightKg)
      if (isNaN(h) || isNaN(n) || isNaN(w) || isNaN(wt) || h <= 0 || n <= 0 || w <= 0) return setErr('Enter valid measurements.')
      setErr('')
      let bf = 0
      if (gender === 'male') {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450
      }
      const fatMassKg = (wt * bf) / 100
      const leanMassKg = wt - fatMassKg
      setRes({ val: `Body Fat: ${bf.toFixed(1)}% | Fat Mass: ${fatMassKg.toFixed(1)} kg | Lean Mass: ${leanMassKg.toFixed(1)} kg`, copyText: `Body Fat: ${bf.toFixed(1)}%, Lean Mass: ${leanMassKg.toFixed(1)} kg` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setHeightCm('178'); setNeckCm('38'); setWaistCm('84'); setHipCm('95'); setWeightKg('78'); setGender('male'); setRes(null); setErr('') }

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
        <Field label="Neck Circumference (cm)">
          <input type="number"  value={neckCm} onChange={(e) => setNeckCm(e.target.value)} placeholder="" />
        </Field>
        <Field label="Waist Circumference (cm)">
          <input type="number"  value={waistCm} onChange={(e) => setWaistCm(e.target.value)} placeholder="" />
        </Field>
        <Field label="Hip Circumference (Female only) (cm)">
          <input type="number"  value={hipCm} onChange={(e) => setHipCm(e.target.value)} placeholder="" />
        </Field>
        <Field label="Current Weight (kg)">
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