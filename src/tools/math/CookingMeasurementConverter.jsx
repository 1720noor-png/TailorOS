import { useState } from 'react'
import { Field } from '../../components/ui.jsx'

// All conversions relative to milliliters (volume) or grams (weight), approximate for cooking use.
const VOLUME_ML = { teaspoon: 4.92892, tablespoon: 14.7868, 'fluid ounce': 29.5735, cup: 236.588, pint: 473.176, quart: 946.353, liter: 1000, milliliter: 1 }
const WEIGHT_G = { gram: 1, kilogram: 1000, ounce: 28.3495, pound: 453.592 }

export default function CookingMeasurementConverter() {
  const [kind, setKind] = useState('volume')
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('cup')
  const table = kind === 'volume' ? VOLUME_ML : WEIGHT_G
  const units = Object.keys(table)
  const v = Number(value) || 0
  const base = v * table[from]
  return (
    <div>
      <div className="row">
        <Field label="Measurement type"><select value={kind} onChange={(e) => { setKind(e.target.value); setFrom(e.target.value === 'volume' ? 'cup' : 'gram') }}>
          <option value="volume">Volume</option><option value="weight">Weight</option>
        </select></Field>
        <Field label="Amount"><input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
        <Field label="Unit"><select value={from} onChange={(e) => setFrom(e.target.value)}>{units.map((u) => <option key={u} value={u}>{u}</option>)}</select></Field>
      </div>
      <div className="out" role="status">
        {units.filter((u) => u !== from).map((u) => (
          <p key={u}>{(base / table[u]).toFixed(3).replace(/\.?0+$/, '')} {u}{(base / table[u]) !== 1 ? 's' : ''}</p>
        ))}
      </div>
      <p className="hint">Cooking conversions are approximate (US customary measures) — density affects weight-to-volume conversions for specific ingredients.</p>
    </div>
  )
}
