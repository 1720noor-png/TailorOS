import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function WeightOnPlanetsCalculator() {
  const [weightEarth, setWeightEarth] = useState(70)
  const [unit, setUnit] = useState('kg')

  const w = Number(weightEarth) || 0

  // Gravity Ratios relative to Earth (1.0 g)
  const planets = [
    { name: 'Mercury', ratio: 0.38, desc: 'Extreme temperatures & thin atmosphere' },
    { name: 'Venus', ratio: 0.91, desc: 'Similar size to Earth with crushing pressure' },
    { name: 'Moon (Earth)', ratio: 0.166, desc: 'Low gravity; astronauts jump high' },
    { name: 'Mars', ratio: 0.38, desc: 'Red planet; home to Olympus Mons' },
    { name: 'Jupiter', ratio: 2.34, desc: 'Massive gas giant with intense gravity' },
    { name: 'Saturn', ratio: 1.06, desc: 'Ringed gas giant; lower density than water' },
    { name: 'Uranus', ratio: 0.92, desc: 'Ice giant tilted on its side' },
    { name: 'Neptune', ratio: 1.19, desc: 'Windiest planet in the Solar System' },
    { name: 'Pluto (Dwarf)', ratio: 0.063, desc: 'Dwarf planet in Kuiper Belt' },
  ]

  const fmt = (n) => (n * w).toFixed(1)

  const reportText = `Weight Across Solar System Bodies
-----------------------------------------------
Earth Weight: ${w} ${unit}

Equivalent Planetary Weights:
${planets.map((p) => `• ${p.name}: ${fmt(p.ratio)} ${unit} (${p.ratio}g)`).join('\n')}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label={`Your Weight on Earth (${unit})`}>
          <input type="number" min="1" max="500" value={weightEarth} onChange={(e) => setWeightEarth(e.target.value)} />
        </Field>
        <Field label="Weight Unit">
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>On Mars: <strong>{fmt(0.38)} {unit}</strong> | On Moon: <strong>{fmt(0.166)} {unit}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          On Jupiter (Gas Giant): <strong>{fmt(2.34)} {unit}</strong>
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Celestial Body</th>
              <th>Surface Gravity</th>
              <th>Equivalent Weight ({unit})</th>
              <th>Fun Fact / Characteristic</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => (
              <tr key={p.name}>
                <td><strong>{p.name}</strong></td>
                <td>{p.ratio} g</td>
                <td><strong>{fmt(p.ratio)} {unit}</strong></td>
                <td>{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Weight Chart" />
        <button type="button" className="btn ghost" onClick={() => download('planetary-weights.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
