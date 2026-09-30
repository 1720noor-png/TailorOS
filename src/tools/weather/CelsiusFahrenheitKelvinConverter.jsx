import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CelsiusFahrenheitKelvinConverter() {
  const [tempVal, setTempVal] = useState('25')
  const [fromUnit, setFromUnit] = useState('c')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const v = parseFloat(tempVal)
      if (isNaN(v)) return setErr('Enter a valid temperature.')
      setErr('')
      let c = 0
      if (fromUnit === 'c') c = v
      else if (fromUnit === 'f') c = (v - 32) * (5 / 9)
      else if (fromUnit === 'k') c = v - 273.15

      const f = (c * (9 / 5)) + 32
      const k = c + 273.15

      setRes({ val: `${c.toFixed(1)} °C | ${f.toFixed(1)} °F | ${k.toFixed(1)} K`, copyText: `${c.toFixed(1)}°C = ${f.toFixed(1)}°F = ${k.toFixed(1)}K` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setTempVal('25'); setFromUnit('c'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="From Unit">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            <option value="c">Celsius (°C)</option>
            <option value="f">Fahrenheit (°F)</option>
            <option value="k">Kelvin (K)</option>
          </select>
        </Field>
        
        <Field label="Temperature Value">
          <input type="number"  value={tempVal} onChange={(e) => setTempVal(e.target.value)} placeholder="" />
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