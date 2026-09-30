import { useState, useEffect } from 'react'

const STORAGE_KEY = 'toolhub_weekly_meal_plan'

const DEFAULT_PLAN = {
  Monday: { breakfast: 'Oatmeal & Berries', lunch: 'Grilled Chicken Salad', dinner: 'Pasta Primavera', snack: 'Almonds' },
  Tuesday: { breakfast: 'Avocado Toast', lunch: 'Quinoa Bowl', dinner: 'Stir-Fry Vegetables', snack: 'Apple Slices' },
  Wednesday: { breakfast: 'Greek Yogurt & Honey', lunch: 'Turkey Sandwich', dinner: 'Baked Salmon & Broccoli', snack: 'Dark Chocolate' },
  Thursday: { breakfast: 'Smoothie Bowl', lunch: 'Lentil Soup', dinner: 'Tofu Curry & Rice', snack: 'Carrot Sticks' },
  Friday: { breakfast: 'Scrambled Eggs', lunch: 'Mediterranean Wrap', dinner: 'Homemade Veggie Pizza', snack: 'Popcorn' },
  Saturday: { breakfast: 'Pancakes & Fruit', lunch: 'Caesar Salad', dinner: 'Grilled Steak or Tacos', snack: 'Mixed Nuts' },
  Sunday: { breakfast: 'Fruit Parfait', lunch: 'Leftover Platter', dinner: 'Roast Chicken & Veggies', snack: 'Berry Smoothie' }
}

export default function WeeklyMealPlanner() {
  const [plan, setPlan] = useState(DEFAULT_PLAN)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setPlan(JSON.parse(saved))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleMealChange = (day, mealType, value) => {
    const updated = {
      ...plan,
      [day]: {
        ...plan[day],
        [mealType]: value
      }
    }
    setPlan(updated)
  }

  const savePlan = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
      setMsg('Weekly meal plan saved successfully!')
      setTimeout(() => setMsg(''), 3000)
    } catch (e) {
      console.error(e)
    }
  }

  const autoGeneratePlan = () => {
    const breakfasts = ['Avocado Toast', 'Berry Smoothie', 'Oatmeal Bowl', 'Scrambled Eggs', 'Greek Yogurt']
    const lunches = ['Grilled Chicken Salad', 'Quinoa Veggie Bowl', 'Turkey Club Wrap', 'Lentil Soup', 'Mediterranean Salad']
    const dinners = ['Pasta Primavera', 'Stir-Fry Tofu & Rice', 'Baked Salmon & Asparagus', 'Veggie Pizza', 'Taco Bowl']
    const snacks = ['Almonds', 'Apple & Peanut Butter', 'Carrot Sticks & Hummus', 'Berry Parfait', 'Mixed Nuts']

    const newPlan = {}
    Object.keys(DEFAULT_PLAN).forEach((day) => {
      newPlan[day] = {
        breakfast: breakfasts[Math.floor(Math.random() * breakfasts.length)],
        lunch: lunches[Math.floor(Math.random() * lunches.length)],
        dinner: dinners[Math.floor(Math.random() * dinners.length)],
        snack: snacks[Math.floor(Math.random() * snacks.length)]
      }
    })

    setPlan(newPlan)
    setMsg('New meal plan generated!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="panel">
      <h2>Weekly Meal Planner</h2>
      <p className="hint">Auto-generate or customize your weekly meal menu (Monday - Sunday) for healthy routine planning.</p>

      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        <button className="btn" onClick={autoGeneratePlan}>🎲 Auto-Generate Random Week Plan</button>
        <button className="btn ghost" onClick={savePlan}>💾 Save Meal Plan</button>
        <button className="btn ghost" onClick={() => window.print()}>🖨️ Print Plan</button>
      </div>

      {msg && <div className="msg ok">{msg}</div>}

      <div className="scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
              <th>Snack</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(plan).map((day) => (
              <tr key={day}>
                <td><strong>{day}</strong></td>
                <td>
                  <input type="text" value={plan[day].breakfast} onChange={(e) => handleMealChange(day, 'breakfast', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={plan[day].lunch} onChange={(e) => handleMealChange(day, 'lunch', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={plan[day].dinner} onChange={(e) => handleMealChange(day, 'dinner', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={plan[day].snack} onChange={(e) => handleMealChange(day, 'snack', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
