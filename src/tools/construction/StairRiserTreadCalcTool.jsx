import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function StairRiserTreadCalcTool() {
  const [totalRise, setTotalRise] = useState('270') // Total floor-to-floor height in cm or inches
  const [unit, setUnit] = useState('cm') // cm | inches
  const [targetRiser, setTargetRiser] = useState('17.5') // Target ideal riser height (17.5 cm or 7 inches)
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      const rise = parseFloat(totalRise)
      const targetR = parseFloat(targetRiser)

      if (isNaN(rise) || rise <= 0) return setErr('Please enter total floor-to-floor vertical rise.')
      if (isNaN(targetR) || targetR <= 0) return setErr('Please enter target riser height.')
      setErr('')

      // 1. Calculate number of risers (must be integer)
      const numRisers = Math.round(rise / targetR)
      if (numRisers <= 0) return setErr('Total rise is too small for stairs.')

      // 2. Exact Riser Height (R) = Total Rise / Number of Risers
      const exactRiser = rise / numRisers

      // 3. Number of Treads = Number of Risers - 1
      const numTreads = numRisers - 1

      // 4. Calculate Ideal Tread Depth (T) using Blondel's Formula: 2R + T = 63 cm (or 25 inches)
      // Standard rule: 60 cm <= 2R + T <= 64 cm (or 24" to 25.5")
      const idealConstant = unit === 'cm' ? 63 : 25
      const exactTread = idealConstant - 2 * exactRiser

      // 5. Total Staircase Horizontal Run (Length) = numTreads * exactTread
      const totalRun = numTreads * exactTread

      // 6. Stair Incline Angle (Pitch): arctan(Riser / Tread)
      const pitchRad = Math.atan(exactRiser / exactTread)
      const pitchDeg = (pitchRad * 180) / Math.PI

      // Building Code Comfort & Safety Check
      // Standard residential codes (IBC/IRC): Max Riser <= 19.5cm (7.75"), Min Tread >= 25cm (10"), Angle between 30° and 38°
      const maxRiserCode = unit === 'cm' ? 19.5 : 7.75
      const minTreadCode = unit === 'cm' ? 25.0 : 10.0
      const passesCode = exactRiser <= maxRiserCode && exactTread >= minTreadCode && pitchDeg >= 25 && pitchDeg <= 42

      setRes({
        numRisers,
        numTreads,
        exactRiser: exactRiser.toFixed(2),
        exactTread: exactTread.toFixed(2),
        totalRun: totalRun.toFixed(1),
        pitchDeg: pitchDeg.toFixed(1),
        blondelVal: (2 * exactRiser + exactTread).toFixed(1),
        unit,
        passesCode,
        copyText: `Staircase Design (${rise} ${unit} Total Rise): ${numRisers} Risers @ ${exactRiser.toFixed(2)} ${unit}, ${numTreads} Treads @ ${exactTread.toFixed(2)} ${unit}. Total Horizontal Run: ${totalRun.toFixed(1)} ${unit}, Stair Angle: ${pitchDeg.toFixed(1)}° (Blondel Rule 2R+T: ${(2 * exactRiser + exactTread).toFixed(1)} ${unit} - ${passesCode ? 'Code Compliant' : 'Warning: Review Code Bounds'}).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const toggleUnit = (newUnit) => {
    if (newUnit === unit) return
    setUnit(newUnit)
    if (newUnit === 'inches') {
      setTotalRise((parseFloat(totalRise) / 2.54).toFixed(1))
      setTargetRiser('7.0')
    } else {
      setTotalRise((parseFloat(totalRise) * 2.54).toFixed(0))
      setTargetRiser('17.5')
    }
    setRes(null)
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Calculate compliant staircase riser heights, tread depths, total stringer run, and slope pitch using international architectural safety standards and Blondel's formula ($2R + T = 63\text{cm}$).
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button type="button" className={`btn ${unit === 'cm' ? '' : 'ghost'}`} onClick={() => toggleUnit('cm')}>Metric (Centimeters)</button>
        <button type="button" className={`btn ${unit === 'inches' ? '' : 'ghost'}`} onClick={() => toggleUnit('inches')}>Imperial (Inches)</button>
      </div>

      <div className="row">
        <Field label={`Total Vertical Rise (Floor-to-Floor Height in ${unit})`}>
          <input type="number" step="0.5" min="10" value={totalRise} onChange={(e) => setTotalRise(e.target.value)} />
        </Field>
        <Field label={`Target Ideal Riser Height (${unit})`}>
          <input type="number" step="0.25" min="1" value={targetRiser} onChange={(e) => setTargetRiser(e.target.value)} />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Stair Dimensions</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Risers Count & Height</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>
                {res.numRisers} @ {res.exactRiser} {res.unit}
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Individual step rise</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Treads Count & Depth</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#16a34a' }}>
                {res.numTreads} @ {res.exactTread} {res.unit}
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Individual step run</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Horizontal Run</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0' }}>
                {res.totalRun} {res.unit}
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Stair Angle: {res.pitchDeg}°</span>
            </div>
          </div>

          <div style={{ padding: '0.6rem 0.8rem', background: res.passesCode ? '#ecfdf5' : '#fffbeb', border: `1px solid ${res.passesCode ? '#a7f3d0' : '#fde68a'}`, borderRadius: '0.375rem', fontSize: '0.85rem', marginBottom: '0.75rem', color: res.passesCode ? '#065f46' : '#92400e' }}>
            {res.passesCode ? '✓ Standard Building Code Compliant' : '⚠️ Review Dimensions: Incline angle or riser/tread bounds may exceed standard local codes.'}
            <span style={{ display: 'block', fontSize: '0.8rem', marginTop: '0.2rem' }}>Blondel Ratio (2R + T): {res.blondelVal} {res.unit} (Ideal target: {res.unit === 'cm' ? '60–64 cm' : '24–25.5 in'})</span>
          </div>

          <CopyBtn text={res.copyText} label="Copy Stair Dimensions" />
        </div>
      )}
    </div>
  )
}
