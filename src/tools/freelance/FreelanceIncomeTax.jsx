import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function FreelanceIncomeTax() {
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState('')
  const [state, setState] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const inc=parseFloat(income)||0,exp=parseFloat(expenses)||0,st=parseFloat(state)||0
    const net=inc-exp,se=net*0.9235*0.153,fed=net*0.22,stTax=net*st/100
    const total=se+fed+stTax,quarterly=total/4
    setResult({net:net.toFixed(2),se:se.toFixed(2),fed:fed.toFixed(2),stTax:stTax.toFixed(2),total:total.toFixed(2),quarterly:quarterly.toFixed(2)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Annual Income ($)"><input type="number" value={income} onChange={e=>setIncome(e.target.value)} placeholder="80000" /></Field>
        <Field label="Business Expenses ($)"><input type="number" value={expenses} onChange={e=>setExpenses(e.target.value)} placeholder="15000" /></Field>
        <Field label="State Tax Rate (%)"><input type="number" value={state} onChange={e=>setState(e.target.value)} placeholder="5" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Net Income:</strong> ${result.net}</p><p>Self-Employment Tax: ${result.se}</p><p>Federal (est 22%): ${result.fed}</p><p>State: ${result.stTax}</p><p><strong>Total Tax:</strong> ${result.total}</p><p><strong>Quarterly Payment:</strong> ${result.quarterly}</p></div>}
      <p className="hint">Rough estimate — consult a tax professional.</p>
    </div>
  )
}
