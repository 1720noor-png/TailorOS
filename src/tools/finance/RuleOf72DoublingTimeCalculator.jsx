import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function RuleOf72DoublingTimeCalculator() {
  const [rate, setRate] = useState('7.2')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const r = parseFloat(rate)
      if (isNaN(r) || r <= 0) return setErr('Enter a valid positive return rate.')
      setErr('')
      const approxYears = 72 / r
      const exactYears = Math.log(2) / Math.log(1 + r / 100)
      setRes({ val: `Doubles in approx. ${approxYears.toFixed(1)} years (Exact: ${exactYears.toFixed(2)} years)`, copyText: `At ${r}% return, money doubles in approx ${approxYears.toFixed(1)} years.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setRate('7.2'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Annual Interest Rate / Return (%)">
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="" />
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