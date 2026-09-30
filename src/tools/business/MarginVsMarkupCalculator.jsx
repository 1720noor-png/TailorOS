import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function MarginVsMarkupCalculator() {
  const [cost, setCost] = useState('50')
  const [value, setValue] = useState('30')
  const [mode, setMode] = useState('markup') // 'markup' or 'margin'
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    const c = parseFloat(cost), v = parseFloat(value)
    if (isNaN(c) || isNaN(v) || c <= 0) return setErr('Enter valid positive cost.')
    setErr('')
    let price = 0, marginPct = 0, markupPct = 0, profit = 0
    if (mode === 'markup') {
      markupPct = v
      price = c * (1 + markupPct / 100)
      profit = price - c
      marginPct = (profit / price) * 100
    } else {
      marginPct = v
      if (marginPct >= 100) return setErr('Margin percentage must be less than 100%.')
      price = c / (1 - marginPct / 100)
      profit = price - c
      markupPct = (profit / c) * 100
    }
    setRes({ price: price.toFixed(2), profit: profit.toFixed(2), marginPct: marginPct.toFixed(2), markupPct: markupPct.toFixed(2) })
  }

  const reset = () => { setCost('50'); setValue('30'); setMode('markup'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        <Field label="Cost Price ($)"><input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} /></Field>
        <Field label="Calculation Mode">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="markup">Set Markup %</option>
            <option value="margin">Set Profit Margin %</option>
          </select>
        </Field>
        <Field label={`${mode === 'markup' ? 'Markup' : 'Margin'} (%)`}><input type="number" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate Pricing</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          <p>Selling Price: <strong>${res.price}</strong> | Profit: <strong>${res.profit}</strong></p>
          <p>Profit Margin: <strong>{res.marginPct}%</strong> of selling price</p>
          <p>Markup: <strong>{res.markupPct}%</strong> over cost price</p>
          <CopyBtn text={`Cost: \$${cost}, Selling Price: \$${res.price}, Profit: \$${res.profit}, Margin: ${res.marginPct}%, Markup: ${res.markupPct}%`} />
        </div>
      )}
    </div>
  )
}