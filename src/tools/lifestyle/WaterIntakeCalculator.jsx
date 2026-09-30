import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function WaterIntakeCalculator() {
  const [weightKg, setWeightKg] = useState(70)
  const [exerciseMins, setExerciseMins] = useState(45)
  const [climate, setClimate] = useState('normal') // 'normal', 'hot'
  const [loggedGlasses, setLoggedGlasses] = useState(0)

  const w = Number(weightKg) || 0
  const ex = Number(exerciseMins) || 0

  // Base: ~35ml per kg of body weight
  let baseWaterMl = w * 35

  // Exercise: Add ~350ml per 30 minutes of exercise
  const exerciseWaterMl = (ex / 30) * 350
  baseWaterMl += exerciseWaterMl

  // Climate bonus
  if (climate === 'hot') {
    baseWaterMl *= 1.15 // +15% for hot/humid weather
  }

  const totalWaterLiters = (baseWaterMl / 1000).toFixed(2)
  const glassCount = Math.round(baseWaterMl / 250) // 250ml glass

  const logGlass = () => setLoggedGlasses((prev) => Math.min(glassCount, prev + 1))
  const resetLog = () => setLoggedGlasses(0)

  const reportText = `Daily Hydration Plan
------------------------------------
Body Weight: ${weightKg} kg
Daily Exercise: ${exerciseMins} minutes
Climate Conditions: ${climate === 'hot' ? 'Hot & Humid' : 'Normal / Moderate'}

Recommended Hydration:
• Total Volume: ${totalWaterLiters} Liters per day
• 250ml Glasses: ~${glassCount} glasses per day

Today's Logged Progress: ${loggedGlasses} / ${glassCount} glasses (${Math.round((loggedGlasses / glassCount) * 100 || 0)}%)`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Body Weight (kg)">
          <input type="number" min="30" max="250" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </Field>
        <Field label="Daily Exercise (Minutes)">
          <input type="number" min="0" max="300" step="15" value={exerciseMins} onChange={(e) => setExerciseMins(e.target.value)} />
        </Field>
        <Field label="Environment / Weather">
          <select value={climate} onChange={(e) => setClimate(e.target.value)}>
            <option value="normal">Normal / Indoor Climate</option>
            <option value="hot">Hot / Humid Weather (+15%)</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Recommended Daily Hydration: <strong>{totalWaterLiters} Liters</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Equivalent to approximately <strong>{glassCount} standard glasses</strong> (250 ml each)
        </div>
      </div>

      <div style={{ marginTop: '1.2rem' }}>
        <h3>Interactive Today's Tracker</h3>
        <div className="out" style={{ background: 'var(--card)' }}>
          <div>Logged Today: <strong>{loggedGlasses} / {glassCount} glasses</strong> ({((loggedGlasses / (glassCount || 1)) * 100).toFixed(0)}%)</div>
          <div className="meter" style={{ marginTop: '0.6rem' }}>
            <span style={{ width: `${Math.min(100, (loggedGlasses / (glassCount || 1)) * 100)}%` }} />
          </div>
          <div className="actions" style={{ marginTop: '0.8rem' }}>
            <button type="button" className="btn" onClick={logGlass} disabled={loggedGlasses >= glassCount}>
              💧 Drink 1 Glass (+250 ml)
            </button>
            <button type="button" className="btn ghost" onClick={resetLog}>
              Reset Counter
            </button>
          </div>
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={reportText} label="Copy Hydration Plan" />
        <button type="button" className="btn ghost" onClick={() => download('hydration-plan.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
