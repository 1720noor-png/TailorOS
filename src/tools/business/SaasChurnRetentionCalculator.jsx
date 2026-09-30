import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SaasChurnRetentionCalculator() {
  const [startCust, setStartCust] = useState('1200')
  const [lostCust, setLostCust] = useState('42')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const s = parseFloat(startCust), l = parseFloat(lostCust)
      if (isNaN(s) || isNaN(l) || s <= 0 || l < 0 || l > s) return setErr('Enter valid customer numbers.')
      setErr('')
      const monthlyChurn = (l / s) * 100
      const monthlyRetention = 100 - monthlyChurn
      const annualRetention = Math.pow(monthlyRetention / 100, 12) * 100
      const annualChurn = 100 - annualRetention
      setRes({ val: `Monthly Churn: ${monthlyChurn.toFixed(2)}% | Monthly Retention: ${monthlyRetention.toFixed(2)}% | Est. Annual Churn: ${annualChurn.toFixed(1)}%`, copyText: `Monthly Churn: ${monthlyChurn.toFixed(2)}%, Retention: ${monthlyRetention.toFixed(2)}%` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setStartCust('1200'); setLostCust('42'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Customers at Start of Month">
          <input type="number"  value={startCust} onChange={(e) => setStartCust(e.target.value)} placeholder="" />
        </Field>
        <Field label="Customers Cancelled / Churned">
          <input type="number"  value={lostCust} onChange={(e) => setLostCust(e.target.value)} placeholder="" />
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