import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CrosswindHeadwindCalcTool() {
  const [runwayHeading, setRunwayHeading] = useState('09') // 09 = 090°
  const [windDirection, setWindDirection] = useState('120') // 120°
  const [windSpeed, setWindSpeed] = useState('20') // Knots
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      let rwy = parseFloat(runwayHeading)
      const windDir = parseFloat(windDirection)
      const speed = parseFloat(windSpeed)

      if (isNaN(rwy) || rwy < 1 || rwy > 360) return setErr('Runway heading must be between 1° and 360° (or runway designation 01–36).')
      if (isNaN(windDir) || windDir < 0 || windDir > 360) return setErr('Wind direction must be between 0° and 360°.')
      if (isNaN(speed) || speed < 0) return setErr('Wind speed must be a non-negative number in knots.')
      setErr('')

      // If runway is entered as 2 digits (e.g. 09 or 27), multiply by 10
      if (rwy <= 36) rwy = rwy * 10

      // Angle difference between wind and runway
      const angleDiffDeg = (windDir - rwy + 360) % 360
      const angleDiffRad = (angleDiffDeg * Math.PI) / 180

      // Headwind/Tailwind component: Speed * cos(angle)
      // Positive = Headwind, Negative = Tailwind
      const headwindComp = speed * Math.cos(angleDiffRad)

      // Crosswind component: Speed * sin(angle)
      // Positive = From Right, Negative = From Left
      const crosswindComp = speed * Math.sin(angleDiffRad)

      const isTailwind = headwindComp < 0
      const crossDir = crosswindComp > 0 ? 'Right' : (crosswindComp < 0 ? 'Left' : 'Direct')

      setRes({
        headwind: Math.abs(headwindComp).toFixed(1),
        isTailwind,
        crosswind: Math.abs(crosswindComp).toFixed(1),
        crossDir,
        angleDiff: Math.round(Math.abs(angleDiffDeg > 180 ? 360 - angleDiffDeg : angleDiffDeg)),
        copyText: `Runway ${rwy / 10 < 10 ? '0' + (rwy / 10) : rwy / 10} (${rwy}°) Wind Analysis: ${Math.abs(crosswindComp).toFixed(1)} kt Crosswind from ${crossDir}, ${Math.abs(headwindComp).toFixed(1)} kt ${isTailwind ? 'Tailwind (Caution!)' : 'Headwind'}. Total Wind: ${speed} kt from ${windDir}°.`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Calculate exact crosswind, headwind, and tailwind components relative to airport runway orientation using trigonometric vector resolution.
      </p>

      <div className="row">
        <Field label="Runway Identifier or Magnetic Heading (°)">
          <input type="text" value={runwayHeading} onChange={(e) => setRunwayHeading(e.target.value)} placeholder="e.g. 09, 27, or 270" />
        </Field>
        <Field label="Wind Direction Magnetic (°)">
          <input type="number" min="0" max="360" value={windDirection} onChange={(e) => setWindDirection(e.target.value)} placeholder="e.g. 120" />
        </Field>
        <Field label="Wind Speed (Knots / kts)">
          <input type="number" min="0" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} placeholder="e.g. 20" />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Runway Components</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Crosswind Component</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: parseFloat(res.crosswind) > 15 ? '#e11d48' : '#0284c7' }}>
                {res.crosswind} kts
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>From {res.crossDir}</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{res.isTailwind ? 'Tailwind (Caution)' : 'Headwind Component'}</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: res.isTailwind ? '#ea580c' : '#16a34a' }}>
                {res.headwind} kts
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{res.isTailwind ? 'Tailwind increases landing roll' : 'Favorable headwind'}</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Angular Offset</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0' }}>{res.angleDiff}°</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Relative to runway center</span>
            </div>
          </div>

          <CopyBtn text={res.copyText} label="Copy Flight Clearance Data" />
        </div>
      )}
    </div>
  )
}
