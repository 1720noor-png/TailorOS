import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function FlightJetLagRecoveryPlanner() {
  const [timeZonesCrossed, setTimeZonesCrossed] = useState('6')
  const [direction, setDirection] = useState('east')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const tz = parseFloat(timeZonesCrossed)
      if (isNaN(tz) || tz <= 0) return setErr('Enter valid time zones crossed (>0).')
      setErr('')
      const days = direction === 'east' ? Math.ceil(tz * 1.0) : Math.ceil(tz * 0.7)
      const shiftPerDay = direction === 'east' ? 1.0 : 1.5
      setRes({ val: `Est. Full Adaptation: ${days} days (Shift sleep time ${shiftPerDay} hr/day ${direction === 'east' ? 'earlier' : 'later'})`, copyText: `Jet lag recovery: ${days} days for ${tz} time zones ${direction}.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setTimeZonesCrossed('6'); setDirection('east'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Flight Direction">
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="east">Eastward (Harder)</option>
            <option value="west">Westward (Easier)</option>
          </select>
        </Field>
        
        <Field label="Time Zones Crossed (Hours)">
          <input type="number"  value={timeZonesCrossed} onChange={(e) => setTimeZonesCrossed(e.target.value)} placeholder="" />
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