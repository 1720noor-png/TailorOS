import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function MacroCalculator() {
  const [calories, setCalories] = useState(2200)
  const [goal, setGoal] = useState('maintain') // 'cut', 'maintain', 'bulk'
  const [dietStyle, setDietStyle] = useState('balanced') // 'balanced', 'highProtein', 'lowCarb', 'keto'
  const [meals, setMeals] = useState(4)

  let cals = Number(calories) || 2000
  if (goal === 'cut') cals = Math.max(1200, cals - 400)
  if (goal === 'bulk') cals += 400

  // Ratios: [Protein %, Carbs %, Fat %]
  let pPct = 30
  let cPct = 40
  let fPct = 30

  if (dietStyle === 'highProtein') {
    pPct = 40; cPct = 35; fPct = 25
  } else if (dietStyle === 'lowCarb') {
    pPct = 35; cPct = 20; fPct = 45
  } else if (dietStyle === 'keto') {
    pPct = 25; cPct = 5; fPct = 70
  }

  const pGrams = Math.round((cals * (pPct / 100)) / 4)
  const cGrams = Math.round((cals * (cPct / 100)) / 4)
  const fGrams = Math.round((cals * (fPct / 100)) / 9)

  const numMeals = Number(meals) || 3
  const pPerMeal = Math.round(pGrams / numMeals)
  const cPerMeal = Math.round(cGrams / numMeals)
  const fPerMeal = Math.round(fGrams / numMeals)

  const reportText = `Daily Macronutrient Distribution Target
------------------------------------------------
Goal: ${goal.toUpperCase()} (${cals} kcal/day)
Diet Preset: ${dietStyle}
Meals per day: ${numMeals}

Daily Targets:
• Protein (${pPct}%): ${pGrams}g (${pGrams * 4} kcal)
• Carbs (${cPct}%): ${cGrams}g (${cGrams * 4} kcal)
• Fats (${fPct}%): ${fGrams}g (${fGrams * 9} kcal)

Per Meal (${numMeals} meals/day):
• Protein: ${pPerMeal}g
• Carbs: ${cPerMeal}g
• Fats: ${fPerMeal}g`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Base Calorie Intake (kcal)">
          <input type="number" step="50" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </Field>
        <Field label="Fitness Goal">
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="maintain">Maintain Weight</option>
            <option value="cut">Fat Loss (-400 kcal)</option>
            <option value="bulk">Muscle Building (+400 kcal)</option>
          </select>
        </Field>
        <Field label="Macro Ratio Preset">
          <select value={dietStyle} onChange={(e) => setDietStyle(e.target.value)}>
            <option value="balanced">Balanced (30P / 40C / 30F)</option>
            <option value="highProtein">High Protein (40P / 35C / 25F)</option>
            <option value="lowCarb">Low Carb (35P / 20C / 45F)</option>
            <option value="keto">Ketogenic (25P / 5C / 70F)</option>
          </select>
        </Field>
        <Field label="Meals per Day">
          <input type="number" min="1" max="8" value={meals} onChange={(e) => setMeals(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Total Target Calories: <strong>{cals} kcal</strong> / day</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          🥩 Protein: <strong>{pGrams}g</strong> ({pPct}%) | 🍞 Carbs: <strong>{cGrams}g</strong> ({cPct}%) | 🥑 Fats: <strong>{fGrams}g</strong> ({fPct}%)
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Macronutrient</th>
              <th>Gram Split (% cals)</th>
              <th>Per Meal Target ({numMeals} meals)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>🥩 Protein</strong> (4 kcal/g)</td>
              <td>{pGrams}g ({pPct}%)</td>
              <td>{pPerMeal}g / meal</td>
            </tr>
            <tr>
              <td><strong>🍞 Carbohydrates</strong> (4 kcal/g)</td>
              <td>{cGrams}g ({cPct}%)</td>
              <td>{cPerMeal}g / meal</td>
            </tr>
            <tr>
              <td><strong>🥑 Healthy Fats</strong> (9 kcal/g)</td>
              <td>{fGrams}g ({fPct}%)</td>
              <td>{fPerMeal}g / meal</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy Macro Targets" />
        <button type="button" className="btn ghost" onClick={() => download('macro-targets.txt', reportText)}>
          Download Plan (.txt)
        </button>
      </div>
    </div>
  )
}
