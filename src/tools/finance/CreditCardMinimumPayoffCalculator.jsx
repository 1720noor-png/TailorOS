import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CreditCardMinimumPayoffCalculator() {
  const [balance, setBalance] = useState('5000')
  const [apr, setApr] = useState('21.9')
  const [fixedPayment, setFixedPayment] = useState('200')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const b = parseFloat(balance), r = parseFloat(apr) / 100 / 12, p = parseFloat(fixedPayment)
      if (isNaN(b) || isNaN(r) || isNaN(p) || b <= 0 || r <= 0 || p <= 0) return setErr('Enter valid card balance and payment.')
      const minPaymentNeeded = b * r
      if (p <= minPaymentNeeded) return setErr(`Monthly payment must be greater than monthly interest ($${minPaymentNeeded.toFixed(2)}).`)
      setErr('')
      
      const months = Math.ceil(-Math.log(1 - (b * r) / p) / Math.log(1 + r))
      const totalPaid = months * p
      const interest = totalPaid - b
      const years = (months / 12).toFixed(1)
      setRes({ val: `Paid off in ${months} months (${years} yrs) | Total Interest Paid: $${interest.toFixed(2)}`, copyText: `Balance: $${b}, Payment: $${p}/mo. Paid in ${months} mos. Interest: $${interest.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setBalance('5000'); setApr('21.9'); setFixedPayment('200'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Credit Card Balance ($)">
          <input type="number"  value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="" />
        </Field>
        <Field label="Card APR (%)">
          <input type="number" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} placeholder="" />
        </Field>
        <Field label="Fixed Monthly Payment ($)">
          <input type="number"  value={fixedPayment} onChange={(e) => setFixedPayment(e.target.value)} placeholder="" />
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