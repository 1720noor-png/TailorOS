import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CustomerLifetimeValueLtvCalculator() {
  const [arpu, setArpu] = useState('49')
  const [margin, setMargin] = useState('80')
  const [churnRate, setChurnRate] = useState('3.5')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const a = parseFloat(arpu), m = parseFloat(margin), c = parseFloat(churnRate)
      if (isNaN(a) || isNaN(m) || isNaN(c) || a <= 0 || m <= 0 || c <= 0) return setErr('Enter valid positive metrics.')
      setErr('')
      const lifespanMonths = 100 / c
      const ltv = (a * (m / 100)) * lifespanMonths
      setRes({ val: `LTV: $${ltv.toFixed(2)} | Avg Customer Lifespan: ${lifespanMonths.toFixed(1)} months`, copyText: `Customer LTV: $${ltv.toFixed(2)} (Lifespan: ${lifespanMonths.toFixed(1)} mos at ${c}% churn)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setArpu('49'); setMargin('80'); setChurnRate('3.5'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Average Revenue per User / Month ($)">
          <input type="number"  value={arpu} onChange={(e) => setArpu(e.target.value)} placeholder="" />
        </Field>
        <Field label="Gross Margin (%)">
          <input type="number"  value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="" />
        </Field>
        <Field label="Monthly Churn Rate (%)">
          <input type="number" step="0.1" value={churnRate} onChange={(e) => setChurnRate(e.target.value)} placeholder="" />
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