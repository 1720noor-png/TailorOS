import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PackingListGenerator() {
  const [climate, setClimate] = useState('warm') // 'warm', 'cold', 'rainy'
  const [days, setDays] = useState(5)
  const [purpose, setPurpose] = useState('vacation') // 'vacation', 'business', 'outdoor'
  const [newItem, setNewItem] = useState('')
  const [checkedItems, setCheckedItems] = useState({})

  const d = Math.max(1, Number(days) || 1)

  // Generate base list items
  const baseItems = {
    Essential: ['Passport / ID', 'Wallet / Credit Cards', 'Phone & Charger', 'Travel Documents / Tickets', 'House Keys'],
    Clothing: [
      `${d + 1} Pairs of Underwear`,
      `${d + 1} Pairs of Socks`,
      `${Math.min(d, 5)} Shirts / Tops`,
      `${Math.max(1, Math.floor(d / 2))} Pants / Shorts`,
      'Sleepwear / Pyjamas',
    ],
    Toiletries: ['Toothbrush & Toothpaste', 'Shampoo & Soap', 'Deodorant', 'Hairbrush / Comb', 'Sunscreen & Lip Balm'],
    Tech: ['Power Bank', 'Headphones', 'Universal Travel Adapter'],
  }

  if (climate === 'warm') {
    baseItems.Clothing.push('Sunglasses', 'Swimwear', 'Sun Hat')
  } else if (climate === 'cold') {
    baseItems.Clothing.push('Heavy Winter Coat', 'Thermal Base Layers', 'Beanie & Gloves', 'Scarf')
  } else if (climate === 'rainy') {
    baseItems.Clothing.push('Rain Jacket / Waterproof Coat', 'Compact Umbrella', 'Waterproof Shoes')
  }

  if (purpose === 'business') {
    baseItems.Clothing.push('Formal Suit / Blazer', 'Dress Shoes', 'Formal Shirts')
    baseItems.Tech.push('Laptop & Charger', 'Notebook & Pen')
  } else if (purpose === 'outdoor') {
    baseItems.Clothing.push('Hiking Boots', 'Moisture-Wicking Socks')
    baseItems.Essential.push('First Aid Kit', 'Reusable Water Bottle', 'Insect Repellent')
  }

  const toggleCheck = (item) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const allItems = Object.values(baseItems).flat()
  const checkedCount = Object.keys(checkedItems).filter((k) => checkedItems[k]).length

  const reportText = `Travel Packing Checklist (${days} Days - ${climate.toUpperCase()} - ${purpose.toUpperCase()})
----------------------------------------------------------------------
${Object.entries(baseItems)
  .map(([cat, items]) => `\n[ ${cat} ]\n` + items.map((i) => `  [${checkedItems[i] ? 'X' : ' '}] ${i}`).join('\n'))
  .join('\n')}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Trip Duration (Days)">
          <input type="number" min="1" max="60" value={days} onChange={(e) => setDays(e.target.value)} />
        </Field>
        <Field label="Destination Climate">
          <select value={climate} onChange={(e) => setClimate(e.target.value)}>
            <option value="warm">Warm / Beach / Tropical</option>
            <option value="cold">Cold / Winter / Snow</option>
            <option value="rainy">Rainy / Temperate</option>
          </select>
        </Field>
        <Field label="Trip Purpose">
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="vacation">Vacation / Sightseeing</option>
            <option value="business">Business / Work</option>
            <option value="outdoor">Outdoor / Hiking / Camping</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Packing Progress: <strong>{checkedCount} / {allItems.length} items packed</strong></div>
        <div className="meter" style={{ marginTop: '0.6rem' }}>
          <span style={{ width: `${allItems.length ? (checkedCount / allItems.length) * 100 : 0}%` }} />
        </div>
      </div>

      {Object.entries(baseItems).map(([cat, items]) => (
        <div key={cat} style={{ marginTop: '1rem' }}>
          <h3>{cat}</h3>
          <div className="items">
            {items.map((item) => (
              <label key={item} className="item" style={{ cursor: 'pointer' }}>
                <span style={{ textDecoration: checkedItems[item] ? 'line-through' : 'none', opacity: checkedItems[item] ? 0.6 : 1 }}>
                  {item}
                </span>
                <input
                  type="checkbox"
                  checked={!!checkedItems[item]}
                  onChange={() => toggleCheck(item)}
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={reportText} label="Copy Checklist" />
        <button type="button" className="btn ghost" onClick={() => download('packing-list.txt', reportText)}>
          Download List (.txt)
        </button>
      </div>
    </div>
  )
}
