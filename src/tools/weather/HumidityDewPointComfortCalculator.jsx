import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function HumidityDewPointComfortCalculator() {
  const [tempC, setTempC] = useState('28')
  const [rh, setRh] = useState('65')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const t = parseFloat(tempC), rhVal = parseFloat(rh)
      if (isNaN(t) || isNaN(rhVal) || rhVal < 0 || rhVal > 100) return setErr('Enter valid temp (°C) and humidity (0-100%).')
      setErr('')
      const a = 17.27, b = 237.7
      const alpha = ((a * t) / (b + t)) + Math.log(rhVal / 100)
      const dewPoint = (b * alpha) / (a - alpha)
      
      let comfort = 'Comfortable'
      if (dewPoint > 24) comfort = 'Severely High Humidity / Oppressive'
      else if (dewPoint > 20) comfort = 'Uncomfortable & Muggy'
      else if (dewPoint > 16) comfort = 'Humid'
      else if (dewPoint < 10) comfort = 'Dry'

      setRes({ val: `Dew Point: ${dewPoint.toFixed(1)} °C (${comfort})`, copyText: `Dew Point: ${dewPoint.toFixed(1)}°C (${comfort})` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setTempC('28'); setRh('65'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Air Temperature (°C)">
          <input type="number"  value={tempC} onChange={(e) => setTempC(e.target.value)} placeholder="" />
        </Field>
        <Field label="Relative Humidity (%)">
          <input type="number"  value={rh} onChange={(e) => setRh(e.target.value)} placeholder="" />
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