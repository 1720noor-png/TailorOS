import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SimpleInterestReturnCalculator() {
  const [principal, setPrincipal] = useState('5000')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('3')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const p = parseFloat(principal), r = parseFloat(rate), t = parseFloat(years)
      if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) return setErr('Enter valid positive values.')
      setErr('')
      const interest = (p * r * t) / 100
      const total = p + interest
      setRes({ val: `Total Interest: $${interest.toFixed(2)} | Final Total: $${total.toFixed(2)}`, copyText: `Principal: $${p}, Interest: $${interest.toFixed(2)}, Total: $${total.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setPrincipal('5000'); setRate('5'); setYears('3'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Principal Amount ($)">
          <input type="number"  value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="" />
        </Field>
        <Field label="Annual Interest Rate (%)">
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="" />
        </Field>
        <Field label="Time Period (Years)">
          <input type="number" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} placeholder="" />
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