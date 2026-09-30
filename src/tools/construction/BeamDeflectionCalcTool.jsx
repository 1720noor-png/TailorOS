import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function BeamDeflectionCalcTool() {
  const [loadType, setLoadType] = useState('point') // point | uniform
  const [spanLength, setSpanLength] = useState('6') // meters
  const [loadValue, setLoadValue] = useState('20') // kN (if point) or kN/m (if uniform)
  const [elasticModulus, setElasticModulus] = useState('200') // GPa (Steel = 200, Timber = 11, Concrete = 30)
  const [momentInertia, setMomentInertia] = useState('5000') // cm^4
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const presets = [
    { label: 'Structural Steel (E = 200 GPa)', e: '200', i: '8000' },
    { label: 'Reinforced Concrete (E = 30 GPa)', e: '30', i: '25000' },
    { label: 'Structural Timber (E = 12 GPa)', e: '12', i: '12000' }
  ]

  const calc = () => {
    try {
      const L = parseFloat(spanLength) // meters
      const load = parseFloat(loadValue) // kN or kN/m
      const E = parseFloat(elasticModulus) * 1e9 // Convert GPa to N/m^2 (Pa)
      const I = parseFloat(momentInertia) * 1e-8 // Convert cm^4 to m^4 (1 cm^4 = 10^-8 m^4)

      if (isNaN(L) || L <= 0) return setErr('Span length must be greater than 0.')
      if (isNaN(load) || load <= 0) return setErr('Load value must be greater than 0.')
      if (isNaN(E) || E <= 0) return setErr('Modulus of elasticity must be greater than 0.')
      if (isNaN(I) || I <= 0) return setErr('Moment of inertia must be greater than 0.')
      setErr('')

      let maxMoment = 0 // kN·m
      let maxDeflectionMeters = 0 // meters
      let maxShear = 0 // kN

      if (loadType === 'point') {
        // Point load P at midspan (Simply supported):
        // M_max = P * L / 4
        // Deflection_max = P * L^3 / (48 * E * I)
        const P_N = load * 1000 // N
        maxMoment = (load * L) / 4
        maxShear = load / 2
        maxDeflectionMeters = (P_N * Math.pow(L, 3)) / (48 * E * I)
      } else {
        // Uniform load w across entire span:
        // M_max = w * L^2 / 8
        // Deflection_max = 5 * w * L^4 / (384 * E * I)
        const w_N = load * 1000 // N/m
        maxMoment = (load * Math.pow(L, 2)) / 8
        maxShear = (load * L) / 2
        maxDeflectionMeters = (5 * w_N * Math.pow(L, 4)) / (384 * E * I)
      }

      const deflectionMM = maxDeflectionMeters * 1000
      const codeDeflectionLimitMM = (L * 1000) / 250 // Typical L/250 building code threshold
      const passesLimit = deflectionMM <= codeDeflectionLimitMM

      setRes({
        maxMoment: maxMoment.toFixed(2),
        maxShear: maxShear.toFixed(2),
        deflectionMM: deflectionMM.toFixed(2),
        limitMM: codeDeflectionLimitMM.toFixed(1),
        passesLimit,
        copyText: `Simply Supported Beam Analysis (${loadType === 'point' ? 'Point Load' : 'Uniform Load'}): Max Bending Moment: ${maxMoment.toFixed(2)} kN·m, Max Shear: ${maxShear.toFixed(2)} kN, Max Midspan Deflection: ${deflectionMM.toFixed(2)} mm (Building Code L/250 Limit: ${codeDeflectionLimitMM.toFixed(1)} mm - ${passesLimit ? 'PASSED' : 'EXCEEDED'}).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Calculate maximum bending moment ($M$), shear force ($V$), and midspan deflection ($\delta$) for simply supported structural beams under center point or distributed loads.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Material Presets:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {presets.map(p => (
            <button key={p.label} type="button" className="btn ghost" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }} onClick={() => { setElasticModulus(p.e); setMomentInertia(p.i) }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        <Field label="Load Configuration">
          <select value={loadType} onChange={(e) => setLoadType(e.target.value)}>
            <option value="point">Single Point Load at Midspan (P)</option>
            <option value="uniform">Uniformly Distributed Load (UDL / w)</option>
          </select>
        </Field>
        <Field label="Beam Span Length (L in Meters)">
          <input type="number" step="0.5" min="0.5" value={spanLength} onChange={(e) => setSpanLength(e.target.value)} />
        </Field>
        <Field label={loadType === 'point' ? 'Load Force P (kN)' : 'Uniform Load w (kN/m)'}>
          <input type="number" step="1" min="0.1" value={loadValue} onChange={(e) => setLoadValue(e.target.value)} />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Modulus of Elasticity E (GPa)">
          <input type="number" step="1" min="1" value={elasticModulus} onChange={(e) => setElasticModulus(e.target.value)} />
        </Field>
        <Field label="Second Moment of Area / Inertia I (cm⁴)">
          <input type="number" step="100" min="1" value={momentInertia} onChange={(e) => setMomentInertia(e.target.value)} />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Beam Mechanics</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Max Bending Moment</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>{res.maxMoment} kN·m</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Max Shear Force</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0' }}>{res.maxShear} kN</p>
            </div>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Max Deflection</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: res.passesLimit ? '#16a34a' : '#e11d48' }}>
                {res.deflectionMM} mm
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>L/250 Standard Limit: {res.limitMM} mm</span>
            </div>
          </div>

          <CopyBtn text={res.copyText} label="Copy Structural Calculation" />
        </div>
      )}
    </div>
  )
}
