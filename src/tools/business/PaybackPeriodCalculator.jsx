import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PaybackPeriodCalculator() {
  const [initialCost, setInitialCost] = useState('50000')
  const [annualCashFlow, setAnnualCashFlow] = useState('14000')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const c = parseFloat(initialCost), f = parseFloat(annualCashFlow)
      if (isNaN(c) || isNaN(f) || c <= 0 || f <= 0) return setErr('Enter valid positive cost and cash flow.')
      setErr('')
      const years = c / f
      const fullYears = Math.floor(years)
      const months = Math.round((years - fullYears) * 12)
      setRes({ val: `Payback Period: ${fullYears} yrs ${months} mos (${years.toFixed(2)} years total)`, copyText: `Payback Period: ${years.toFixed(2)} years (${fullYears} yrs ${months} mos)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setInitialCost('50000'); setAnnualCashFlow('14000'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Initial Investment Cost ($)">
          <input type="number"  value={initialCost} onChange={(e) => setInitialCost(e.target.value)} placeholder="" />
        </Field>
        <Field label="Expected Annual Net Cash Flow ($)">
          <input type="number"  value={annualCashFlow} onChange={(e) => setAnnualCashFlow(e.target.value)} placeholder="" />
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