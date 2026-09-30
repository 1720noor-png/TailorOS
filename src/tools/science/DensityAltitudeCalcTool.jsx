import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DensityAltitudeCalcTool() {
  const [elevation, setElevation] = useState('2500') // feet
  const [altimeter, setAltimeter] = useState('29.92') // inHg (or hPa toggle)
  const [tempC, setTempC] = useState('30') // Celsius
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      const elev = parseFloat(elevation)
      const qnh = parseFloat(altimeter)
      const oat = parseFloat(tempC)

      if (isNaN(elev)) return setErr('Please enter airport field elevation.')
      if (isNaN(qnh) || qnh < 25 || qnh > 35) return setErr('Altimeter setting must be between 25.00 and 35.00 inHg.')
      if (isNaN(oat) || oat < -60 || oat > 60) return setErr('Temperature must be between -60°C and +60°C.')
      setErr('')

      // 1. Pressure Altitude = Field Elevation + (29.92 - Altimeter Setting) * 1000
      const pressureAlt = elev + (29.92 - qnh) * 1000

      // 2. Standard Temperature at Pressure Altitude = 15°C - (1.98°C * Pressure Altitude / 1000)
      const isaTemp = 15 - (1.98 * (pressureAlt / 1000))

      // 3. Density Altitude = Pressure Altitude + [118.8 * (OAT - ISA Temp)]
      const densityAlt = pressureAlt + (118.8 * (oat - isaTemp))

      // Performance degradation multiplier (rule of thumb)
      const deltaTemp = oat - isaTemp

      setRes({
        pressureAlt: Math.round(pressureAlt).toLocaleString(),
        densityAlt: Math.round(densityAlt).toLocaleString(),
        isaTemp: isaTemp.toFixed(1),
        deltaTemp: deltaTemp > 0 ? `+${deltaTemp.toFixed(1)}` : deltaTemp.toFixed(1),
        perfWarning: densityAlt > elev + 2000,
        copyText: `Density Altitude Calculation: Field Elevation: ${elev} ft, Pressure Altitude: ${Math.round(pressureAlt)} ft, Density Altitude: ${Math.round(densityAlt)} ft (ISA ${deltaTemp > 0 ? '+' + deltaTemp.toFixed(1) : deltaTemp.toFixed(1)}°C).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Calculate true aerodynamic density altitude and pressure altitude from field elevation, barometric altimeter setting (QNH), and ambient outside air temperature (OAT).
      </p>

      <div className="row">
        <Field label="Airport Elevation (Feet MSL)">
          <input type="number" value={elevation} onChange={(e) => setElevation(e.target.value)} placeholder="e.g. 2500" />
        </Field>
        <Field label="Altimeter Setting / QNH (inHg)">
          <input type="number" step="0.01" value={altimeter} onChange={(e) => setAltimeter(e.target.value)} placeholder="29.92" />
        </Field>
        <Field label="Outside Air Temp / OAT (°C)">
          <input type="number" step="1" value={tempC} onChange={(e) => setTempC(e.target.value)} placeholder="e.g. 30" />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Density Altitude</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Pressure Altitude</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0' }}>{res.pressureAlt} ft</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ISA Base: {res.isaTemp}°C</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Density Altitude</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.2rem 0', color: res.perfWarning ? '#e11d48' : '#0284c7' }}>
                {res.densityAlt} ft
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ISA Deviation: {res.deltaTemp}°C</span>
            </div>
          </div>

          {res.perfWarning && (
            <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', color: '#991b1b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              ⚠️ <strong>High Density Altitude Advisory:</strong> Engine performance, climb rate, and runway takeoff distance will be degraded.
            </div>
          )}

          <CopyBtn text={res.copyText} label="Copy Density Altitude Metrics" />
        </div>
      )}
    </div>
  )
}
