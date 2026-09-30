import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function ProductMarginCalc() {
  const [cost, setCost] = useState('')
  const [price, setPrice] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const c=parseFloat(cost),p=parseFloat(price)
    if(!c||!p){setErr('Enter cost and price.');return}
    const profit=p-c,margin=(profit/p*100),markup=(profit/c*100)
    setResult({profit:profit.toFixed(2),margin:margin.toFixed(1),markup:markup.toFixed(1)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Cost ($)"><input type="number" value={cost} onChange={e=>setCost(e.target.value)} placeholder="15" /></Field>
        <Field label="Selling Price ($)"><input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="29.99" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Profit:</strong> ${result.profit}</p><p><strong>Margin:</strong> {result.margin}%</p><p><strong>Markup:</strong> {result.markup}%</p></div>}
      <p className="hint">Margin = (Price-Cost)/Price. Markup = (Price-Cost)/Cost.</p>
    </div>
  )
}
