import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function GrossNetRentalYieldCalculator() {
  const [price, setPrice] = useState('280000')
  const [rent, setRent] = useState('2200')
  const [expenses, setExpenses] = useState('4500')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const p = parseFloat(price), r = parseFloat(rent), e = parseFloat(expenses)
      if (isNaN(p) || isNaN(r) || isNaN(e) || p <= 0 || r <= 0 || e < 0) return setErr('Enter valid price, rent, and expenses.')
      setErr('')
      const annualRent = r * 12
      const grossYield = (annualRent / p) * 100
      const netRent = annualRent - e
      const netYield = (netRent / p) * 100
      setRes({ val: `Gross Yield: ${grossYield.toFixed(2)}% | Net Yield: ${netYield.toFixed(2)}% ($${netRent.toFixed(2)} net income/yr)`, copyText: `Gross Yield: ${grossYield.toFixed(2)}%, Net Yield: ${netYield.toFixed(2)}%` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setPrice('280000'); setRent('2200'); setExpenses('4500'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Property Purchase Price ($)">
          <input type="number"  value={price} onChange={(e) => setPrice(e.target.value)} placeholder="" />
        </Field>
        <Field label="Monthly Rent ($)">
          <input type="number"  value={rent} onChange={(e) => setRent(e.target.value)} placeholder="" />
        </Field>
        <Field label="Annual Operating Expenses ($)">
          <input type="number"  value={expenses} onChange={(e) => setExpenses(e.target.value)} placeholder="" />
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