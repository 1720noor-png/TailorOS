import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState(100)
  const [reps, setReps] = useState(5)
  const [unit, setUnit] = useState('kg')

  const w = Number(weight) || 0
  const r = Number(reps) || 0

  let epley = 0
  let brzycki = 0
  let lander = 0

  if (w > 0 && r > 0) {
    epley = r === 1 ? w : w * (1 + r / 30)
    brzycki = r === 1 ? w : w * (36 / (37 - r))
    lander = r === 1 ? w : (100 * w) / (101.3 - 2.67123 * r)
  }

  const avgOneRepMax = Math.round((epley + brzycki + lander) / 3)

  const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50].map((pct) => {
    const load = Math.round((avgOneRepMax * pct) / 100)
    return { pct, load }
  })

  const reportText = `One-Rep Max (1RM) Assessment
---------------------------------------------
Lifted Load: ${w} ${unit} for ${r} repetitions

Estimated 1RM Breakdown:
• Epley Formula: ${Math.round(epley)} ${unit}
• Brzycki Formula: ${Math.round(brzycki)} ${unit}
• Lander Formula: ${Math.round(lander)} ${unit}
• Average Estimated 1RM: ${avgOneRepMax} ${unit}

Training Percentage Load Matrix:
${percentages.map((p) => `• ${p.pct}% 1RM = ${p.load} ${unit}`).join('\n')}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label={`Weight Lifted (${unit})`}>
          <input type="number" min="1" max="1000" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
        <Field label="Reps Performed (1-12)">
          <input type="number" min="1" max="12" value={reps} onChange={(e) => setReps(e.target.value)} />
        </Field>
        <Field label="Weight Unit">
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Estimated 1RM: <strong>{avgOneRepMax} {unit}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Epley: {Math.round(epley)} {unit} | Brzycki: {Math.round(brzycki)} {unit} | Lander: {Math.round(lander)} {unit}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Percentage of 1RM</th>
              <th>Calculated Weight ({unit})</th>
              <th>Training Zone Focus</th>
            </tr>
          </thead>
          <tbody>
            {percentages.map((p) => (
              <tr key={p.pct} className={p.pct === 85 ? 'best' : ''}>
                <td><strong>{p.pct}% 1RM</strong></td>
                <td>{p.load} {unit}</td>
                <td>
                  {p.pct >= 90 ? 'Max Strength / Peaking' : p.pct >= 80 ? 'Strength & Hypertrophy' : 'Hypertrophy & Endurance'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy 1RM Matrix" />
        <button type="button" className="btn ghost" onClick={() => download('one-rep-max-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
