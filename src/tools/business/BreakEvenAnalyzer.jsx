import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function BreakEvenAnalyzer() {
  const [fixedCosts, setFixedCosts] = useState('')
  const [price, setPrice] = useState('')
  const [varCost, setVarCost] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const fc=parseFloat(fixedCosts),p=parseFloat(price),vc=parseFloat(varCost)
    if(!fc||!p){setErr('Fill required fields.');return}
    if(p<=vc){setErr('Price must exceed variable cost.');return}
    const units=Math.ceil(fc/(p-vc)),revenue=units*p
    setResult({units,revenue:revenue.toFixed(2),margin:((p-vc)/p*100).toFixed(1)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Fixed Costs ($)"><input type="number" value={fixedCosts} onChange={e=>setFixedCosts(e.target.value)} placeholder="50000" /></Field>
        <Field label="Price per Unit ($)"><input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="25" /></Field>
        <Field label="Variable Cost/Unit ($)"><input type="number" value={varCost} onChange={e=>setVarCost(e.target.value)} placeholder="10" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Break-Even:</strong> {result.units} units</p><p><strong>Revenue needed:</strong> ${result.revenue}</p><p><strong>Contribution Margin:</strong> {result.margin}%</p></div>}
      <p className="hint">Units needed to cover all fixed costs.</p>
    </div>
  )
}
