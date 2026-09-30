import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function HikingTrailSpeedNaismithCalculator() {
  const [distanceKm, setDistanceKm] = useState('12')
  const [elevationGainMeters, setElevationGainMeters] = useState('600')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const d = parseFloat(distanceKm), e = parseFloat(elevationGainMeters)
      if (isNaN(d) || isNaN(e) || d <= 0 || e < 0) return setErr('Enter valid distance and elevation.')
      setErr('')
      // Naismith rule: 5 km/h + 1 hr per 600m ascent
      const baseHours = d / 5
      const ascentHours = e / 600
      const totalHours = baseHours + ascentHours
      const hrs = Math.floor(totalHours)
      const mins = Math.round((totalHours - hrs) * 60)
      setRes({ val: `Estimated Hiking Time: ${hrs} hrs ${mins} mins (${totalHours.toFixed(1)} hrs total)`, copyText: `Hiking time: ${hrs}h ${mins}m for ${d}km with ${e}m ascent.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setDistanceKm('12'); setElevationGainMeters('600'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Trail Distance (Kilometers)">
          <input type="number" step="0.1" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="" />
        </Field>
        <Field label="Total Elevation Gain (Meters)">
          <input type="number"  value={elevationGainMeters} onChange={(e) => setElevationGainMeters(e.target.value)} placeholder="" />
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