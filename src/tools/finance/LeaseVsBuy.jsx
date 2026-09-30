import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function LeaseVsBuy() {
  const [leaseMonthly, setLeaseMonthly] = useState('')
  const [leaseTerm, setLeaseTerm] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [loanRate, setLoanRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const lm=parseFloat(leaseMonthly)||0,lt=parseInt(leaseTerm)||36,bp=parseFloat(buyPrice)||0,lr=parseFloat(loanRate)/100/12,lnt=parseInt(loanTerm)||60
    if(!lm||!bp){setErr('Enter lease and buy costs.');return}
    const totalLease=lm*lt
    const payment=bp*lr/(1-Math.pow(1+lr,-lnt))
    const totalBuy=payment*lnt
    setResult({totalLease:totalLease.toFixed(2),totalBuy:totalBuy.toFixed(2),monthlyBuy:payment.toFixed(2),cheaper:totalLease<totalBuy?'Lease':'Buy'})
  }
  return (
    <div>
      <div className="row">
        <Field label="Lease Monthly ($)"><input type="number" value={leaseMonthly} onChange={e=>setLeaseMonthly(e.target.value)} placeholder="2000" /></Field>
        <Field label="Lease Term (months)"><input type="number" value={leaseTerm} onChange={e=>setLeaseTerm(e.target.value)} placeholder="36" /></Field>
        <Field label="Buy Price ($)"><input type="number" value={buyPrice} onChange={e=>setBuyPrice(e.target.value)} placeholder="50000" /></Field>
        <Field label="Loan Rate (%)"><input type="number" value={loanRate} onChange={e=>setLoanRate(e.target.value)} placeholder="6" /></Field>
        <Field label="Loan Term (months)"><input type="number" value={loanTerm} onChange={e=>setLoanTerm(e.target.value)} placeholder="60" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Total Lease Cost:</strong> ${result.totalLease}</p><p><strong>Total Buy Cost:</strong> ${result.totalBuy} (monthly: ${result.monthlyBuy})</p><p><strong>Cheaper:</strong> {result.cheaper}</p></div>}
      <p className="hint">Compare total costs of leasing vs buying.</p>
    </div>
  )
}
