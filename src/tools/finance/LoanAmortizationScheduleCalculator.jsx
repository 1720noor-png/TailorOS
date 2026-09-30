import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function LoanAmortizationScheduleCalculator() {
  const [amount, setAmount] = useState('20000')
  const [rate, setRate] = useState('6.5')
  const [years, setYears] = useState('5')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const p = parseFloat(amount), r = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12
      if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) return setErr('Enter valid loan parameters.')
      setErr('')
      const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const totalPaid = monthly * n
      const totalInterest = totalPaid - p
      
      const m1Interest = p * r
      const m1Principal = monthly - m1Interest
      setRes({ val: `Monthly Payment: $${monthly.toFixed(2)} | Total Interest: $${totalInterest.toFixed(2)} | Month 1 Principal: $${m1Principal.toFixed(2)}, Interest: $${m1Interest.toFixed(2)}`, copyText: `Payment: $${monthly.toFixed(2)}/mo. Total Interest: $${totalInterest.toFixed(2)} over ${years} years.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAmount('20000'); setRate('6.5'); setYears('5'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Loan Principal ($)">
          <input type="number"  value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="" />
        </Field>
        <Field label="Annual Interest Rate (%)">
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="" />
        </Field>
        <Field label="Loan Term (Years)">
          <input type="number"  value={years} onChange={(e) => setYears(e.target.value)} placeholder="" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}