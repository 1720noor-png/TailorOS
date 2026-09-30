import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function TipSplitter() {
  const [bill, setBill] = useState('')
  const [tip, setTip] = useState('')
  const [people, setPeople] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const b=parseFloat(bill),t=parseFloat(tip),p=parseInt(people)||1
    if(!b){setErr('Enter bill amount.');return}
    const tipAmt=b*(t||0)/100,total=b+tipAmt,perPerson=total/p
    setResult({tip:tipAmt.toFixed(2),total:total.toFixed(2),perPerson:perPerson.toFixed(2),people:p})
  }
  return (
    <div>
      <div className="row">
        <Field label="Bill ($)"><input type="number" value={bill} onChange={e=>setBill(e.target.value)} placeholder="85.50" /></Field>
        <Field label="Tip (%)"><input type="number" value={tip} onChange={e=>setTip(e.target.value)} placeholder="18" /></Field>
        <Field label="People"><input type="number" value={people} onChange={e=>setPeople(e.target.value)} placeholder="4" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Tip:</strong> ${result.tip}</p><p><strong>Total:</strong> ${result.total}</p><p><strong>Per Person ({result.people}):</strong> ${result.perPerson}</p></div>}
      <p className="hint">Split bills with tip evenly.</p>
    </div>
  )
}
