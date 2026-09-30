import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState('From cost & price')
  const [cost, setCost] = useState('')
  const [price, setPrice] = useState('')
  const [targetMargin, setTargetMargin] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(cost)
    if (!(c >= 0)) { setOut(null); return setErr('Enter a cost of 0 or more.') }
    if (mode === 'From cost & price') {
      const p = Number(price)
      if (!(p > 0)) { setOut(null); return setErr('Enter a selling price greater than 0.') }
      const profit = p - c
      const margin = (profit / p) * 100
      const markup = c > 0 ? (profit / c) * 100 : null
      setErr(''); setOut({ label: 'margin', profit: profit.toFixed(2), margin: margin.toFixed(1), markup: markup !== null ? markup.toFixed(1) : 'n/a' })
    } else {
      const m = Number(targetMargin)
      if (!(m > 0 && m < 100)) { setOut(null); return setErr('Enter a target margin between 0 and 100%.') }
      const price2 = c / (1 - m / 100)
      setErr(''); setOut({ label: 'price', price: price2.toFixed(2) })
    }
  }

  return (
    <div>
      <Field label="What to calculate"><select value={mode} onChange={(e) => setMode(e.target.value)}><option>From cost & price</option><option>Price for a target margin</option></select></Field>
      <div className="row">
        <Field label="Cost per unit ($)"><input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} /></Field>
        {mode === 'From cost & price'
          ? <Field label="Selling price ($)"><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
          : <Field label="Target margin (%)"><input type="number" min="0" max="99" step="0.1" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)} /></Field>}
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && out.label === 'margin' && <p className="out" role="status">Profit: <strong>${out.profit}</strong><br />Margin: <strong>{out.margin}%</strong> · Markup: <strong>{out.markup}%</strong></p>}
      {out && out.label === 'price' && <p className="out" role="status">Selling price needed: <strong>${out.price}</strong></p>}
      <Msg kind="status">Margin is profit ÷ price; markup is profit ÷ cost — they're different numbers for the same sale.</Msg>
    </div>
  )
}
