import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { money } from '../../components/print.js'
import { num } from '../../utils/calc.js'

export default function CostPerUseCalculator() {
  const [price, setPrice] = useState('')
  const [uses, setUses] = useState('')
  const [life, setLife] = useState('')
  const [unit, setUnit] = useState('uses')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const p = num(price)
    const u = unit === 'uses' ? num(uses) : num(life)
    if (!Number.isFinite(p) || p <= 0) return setErr('Enter a purchase price greater than zero.'), setOut(null)
    if (!Number.isFinite(u) || u <= 0) return setErr(`Enter the number of ${unit} greater than zero.`), setOut(null)
    setErr('')
    setOut({ perUse: p / u })
  }
  return (
    <div>
      <div className="row">
        <Field label="Purchase price"><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        <Field label="Track by"><select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="uses">Number of uses</option><option value="days">Days of use</option>
        </select></Field>
        {unit === 'uses'
          ? <Field label="Expected uses"><input type="number" min="0" value={uses} onChange={(e) => setUses(e.target.value)} /></Field>
          : <Field label="Expected days of use"><input type="number" min="0" value={life} onChange={(e) => setLife(e.target.value)} /></Field>}
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Cost per {unit === 'uses' ? 'use' : 'day'}: <strong>{money(out.perUse)}</strong></p>
      </div>}
      <p className="hint">Useful for comparing a cheap item you'll use rarely against a pricier one you'll use often — e.g. a $120 coat worn 100 times is $1.20/wear.</p>
    </div>
  )
}
