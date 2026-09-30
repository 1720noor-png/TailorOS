import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function LocalAnestheticCalcTool() {
  const [patientWeight, setPatientWeight] = useState('70') // kg
  const [drug, setDrug] = useState('lidocaine_epi') // lidocaine, lidocaine_epi, bupivacaine, articaine
  const [carpuleVolume, setCarpuleVolume] = useState('1.8') // 1.8 mL (US) or 2.2 mL (UK/EU)
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const anesthetics = {
    lidocaine_plain: { name: 'Lidocaine 2% Plain', maxMgPerKg: 4.4, absoluteMaxMg: 300, concPct: 2.0 },
    lidocaine_epi: { name: 'Lidocaine 2% with 1:100,000 Epinephrine', maxMgPerKg: 7.0, absoluteMaxMg: 500, concPct: 2.0 },
    articaine_epi: { name: 'Articaine 4% with 1:100,000 Epinephrine', maxMgPerKg: 7.0, absoluteMaxMg: 500, concPct: 4.0 },
    bupivacaine_epi: { name: 'Bupivacaine 0.5% with 1:200,000 Epinephrine', maxMgPerKg: 2.0, absoluteMaxMg: 90, concPct: 0.5 },
    mepivacaine_plain: { name: 'Mepivacaine 3% Plain', maxMgPerKg: 6.6, absoluteMaxMg: 400, concPct: 3.0 }
  }

  const calc = () => {
    try {
      const wt = parseFloat(patientWeight)
      const carpVol = parseFloat(carpuleVolume)
      const selectedDrug = anesthetics[drug]

      if (isNaN(wt) || wt <= 0) return setErr('Please enter a valid patient weight.')
      if (isNaN(carpVol) || carpVol <= 0) return setErr('Please enter carpule volume (1.8 or 2.2 mL).')
      setErr('')

      // 1. Calculate weight-based maximum dose (mg) vs absolute ceiling
      const wtBasedMaxMg = wt * selectedDrug.maxMgPerKg
      const effectiveMaxMg = Math.min(wtBasedMaxMg, selectedDrug.absoluteMaxMg)

      // 2. Milligrams of anesthetic per mL = concPct * 10 (e.g. 2% = 20 mg/mL)
      const mgPerMl = selectedDrug.concPct * 10

      // 3. Milligrams per carpule / cartridge
      const mgPerCarpule = mgPerMl * carpVol

      // 4. Maximum carpules allowed: effectiveMaxMg / mgPerCarpule
      const maxCarpules = effectiveMaxMg / mgPerCarpule
      const maxTotalMl = effectiveMaxMg / mgPerMl

      setRes({
        drugName: selectedDrug.name,
        effectiveMaxMg: effectiveMaxMg.toFixed(1),
        maxCarpules: Math.floor(maxCarpules * 10) / 10,
        maxTotalMl: maxTotalMl.toFixed(1),
        mgPerCarpule: mgPerCarpule.toFixed(1),
        isCappedByAbsolute: wtBasedMaxMg > selectedDrug.absoluteMaxMg,
        copyText: `Maximum Safe Local Anesthetic (${patientWeight} kg, ${selectedDrug.name}): Max Dose: ${effectiveMaxMg.toFixed(1)} mg (${maxTotalMl.toFixed(1)} mL total). Maximum safe cartridges (${carpuleVolume} mL carpules): ${Math.floor(maxCarpules * 10) / 10} carpules (${mgPerCarpule.toFixed(1)} mg/carpule).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1rem' }}>
        Calculate maximum safe dosages and cartridge/carpule limits for local dental and surgical anesthetics to avoid Local Anesthetic Systemic Toxicity (LAST).
      </p>

      <div style={{ padding: '0.6rem 0.8rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#92400e', marginBottom: '1.25rem' }}>
        ⚠️ <strong>Clinical LAST Safety Notice:</strong> For dental and minor surgery clinical reference. Dosages should be reduced in elderly, medically compromised, or hepatic/cardiovascular-impaired patients.
      </div>

      <div className="row">
        <Field label="Local Anesthetic Agent">
          <select value={drug} onChange={(e) => setDrug(e.target.value)}>
            <option value="lidocaine_epi">Lidocaine 2% + 1:100k Epi (Max 7.0 mg/kg, 500mg cap)</option>
            <option value="lidocaine_plain">Lidocaine 2% Plain (Max 4.4 mg/kg, 300mg cap)</option>
            <option value="articaine_epi">Articaine 4% + 1:100k Epi (Max 7.0 mg/kg, 500mg cap)</option>
            <option value="bupivacaine_epi">Bupivacaine 0.5% + 1:200k Epi (Max 2.0 mg/kg, 90mg cap)</option>
            <option value="mepivacaine_plain">Mepivacaine 3% Plain (Max 6.6 mg/kg, 400mg cap)</option>
          </select>
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Patient Weight (kg)">
          <input type="number" step="0.5" min="5" max="250" value={patientWeight} onChange={(e) => setPatientWeight(e.target.value)} />
        </Field>
        <Field label="Cartridge Volume">
          <select value={carpuleVolume} onChange={(e) => setCarpuleVolume(e.target.value)}>
            <option value="1.8">1.8 mL (US / Standard Dental Carpule)</option>
            <option value="2.2">2.2 mL (UK / European Dental Carpule)</option>
          </select>
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Safe Cartridge Limit</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Maximum Safe Cartridges</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>
                {res.maxCarpules} <span style={{ fontSize: '1rem' }}>Carpules</span>
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({res.maxTotalMl} mL total volume)</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Absolute Dose Limit</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#16a34a' }}>
                {res.effectiveMaxMg} <span style={{ fontSize: '1rem' }}>mg</span>
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{res.mgPerCarpule} mg active drug per carpule</span>
            </div>
          </div>

          <CopyBtn text={res.copyText} label="Copy Local Anesthesia Thresholds" />
        </div>
      )}
    </div>
  )
}
