import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function ForceCalculator() {
  const [massKg, setMassKg] = useState(10)
  const [accelMs2, setAccelMs2] = useState(9.81)

  const m = Number(massKg) || 0
  const a = Number(accelMs2) || 0

  const forceN = m * a // Newton = kg * m/s^2
  const forceLbf = forceN * 0.224809
  const forceDyne = forceN * 100000

  const fmt = (n) => (Number.isInteger(n) ? n.toString() : n.toFixed(4).replace(/\.?0+$/, ''))

  const reportText = `Newtonian Force Calculation (F = m × a)
------------------------------------------------
Mass (m): ${m} kg
Acceleration (a): ${a} m/s²

Calculated Force (F):
• Newtons (N): ${fmt(forceN)} N
• Pounds-force (lbf): ${fmt(forceLbf)} lbf
• Dynes (dyn): ${Math.round(forceDyne).toLocaleString()} dyn`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Mass (kg)">
          <input type="number" min="0" step="0.1" value={massKg} onChange={(e) => setMassKg(e.target.value)} />
        </Field>
        <Field label="Acceleration (m/s²)">
          <input type="number" step="0.01" value={accelMs2} onChange={(e) => setAccelMs2(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Force (F): <strong>{fmt(forceN)} Newtons (N)</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Equivalent: <strong>{fmt(forceLbf)} lbf</strong> (Pounds-force) | Formula: F = m × a
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Force Unit</th>
              <th>Calculated Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="best">
              <td><strong>Newtons (N - SI Unit)</strong></td>
              <td><strong>{fmt(forceN)} N</strong></td>
            </tr>
            <tr>
              <td>Pounds-force (lbf)</td>
              <td>{fmt(forceLbf)} lbf</td>
            </tr>
            <tr>
              <td>Dynes (dyn - CGS Unit)</td>
              <td>{Math.round(forceDyne).toLocaleString()} dyn</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Force Calculation" />
        <button type="button" className="btn ghost" onClick={() => download('force-calculation.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
