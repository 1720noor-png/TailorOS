import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function IntermittentFastingWindowCalculator() {
  const [firstMealTime, setFirstMealTime] = useState('12:00')
  const [protocol, setProtocol] = useState('16:8')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const parts = firstMealTime.split(':')
      if (parts.length !== 2) return setErr('Enter time in HH:MM format (e.g. 12:00).')
      const hr = parseInt(parts[0], 10), min = parseInt(parts[1], 10)
      if (isNaN(hr) || isNaN(min) || hr < 0 || hr > 23 || min < 0 || min > 59) return setErr('Enter valid 24h time.')
      setErr('')
      const eatingHours = protocol === '16:8' ? 8 : protocol === '18:6' ? 6 : protocol === '20:4' ? 4 : 1
      const endHr = (hr + eatingHours) % 24
      const fmtTime = (h, m) => `${h < 10 ? '0':''}${h}:${m < 10 ? '0':''}${m}`
      setRes({ val: `Eating Window: ${fmtTime(hr, min)} to ${fmtTime(endHr, min)} | Fasting Window: ${fmtTime(endHr, min)} to ${fmtTime(hr, min)} next day`, copyText: `Fasting ${protocol}. Eating window: ${fmtTime(hr, min)} - ${fmtTime(endHr, min)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setFirstMealTime('12:00'); setProtocol('16:8'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Fasting Protocol">
          <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
            <option value="16:8">16:8 (16 hrs Fast, 8 hrs Eating)</option>
            <option value="18:6">18:6 (18 hrs Fast, 6 hrs Eating)</option>
            <option value="20:4">20:4 Warrior (20 hrs Fast, 4 hrs Eating)</option>
            <option value="23:1">OMAD (23 hrs Fast, 1 hr Eating)</option>
          </select>
        </Field>
        
        <Field label="First Meal Time (HH:MM 24h format)">
          <input type="text"  value={firstMealTime} onChange={(e) => setFirstMealTime(e.target.value)} placeholder="" />
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