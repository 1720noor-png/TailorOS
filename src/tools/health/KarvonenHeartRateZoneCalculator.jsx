import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function KarvonenHeartRateZoneCalculator() {
  const [age, setAge] = useState('30')
  const [restHr, setRestHr] = useState('62')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const a = parseFloat(age), r = parseFloat(restHr)
      if (isNaN(a) || isNaN(r) || a <= 0 || r <= 0) return setErr('Enter valid age and resting heart rate.')
      setErr('')
      const maxHr = 220 - a
      const hrr = maxHr - r
      const z1 = Math.round(hrr * 0.5 + r)
      const z2 = Math.round(hrr * 0.6 + r)
      const z3 = Math.round(hrr * 0.7 + r)
      const z4 = Math.round(hrr * 0.8 + r)
      const z5 = Math.round(hrr * 0.9 + r)
      setRes({ val: `Max HR: ${maxHr} BPM | Fat Burn (60-70%): ${z2}-${z3} BPM | Aerobic (70-80%): ${z3}-${z4} BPM | Anaerobic (80-90%): ${z4}-${z5} BPM`, copyText: `Max HR: ${maxHr}. Zones: Fat Burn ${z2}-${z3} BPM, Aerobic ${z3}-${z4} BPM` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAge('30'); setRestHr('62'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Age (Years)">
          <input type="number"  value={age} onChange={(e) => setAge(e.target.value)} placeholder="" />
        </Field>
        <Field label="Resting Heart Rate (BPM)">
          <input type="number"  value={restHr} onChange={(e) => setRestHr(e.target.value)} placeholder="" />
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