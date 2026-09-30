import { useState } from 'react'

const CROCKERY_ITEMS = [
  { id: 1, name: 'Stainless Steel Saucepan', category: 'Pots & Pans', bestFor: 'Boiling pasta, simmering sauces, soups', care: 'Dishwasher safe. Avoid harsh steel wool on polished exterior.' },
  { id: 2, name: 'Cast Iron Skillet', category: 'Pots & Pans', bestFor: 'Searing steaks, baking cornbread, deep frying', care: 'Hand wash without soap. Season regularly with oil. Keep dry to prevent rust.' },
  { id: 3, name: 'Non-Stick Frying Pan', category: 'Pots & Pans', bestFor: 'Cooking eggs, pancakes, delicate fish fillets', care: 'Use silicone/wooden utensils only. Avoid high heat. Hand wash gently.' },
  { id: 4, name: 'Chef Knife (8-inch)', category: 'Knives & Cutlery', bestFor: 'Chopping vegetables, dicing meat, general prep', care: 'Hand wash immediately. Never put in dishwasher. Hone blade regularly.' },
  { id: 5, name: 'Serrated Bread Knife', category: 'Knives & Cutlery', bestFor: 'Slicing crusty bread, tomatoes, soft baked goods', care: 'Hand wash. Requires special serrated sharpener when dull.' },
  { id: 6, name: 'Ceramic Dinner Plates', category: 'Tableware', bestFor: 'Serving main course meals', care: 'Microwave and dishwasher safe. Avoid sudden thermal shocks.' },
  { id: 7, name: 'Porcelain Soup Bowls', category: 'Tableware', bestFor: 'Soups, stews, cereal, salad bowls', care: 'Microwave safe. Stack carefully with felt separators.' },
  { id: 8, name: 'Highball Glassware', category: 'Glassware', bestFor: 'Water, iced tea, cocktails, juices', care: 'Top-rack dishwasher safe. Store upright.' },
  { id: 9, name: 'Stemmed Wine Glasses', category: 'Glassware', bestFor: 'Red and white wines', care: 'Hand wash recommended. Air dry on soft towel.' },
  { id: 10, name: 'Pyrex Glass Baking Dish', category: 'Bakeware', bestFor: 'Casseroles, lasagnas, roasted meats', care: 'Oven safe up to 425°F. Do not place hot glass directly on cold wet surfaces.' },
  { id: 11, name: 'Dutch Oven (Enameled)', category: 'Pots & Pans', bestFor: 'Slow-cooked stews, braising, baking sourdough', care: 'Hand wash with mild soap. Avoid metal utensils that scratch enamel.' },
  { id: 12, name: 'Silicone Spatula & Tongs', category: 'Utensils', bestFor: 'Stirring sauces, turning food in non-stick pans', care: 'Heat resistant up to 450°F. Dishwasher safe.' }
]

export default function KitchenCrockeryGuide() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = CROCKERY_ITEMS.filter((item) => {
    if (category !== 'All' && item.category !== category) return false
    if (!query.trim()) return true
    return (
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.bestFor.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    )
  })

  return (
    <div className="panel">
      <h2>Crockery & Kitchenware Guide</h2>
      <p className="hint">Comprehensive guide to cookware, glassware, knives, and kitchenware care instructions.</p>

      <div className="row">
        <div className="field">
          <span>Search Item or Material</span>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Cast Iron, Wine, Pan..." />
        </div>

        <div className="field">
          <span>Category Filter</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Pots & Pans">Pots & Pans</option>
            <option value="Knives & Cutlery">Knives & Cutlery</option>
            <option value="Tableware">Tableware</option>
            <option value="Glassware">Glassware</option>
            <option value="Bakeware">Bakeware</option>
            <option value="Utensils">Utensils</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Kitchenware Guide Items ({filtered.length})</h3>
        <div className="grid">
          {filtered.map((item) => (
            <div key={item.id} className="tool" style={{ background: 'var(--card)' }}>
              <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
              <p style={{ color: 'var(--brand)', fontWeight: 600, fontSize: '0.85rem' }}>{item.category}</p>
              <div style={{ margin: '0.5rem 0' }}>
                <strong>Best Used For:</strong>
                <p className="hint" style={{ marginTop: '0.2rem' }}>{item.bestFor}</p>
              </div>
              <div className="doc" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <strong>Care & Maintenance:</strong> {item.care}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
