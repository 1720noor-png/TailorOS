import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function VetFluidTherapyCalcTool() {
  const [species, setSpecies] = useState('canine') // canine | feline
  const [weightKg, setWeightKg] = useState('12') // kg
  const [dehydrationPct, setDehydrationPct] = useState('5') // 0, 5, 7, 8, 10, 12%
  const [ongoingLossMl, setOngoingLossMl] = useState('100') // mL per day (vomiting/diarrhea)
  const [dripFactor, setDripFactor] = useState('15') // 10, 15, 20 (macrodrip) or 60 (microdrip)
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      const wt = parseFloat(weightKg)
      const dehy = parseFloat(dehydrationPct)
      const loss = parseFloat(ongoingLossMl) || 0
      const drops = parseFloat(dripFactor)

      if (isNaN(wt) || wt <= 0) return setErr('Please enter a valid animal weight in kg.')
      if (isNaN(dehy) || dehy < 0 || dehy > 15) return setErr('Dehydration percentage should be between 0% and 15%.')
      setErr('')

      // 1. Maintenance Fluid Rate:
      // Canine: ~60 mL/kg/day (or standard 132 * wt^0.75 for RER)
      // Feline: ~45–50 mL/kg/day (or 80 * wt^0.75)
      const maintRatePerKg = species === 'canine' ? 60 : 45
      const maintMlPerDay = wt * maintRatePerKg

      // 2. Dehydration Deficit Volume (mL) = Weight (kg) * (% Dehydration / 100) * 1000 mL/kg
      const deficitMl = wt * (dehy / 100) * 1000

      // 3. Total 24-Hour Fluid Requirement = Maintenance + Deficit + Ongoing Losses
      const totalDailyMl = maintMlPerDay + deficitMl + loss

      // 4. Hourly Infusion Rate (mL/hr)
      const hourlyRateMl = totalDailyMl / 24

      // 5. Drops Per Minute (gtt/min) for gravity lines = (HourlyRate * DripFactor) / 60
      const dropsPerMin = (hourlyRateMl * drops) / 60
      const secondsPerDrop = 60 / dropsPerMin

      setRes({
        maintMl: Math.round(maintMlPerDay),
        deficitMl: Math.round(deficitMl),
        lossMl: Math.round(loss),
        totalDailyMl: Math.round(totalDailyMl),
        hourlyRateMl: hourlyRateMl.toFixed(1),
        dropsPerMin: Math.round(dropsPerMin),
        secondsPerDrop: secondsPerDrop.toFixed(1),
        speciesLabel: species === 'canine' ? 'Canine (Dog)' : 'Feline (Cat)',
        copyText: `Veterinary Fluid Plan (${species === 'canine' ? 'Dog' : 'Cat'}, ${wt} kg, ${dehy}% Dehydration): Total 24h Fluids: ${Math.round(totalDailyMl)} mL (Maint: ${Math.round(maintMlPerDay)}mL, Deficit: ${Math.round(deficitMl)}mL, Ongoing: ${Math.round(loss)}mL). Infusion Rate: ${hourlyRateMl.toFixed(1)} mL/hr (${Math.round(dropsPerMin)} gtt/min via ${drops} gtt/mL set).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1rem' }}>
        Calculate 24-hour veterinary fluid therapy requirements (mL/day, mL/hr, and gravity drip gtt/min) incorporating maintenance, dehydration deficit, and ongoing fluid losses.
      </p>

      <div style={{ padding: '0.6rem 0.8rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#92400e', marginBottom: '1.25rem' }}>
        ⚠️ <strong>Veterinary Clinical Notice:</strong> Intended for veterinary professionals and technician reference. Adjust infusion rates according to cardiac, renal, and pulmonary monitoring.
      </div>

      <div className="row">
        <Field label="Species">
          <select value={species} onChange={(e) => setSpecies(e.target.value)}>
            <option value="canine">Canine (Dog - 60 mL/kg/day maint)</option>
            <option value="feline">Feline (Cat - 45 mL/kg/day maint)</option>
          </select>
        </Field>
        <Field label="Patient Body Weight (kg)">
          <input type="number" step="0.5" min="0.5" max="100" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Estimated Dehydration (%)">
          <select value={dehydrationPct} onChange={(e) => setDehydrationPct(e.target.value)}>
            <option value="0">0% (Euvolemic / Maintenance Only)</option>
            <option value="5">5% (Mild: Slightly dry mucous membranes)</option>
            <option value="7">7% (Moderate: Skin tenting, dry gums)</option>
            <option value="10">10% (Severe: Prolonged CRT, sunken eyes)</option>
            <option value="12">12% (Critical / Shock presentation)</option>
          </select>
        </Field>
        <Field label="Estimated Ongoing Losses (mL / 24h)">
          <input type="number" min="0" step="10" value={ongoingLossMl} onChange={(e) => setOngoingLossMl(e.target.value)} placeholder="e.g. 100" />
        </Field>
        <Field label="IV Tubing Drip Set (gtt/mL)">
          <select value={dripFactor} onChange={(e) => setDripFactor(e.target.value)}>
            <option value="15">15 gtt/mL (Standard Adult / Macrodrip)</option>
            <option value="10">10 gtt/mL (Macrodrip)</option>
            <option value="20">20 gtt/mL (Macrodrip)</option>
            <option value="60">60 gtt/mL (Microdrip / Pediatric / Small Animal)</option>
          </select>
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Fluid Infusion Plan</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Hourly Pump Infusion Rate</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>
                {res.hourlyRateMl} <span style={{ fontSize: '1rem' }}>mL / hr</span>
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total 24h: {res.totalDailyMl} mL</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Gravity Drip Rate</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#16a34a' }}>
                {res.dropsPerMin} <span style={{ fontSize: '1rem' }}>drops / min</span>
              </p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>1 drop every {res.secondsPerDrop}s ({dripFactor} gtt/mL)</span>
            </div>
          </div>

          <div style={{ padding: '0.6rem 0.8rem', background: '#f1f5f9', borderRadius: '0.375rem', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <strong>24h Fluid Breakdown:</strong> Maintenance: {res.maintMl} mL + Dehydration Deficit: {res.deficitMl} mL + Ongoing Losses: {res.lossMl} mL
          </div>

          <CopyBtn text={res.copyText} label="Copy Fluid Treatment Orders" />
        </div>
      )}
    </div>
  )
}
