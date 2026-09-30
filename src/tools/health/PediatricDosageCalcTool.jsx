import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PediatricDosageCalcTool() {
  const [weight, setWeight] = useState('14') // kg or lbs
  const [weightUnit, setWeightUnit] = useState('kg') // kg | lbs
  const [dosePerKg, setDosePerKg] = useState('20') // mg/kg/day or per dose
  const [frequency, setFrequency] = useState('bid') // qd (1), bid (2), tid (3), qid (4)
  const [concentrationMg, setConcentrationMg] = useState('250') // mg
  const [concentrationMl, setConcentrationMl] = useState('5') // per mL (e.g. 250mg / 5mL)
  const [maxDailyDose, setMaxDailyDose] = useState('2000') // mg (optional cap)
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const presets = [
    { label: 'Amoxicillin (45 mg/kg/day in 2 divided doses)', dose: '45', freq: 'bid', mg: '250', ml: '5', max: '2000' },
    { label: 'Acetaminophen (15 mg/kg/dose Q4-6H)', dose: '15', freq: 'tid', mg: '160', ml: '5', max: '1000' },
    { label: 'Ibuprofen (10 mg/kg/dose Q6-8H)', dose: '10', freq: 'tid', mg: '100', ml: '5', max: '1200' }
  ]

  const applyPreset = (p) => {
    setDosePerKg(p.dose)
    setFrequency(p.freq)
    setConcentrationMg(p.mg)
    setConcentrationMl(p.ml)
    setMaxDailyDose(p.max)
  }

  const calc = () => {
    try {
      let wt = parseFloat(weight)
      const doseRate = parseFloat(dosePerKg)
      const concMg = parseFloat(concentrationMg)
      const concMl = parseFloat(concentrationMl)
      const maxCap = parseFloat(maxDailyDose) || Infinity

      if (isNaN(wt) || wt <= 0) return setErr('Please enter a valid weight.')
      if (isNaN(doseRate) || doseRate <= 0) return setErr('Please enter a valid target dosage (mg/kg).')
      if (isNaN(concMg) || concMg <= 0 || isNaN(concMl) || concMl <= 0) return setErr('Liquid concentration must be valid numbers (e.g. 250 mg per 5 mL).')
      setErr('')

      // Convert lbs to kg if needed
      const wtKg = weightUnit === 'lbs' ? wt * 0.453592 : wt

      let dosesPerDay = 1
      let freqLabel = 'Once daily (QD)'
      if (frequency === 'bid') { dosesPerDay = 2; freqLabel = 'Twice daily (BID, every 12h)' }
      else if (frequency === 'tid') { dosesPerDay = 3; freqLabel = 'Three times daily (TID, every 8h)' }
      else if (frequency === 'qid') { dosesPerDay = 4; freqLabel = 'Four times daily (QID, every 6h)' }

      // Total daily mg target
      let totalDailyMg = doseRate * wtKg
      let capped = false

      if (totalDailyMg > maxCap) {
        totalDailyMg = maxCap
        capped = true
      }

      const singleDoseMg = totalDailyMg / dosesPerDay

      // Liquid volume (mL) per single dose: (singleDoseMg / concMg) * concMl
      const singleDoseMl = (singleDoseMg / concMg) * concMl
      const totalDailyMl = singleDoseMl * dosesPerDay

      setRes({
        wtKg: wtKg.toFixed(1),
        singleDoseMg: singleDoseMg.toFixed(1),
        singleDoseMl: singleDoseMl.toFixed(1),
        totalDailyMg: totalDailyMg.toFixed(1),
        totalDailyMl: totalDailyMl.toFixed(1),
        freqLabel,
        capped,
        copyText: `Pediatric Dosage (${wtKg.toFixed(1)} kg): Administer ${singleDoseMl.toFixed(1)} mL (${singleDoseMg.toFixed(1)} mg) ${freqLabel} using ${concMg}mg/${concMl}mL suspension. Total daily dose: ${totalDailyMg.toFixed(1)} mg (${totalDailyMl.toFixed(1)} mL).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1rem' }}>
        Calculate pediatric weight-based medication dosages (mg) and exact liquid suspension volume (mL) per administration and 24-hour interval.
      </p>

      <div style={{ padding: '0.6rem 0.8rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#92400e', marginBottom: '1.25rem' }}>
        ⚠️ <strong>Clinical Disclaimer:</strong> For educational reference only. Double-check all pediatric dosing calculations against official pharmacopeia before administering medications.
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Common Pediatric Dosing Regimens:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {presets.map(p => (
            <button key={p.label} type="button" className="btn ghost" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => applyPreset(p)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        <Field label="Child Weight">
          <input type="number" step="0.5" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
        <Field label="Weight Unit">
          <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </select>
        </Field>
        <Field label="Dosing Rate (mg / kg / day)">
          <input type="number" step="1" min="0.1" value={dosePerKg} onChange={(e) => setDosePerKg(e.target.value)} />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Dosing Frequency">
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="bid">Twice daily (BID - Q12H)</option>
            <option value="tid">Three times daily (TID - Q8H)</option>
            <option value="qid">Four times daily (QID - Q6H)</option>
            <option value="qd">Once daily (QD - Q24H)</option>
          </select>
        </Field>
        <Field label="Liquid Bottle Concentration">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="number" value={concentrationMg} onChange={(e) => setConcentrationMg(e.target.value)} placeholder="mg" style={{ width: '80px' }} />
            <span>mg /</span>
            <input type="number" value={concentrationMl} onChange={(e) => setConcentrationMl(e.target.value)} placeholder="mL" style={{ width: '80px' }} />
            <span>mL</span>
          </div>
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Dosage & Volume</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Single Dose Volume</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>
                {res.singleDoseMl} <span style={{ fontSize: '1rem' }}>mL</span>
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Contains {res.singleDoseMg} mg active drug</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Administration Schedule</span>
              <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0.4rem 0', color: '#16a34a' }}>{res.freqLabel}</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total daily: {res.totalDailyMl} mL ({res.totalDailyMg} mg)</span>
            </div>
          </div>

          {res.capped && (
            <div style={{ padding: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.25rem', color: '#991b1b', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              ℹ️ Dose was capped at the adult maximum threshold of {maxDailyDose} mg/day.
            </div>
          )}

          <CopyBtn text={res.copyText} label="Copy Prescription Instructions" />
        </div>
      )}
    </div>
  )
}
