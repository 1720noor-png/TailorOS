import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SwimmingPacePer100mCalculator() {
  const [distMeters, setDistMeters] = useState('1500')
  const [mins, setMins] = useState('27')
  const [secs, setSecs] = useState('30')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const d = parseFloat(distMeters), m = parseFloat(mins)||0, s = parseFloat(secs)||0
      if (isNaN(d) || d <= 0 || (m === 0 && s === 0)) return setErr('Enter valid distance and time.')
      setErr('')
      const totalSecs = m * 60 + s
      const secsPer100 = (totalSecs / d) * 100
      const paceMins = Math.floor(secsPer100 / 60)
      const paceSecs = Math.round(secsPer100 % 60)
      setRes({ val: `Pace per 100m: ${paceMins}:${paceSecs < 10 ? '0':''}${paceSecs} / 100m`, copyText: `Pace: ${paceMins}:${paceSecs < 10 ? '0':''}${paceSecs} / 100m` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setDistMeters('1500'); setMins('27'); setSecs('30'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Total Distance (Meters)">
          <input type="number"  value={distMeters} onChange={(e) => setDistMeters(e.target.value)} placeholder="" />
        </Field>
        <Field label="Total Time Minutes">
          <input type="number"  value={mins} onChange={(e) => setMins(e.target.value)} placeholder="" />
        </Field>
        <Field label="Total Time Seconds">
          <input type="number"  value={secs} onChange={(e) => setSecs(e.target.value)} placeholder="" />
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