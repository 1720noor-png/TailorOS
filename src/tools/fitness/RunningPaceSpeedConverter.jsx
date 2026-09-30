import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function RunningPaceSpeedConverter() {
  const [mins, setMins] = useState('5')
  const [secs, setSecs] = useState('30')
  const [unit, setUnit] = useState('km')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const m = parseFloat(mins) || 0, s = parseFloat(secs) || 0
      const totalMins = m + s / 60
      if (totalMins <= 0) return setErr('Enter a valid pace greater than 0.')
      setErr('')
      const speed = 60 / totalMins
      const time5k = totalMins * (unit === 'km' ? 5 : 3.1)
      const time10k = totalMins * (unit === 'km' ? 10 : 6.2)
      setRes({ val: `Speed: ${speed.toFixed(2)} ${unit === 'km' ? 'km/h' : 'mph'} | 5K: ${Math.floor(time5k)}m ${Math.round((time5k%1)*60)}s | 10K: ${Math.floor(time10k)}m ${Math.round((time10k%1)*60)}s`, copyText: `Pace: ${m}:${s < 10 ? '0':''}${s}/${unit} = ${speed.toFixed(2)} ${unit === 'km' ? 'km/h' : 'mph'}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setMins('5'); setSecs('30'); setUnit('km'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Unit">
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="km">Per Kilometer</option>
            <option value="mi">Per Mile</option>
          </select>
        </Field>
        
        <Field label="Pace Minutes">
          <input type="number"  value={mins} onChange={(e) => setMins(e.target.value)} placeholder="" />
        </Field>
        <Field label="Pace Seconds">
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