import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function RunwayCalculator() {
  const [cash, setCash] = useState('')
  const [monthlyBurn, setMonthlyBurn] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const c=parseFloat(cash),b=parseFloat(monthlyBurn),r=parseFloat(monthlyRevenue)||0
    if(!c||!b){setErr('Enter cash and burn rate.');return}
    const netBurn=b-r
    if(netBurn<=0){setResult({months:'∞',msg:'Revenue exceeds burn!'});return}
    const months=Math.floor(c/netBurn)
    setResult({months,netBurn:netBurn.toFixed(2),depleted:new Date(Date.now()+months*30*86400000).toLocaleDateString()})
  }
  return (
    <div>
      <div className="row">
        <Field label="Cash on Hand ($)"><input type="number" value={cash} onChange={e=>setCash(e.target.value)} placeholder="500000" /></Field>
        <Field label="Monthly Burn ($)"><input type="number" value={monthlyBurn} onChange={e=>setMonthlyBurn(e.target.value)} placeholder="40000" /></Field>
        <Field label="Monthly Revenue ($)"><input type="number" value={monthlyRevenue} onChange={e=>setMonthlyRevenue(e.target.value)} placeholder="15000" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Runway:</strong> {result.months} months</p>{result.netBurn&&<p>Net burn: ${result.netBurn}/mo</p>}{result.depleted&&<p>Cash depleted: ~{result.depleted}</p>}{result.msg&&<p>{result.msg}</p>}</div>}
      <p className="hint">How long until cash runs out.</p>
    </div>
  )
}
