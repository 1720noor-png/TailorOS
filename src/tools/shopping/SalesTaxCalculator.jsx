import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { money } from '../../components/print.js'
import { num } from '../../utils/calc.js'
import { salesTax } from '../../utils/shop.js'

export default function SalesTaxCalculator() {
  const [mode, setMode] = useState('add')
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    try { setOut(salesTax(num(amount), num(rate), mode)); setErr('') } catch (e) { setErr(e.message) }
  }
  const reset = () => { setAmount(''); setRate(''); setOut(null); setErr('') }
  const text = out ? `Price before tax: ${money(out.net)}\nSales tax (${rate}%): ${money(out.tax)}\nPrice with tax: ${money(out.gross)}` : ''
  return (
    <div>
      <div className="row">
        <Field label="What do you want to do?">
          <select value={mode} onChange={(e) => { setMode(e.target.value); setOut(null); setErr('') }}>
            <option value="add">Add tax to a price</option>
            <option value="remove">Take tax out of a price that already includes it</option>
          </select>
        </Field>
        <Field label={mode === 'add' ? 'Price before tax' : 'Price including tax'}><input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Field label="Sales tax rate (%)"><input type="number" min="0" max="100" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>Price before tax: <strong>{money(out.net)}</strong></p>
        <p>Sales tax: <strong>{money(out.tax)}</strong></p>
        <p>Price with tax: <strong>{money(out.gross)}</strong></p>
        <CopyBtn text={text} label="Copy result" />
      </div>}
      <p className="hint">Enter the rate that applies where you shop; ToolHub does not look up tax rates. Results are rounded to 2 decimals for display only.</p>
    </div>
  )
}
