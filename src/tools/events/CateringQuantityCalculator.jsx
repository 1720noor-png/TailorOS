import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// per-person guidelines
const STYLE = {
  'Cocktail / appetizers': { food: '6-8 pieces', drinkOz: 12, iceOz: 24 },
  'Buffet meal': { food: '1 lb', drinkOz: 16, iceOz: 32 },
  'Plated dinner': { food: '0.75 lb (protein+sides)', drinkOz: 16, iceOz: 32 },
  'Dessert table': { food: '2-3 pieces', drinkOz: 8, iceOz: 16 },
}

export default function CateringQuantityCalculator() {
  const [guests, setGuests] = useState('50')
  const [hours, setHours] = useState('3')
  const [style, setStyle] = useState('Buffet meal')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const g = Number(guests), h = Number(hours)
    if (!(g > 0 && h > 0)) { setOut(null); return setErr('Enter a guest count and event length greater than 0.') }
    const s = STYLE[style]
    const hourFactor = 1 + Math.max(0, h - 2) * 0.15
    const drinkOzTotal = g * s.drinkOz * hourFactor
    setErr('')
    setOut({
      food: s.food,
      drinks: Math.ceil(drinkOzTotal / 12) + ' cans/bottles (12oz) or ' + Math.ceil(drinkOzTotal / 33.8) + ' liters',
      ice: Math.ceil((g * s.iceOz * hourFactor) / 16) + ' lb of ice',
    })
  }

  return (
    <div>
      <div className="row">
        <Field label="Guest count"><input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} /></Field>
        <Field label="Event length (hours)"><input type="number" min="0.5" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
        <Field label="Service style"><select value={style} onChange={(e) => setStyle(e.target.value)}>{Object.keys(STYLE).map((s) => <option key={s}>{s}</option>)}</select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate quantities</button></div>
      <Msg>{err}</Msg>
      {out && (
        <div className="out" role="status">
          <p>Food per guest: <strong>{out.food}</strong></p>
          <p>Drinks: <strong>{out.drinks}</strong></p>
          <p>Ice: <strong>{out.ice}</strong></p>
        </div>
      )}
      <Msg kind="status">Standard catering rules of thumb — adjust for your specific menu and guest appetite.</Msg>
    </div>
  )
}
