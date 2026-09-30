import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PetFeedingSchedule() {
  const [petName, setPetName] = useState('Max')
  const [petType, setPetType] = useState('dog') // 'dog', 'cat', 'puppy'
  const [weightKg, setWeightKg] = useState(15)
  const [mealsPerDay, setMealsPerDay] = useState(2)

  const w = Number(weightKg) || 1

  let totalGrams = 0
  if (petType === 'dog') totalGrams = Math.round(w * 15 + 50)
  else if (petType === 'cat') totalGrams = Math.round(w * 12 + 20)
  else if (petType === 'puppy') totalGrams = Math.round(w * 30)

  const m = Number(mealsPerDay) || 2
  const portionPerMeal = Math.round(totalGrams / m)

  const defaultTimes = {
    1: ['08:00 AM'],
    2: ['08:00 AM', '06:00 PM'],
    3: ['07:30 AM', '01:00 PM', '07:00 PM'],
  }

  const times = defaultTimes[m] || defaultTimes[2]

  const reportText = `Pet Feeding Schedule for ${petName} (${petType.toUpperCase()})
------------------------------------------------------
Pet Weight: ${weightKg} kg
Daily Total Portion: ~${totalGrams} grams
Meals per Day: ${m} meals
Portion per Meal: ~${portionPerMeal} grams

Scheduled Feeding Times:
${times.map((t, idx) => `• Meal ${idx + 1} (${t}): ${portionPerMeal}g`).join('\n')}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Pet Name">
          <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} />
        </Field>
        <Field label="Pet Type / Life Stage">
          <select value={petType} onChange={(e) => setPetType(e.target.value)}>
            <option value="dog">Adult Dog</option>
            <option value="cat">Adult Cat</option>
            <option value="puppy">Puppy / Kitten (Growing)</option>
          </select>
        </Field>
        <Field label="Weight (kg)">
          <input type="number" min="0.5" max="100" step="0.5" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </Field>
        <Field label="Meals Per Day">
          <select value={mealsPerDay} onChange={(e) => setMealsPerDay(Number(e.target.value))}>
            <option value={1}>1 Meal / Day</option>
            <option value={2}>2 Meals / Day (Recommended)</option>
            <option value={3}>3 Meals / Day</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Total Recommended Daily Food: <strong>~{totalGrams} grams</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Portion Size: <strong>~{portionPerMeal} grams per meal</strong> ({m} meals / day)
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Meal Sequence</th>
              <th>Suggested Time</th>
              <th>Portion Portion</th>
            </tr>
          </thead>
          <tbody>
            {times.map((t, idx) => (
              <tr key={idx}>
                <td><strong>Meal {idx + 1}</strong></td>
                <td>{t}</td>
                <td>{portionPerMeal} grams</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Schedule" />
        <button type="button" className="btn ghost" onClick={() => download('pet-feeding-schedule.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
