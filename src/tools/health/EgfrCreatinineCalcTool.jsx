import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function EgfrCreatinineCalcTool() {
  const [serumCreatinine, setSerumCreatinine] = useState('1.1') // mg/dL
  const [age, setAge] = useState('58') // years
  const [gender, setGender] = useState('female') // female | male
  const [weightKg, setWeightKg] = useState('65') // kg (for Cockcroft-Gault)
  const [unit, setUnit] = useState('mgdl') // mgdl | umoll
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      let scr = parseFloat(serumCreatinine)
      const a = parseFloat(age)
      const wt = parseFloat(weightKg)

      if (isNaN(scr) || scr <= 0) return setErr('Please enter a valid serum creatinine value.')
      if (isNaN(a) || a < 18 || a > 120) return setErr('Adult age must be between 18 and 120 years.')
      if (isNaN(wt) || wt <= 0) return setErr('Weight must be a positive number.')
      setErr('')

      // Convert µmol/L to mg/dL if needed (1 mg/dL = 88.4 µmol/L)
      if (unit === 'umoll') {
        scr = scr / 88.4
      }

      // 1. CKD-EPI (2021 Race-Free Equation - Standard Recommendation):
      // eGFR = 142 * min(Scr/kappa, 1)^alpha * max(Scr/kappa, 1)^-1.200 * 0.9938^Age * (1.012 if female)
      const isFemale = gender === 'female'
      const kappa = isFemale ? 0.7 : 0.9
      const alphaVal = isFemale ? -0.241 : -0.302
      const genderFactor = isFemale ? 1.012 : 1.0

      const minTerm = Math.pow(Math.min(scr / kappa, 1), alphaVal)
      const maxTerm = Math.pow(Math.max(scr / kappa, 1), -1.200)
      const ageTerm = Math.pow(0.9938, a)

      const egfrCkdEpi = 142 * minTerm * maxTerm * ageTerm * genderFactor

      // 2. Cockcroft-Gault Creatinine Clearance (CrCl in mL/min):
      // CrCl = [(140 - Age) * Weight_kg] / (72 * Scr_mgdl) * (0.85 if female)
      let crcl = ((140 - a) * wt) / (72 * scr)
      if (isFemale) crcl = crcl * 0.85

      // CKD Stage Classification
      let ckdStage = 'Stage 1 (Normal or High GFR)'
      let stageColor = '#16a34a'
      if (egfrCkdEpi >= 90) {
        ckdStage = 'Stage 1 (Normal / High Kidney Function: ≥ 90 mL/min/1.73m²)'
        stageColor = '#16a34a'
      } else if (egfrCkdEpi >= 60) {
        ckdStage = 'Stage 2 (Mildly Decreased: 60–89 mL/min/1.73m²)'
        stageColor = '#65a30d'
      } else if (egfrCkdEpi >= 45) {
        ckdStage = 'Stage 3a (Mild to Moderate Loss: 45–59 mL/min/1.73m²)'
        stageColor = '#d97706'
      } else if (egfrCkdEpi >= 30) {
        ckdStage = 'Stage 3b (Moderate to Severe Loss: 30–44 mL/min/1.73m²)'
        stageColor = '#ea580c'
      } else if (egfrCkdEpi >= 15) {
        ckdStage = 'Stage 4 (Severely Decreased: 15–29 mL/min/1.73m²)'
        stageColor = '#e11d48'
      } else {
        ckdStage = 'Stage 5 (Kidney Failure / End Stage: < 15 mL/min/1.73m²)'
        stageColor = '#991b1b'
      }

      setRes({
        egfr: Math.round(egfrCkdEpi),
        crcl: Math.round(crcl),
        ckdStage,
        stageColor,
        copyText: `Renal Function Assessment: CKD-EPI (2021) eGFR: ${Math.round(egfrCkdEpi)} mL/min/1.73m² (${ckdStage}), Cockcroft-Gault CrCl: ${Math.round(crcl)} mL/min (Age: ${a}, Scr: ${scr.toFixed(2)} mg/dL, ${isFemale ? 'Female' : 'Male'}, ${wt} kg).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1rem' }}>
        Calculate estimated Glomerular Filtration Rate (eGFR) via the 2021 race-free CKD-EPI equation and Creatinine Clearance (CrCl) via Cockcroft-Gault for medication dosing adjustments.
      </p>

      <div style={{ padding: '0.6rem 0.8rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#92400e', marginBottom: '1.25rem' }}>
        ⚠️ <strong>Clinical Disclaimer:</strong> For informational and educational purposes only. Always consult standard hospital clinical guidelines and clinical pharmacists for critical drug titrations.
      </div>

      <div className="row">
        <Field label="Serum Creatinine">
          <input type="number" step="0.05" min="0.1" value={serumCreatinine} onChange={(e) => setSerumCreatinine(e.target.value)} />
        </Field>
        <Field label="Creatinine Unit">
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="mgdl">mg/dL (US Standard)</option>
            <option value="umoll">µmol/L (SI Standard)</option>
          </select>
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Patient Biological Sex">
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </Field>
        <Field label="Age (Years, 18+)">
          <input type="number" min="18" max="120" value={age} onChange={(e) => setAge(e.target.value)} />
        </Field>
        <Field label="Patient Weight (kg)">
          <input type="number" step="0.5" min="20" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Renal Clearance</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>CKD-EPI (2021) eGFR</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.2rem 0', color: res.stageColor }}>
                {res.egfr} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>mL/min/1.73m²</span>
              </p>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Cockcroft-Gault CrCl</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>
                {res.crcl} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>mL/min</span>
              </p>
            </div>
          </div>

          <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Kidney Function Classification:</span>
            <strong style={{ fontSize: '0.95rem', color: res.stageColor }}>{res.ckdStage}</strong>
          </div>

          <CopyBtn text={res.copyText} label="Copy eGFR / CrCl Findings" />
        </div>
      )}
    </div>
  )
}
