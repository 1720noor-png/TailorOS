import { useState } from 'react'

const RECIPES_DB = [
  { id: 1, title: 'Creamy Garlic Pasta', diet: 'Vegetarian', prep: '20 mins', ingredients: ['pasta', 'garlic', 'heavy cream', 'parmesan', 'butter', 'olive oil'], instructions: 'Boil pasta. Sauté minced garlic in butter and olive oil. Add cream and simmer. Toss pasta with sauce and parmesan.' },
  { id: 2, title: 'Avocado Toast with Poached Egg', diet: 'Vegetarian', prep: '10 mins', ingredients: ['bread', 'avocado', 'egg', 'lemon', 'chili flakes', 'salt'], instructions: 'Toast bread. Mash avocado with lemon and salt. Poach egg in simmering water. Spread avocado on toast and top with egg.' },
  { id: 3, title: 'Grilled Chicken Salad', diet: 'High Protein', prep: '15 mins', ingredients: ['chicken breast', 'lettuce', 'cucumber', 'cherry tomatoes', 'olive oil', 'lemon'], instructions: 'Season and grill chicken breast. Chop fresh salad vegetables. Slice chicken and toss with olive oil and lemon dressing.' },
  { id: 4, title: 'Vegetable Stir-Fry', diet: 'Vegan', prep: '15 mins', ingredients: ['broccoli', 'bell pepper', 'carrot', 'soy sauce', 'garlic', 'ginger', 'sesame oil'], instructions: 'Sauté garlic and ginger in sesame oil. Add chopped vegetables and stir-fry on high heat. Add soy sauce and serve hot.' },
  { id: 5, title: 'Classic Tomato Soup', diet: 'Vegetarian', prep: '25 mins', ingredients: ['tomatoes', 'onion', 'garlic', 'vegetable broth', 'heavy cream', 'basil'], instructions: 'Sauté onion and garlic. Add diced tomatoes and broth, simmer for 15 mins. Blend until smooth, stir in cream and fresh basil.' },
  { id: 6, title: 'Berry Smoothie Bowl', diet: 'Vegan', prep: '5 mins', ingredients: ['frozen berries', 'banana', 'almond milk', 'chia seeds', 'granola'], instructions: 'Blend berries, banana, and almond milk until thick. Pour into a bowl and top with chia seeds and crunchy granola.' }
]

export default function RecipeFinder() {
  const [mode, setMode] = useState('name') // 'name' | 'ingredients'
  const [query, setQuery] = useState('')
  const [pantry, setPantry] = useState('')
  const [selectedDiet, setSelectedDiet] = useState('All')

  const filterRecipes = () => {
    return RECIPES_DB.filter((r) => {
      if (selectedDiet !== 'All' && r.diet !== selectedDiet) return false

      if (mode === 'name') {
        if (!query.trim()) return true
        return r.title.toLowerCase().includes(query.toLowerCase())
      } else {
        if (!pantry.trim()) return true
        const userItems = pantry.toLowerCase().split(',').map((s) => s.trim()).filter(Boolean)
        return userItems.some((item) => r.ingredients.some((ing) => ing.includes(item)))
      }
    })
  }

  const results = filterRecipes()

  return (
    <div className="panel">
      <h2>Recipe Finder & Pantry Matcher</h2>
      <p className="hint">Find delicious recipes by dish name, dietary requirement, or ingredients available in your pantry.</p>

      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        <button className={`btn ${mode === 'name' ? '' : 'ghost'}`} onClick={() => setMode('name')}>🔍 Search by Dish Name</button>
        <button className={`btn ${mode === 'ingredients' ? '' : 'ghost'}`} onClick={() => setMode('ingredients')}>🥗 Match Ingredients You Have</button>
      </div>

      <div className="row">
        {mode === 'name' ? (
          <div className="field">
            <span>Search Dish Name</span>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Pasta, Salad, Soup" />
          </div>
        ) : (
          <div className="field">
            <span>Enter Available Pantry Ingredients (comma separated)</span>
            <input type="text" value={pantry} onChange={(e) => setPantry(e.target.value)} placeholder="e.g. garlic, tomato, avocado, egg" />
          </div>
        )}

        <div className="field">
          <span>Dietary Preference</span>
          <select value={selectedDiet} onChange={(e) => setSelectedDiet(e.target.value)}>
            <option value="All">All Diets</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="High Protein">High Protein</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Matching Recipes ({results.length})</h3>
        {results.length === 0 ? (
          <div className="empty">No recipes found matching your filter criteria. Try searching for different ingredients or dish names!</div>
        ) : (
          <div className="grid">
            {results.map((recipe) => (
              <div key={recipe.id} className="tool" style={{ background: 'var(--card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{recipe.title}</strong>
                  <span className="hint">{recipe.prep}</span>
                </div>
                <p style={{ color: 'var(--brand)', fontWeight: 600, fontSize: '0.85rem' }}>Diet: {recipe.diet}</p>
                <div style={{ margin: '0.4rem 0' }}>
                  <strong>Ingredients:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                    {recipe.ingredients.map((ing, i) => (
                      <span key={i} style={{ background: 'var(--bg)', border: '1px solid var(--line)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="doc" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <strong>Instructions:</strong> {recipe.instructions}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
