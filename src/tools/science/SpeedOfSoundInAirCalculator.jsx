import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SpeedOfSoundInAirCalculator() {
  const [tempC, setTempC] = useState('20')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const t = parseFloat(tempC); if (isNaN(t)) return setErr('Enter valid temperature.'); setErr('')
      const speedMs = 331.3 * Math.sqrt(1 + (t / 273.15))
      const speedMph = speedMs * 2.23694
      const speedKmh = speedMs * 3.6
      setRes({ val: `Speed of Sound: ${speedMs.toFixed(1)} m/s (${speedMph.toFixed(1)} mph / ${speedKmh.toFixed(1)} km/h)`, copyText: `Speed of Sound at ${tempC}°C: ${speedMs.toFixed(1)} m/s` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setTempC('20'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Air Temperature (°C)">
          <input type="number"  value={tempC} onChange={(e) => setTempC(e.target.value)} placeholder="" />
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