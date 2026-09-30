import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function EmergencySavingsFundCalculator() {
  const [housing, setHousing] = useState('1600')
  const [utilities, setUtilities] = useState('350')
  const [food, setFood] = useState('600')
  const [other, setOther] = useState('450')
  const [months, setMonths] = useState('6')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const h = parseFloat(housing)||0, u = parseFloat(utilities)||0, f = parseFloat(food)||0, o = parseFloat(other)||0, m = parseFloat(months)||3
      setErr('')
      const monthlyEssential = h + u + f + o
      const totalTarget = monthlyEssential * m
      setRes({ val: `Target Emergency Fund: $${totalTarget.toLocaleString()} (${m} months of $${monthlyEssential.toLocaleString()}/mo essential living cost)`, copyText: `Emergency Fund Target: $${totalTarget} (${m} months @ $${monthlyEssential}/mo)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setHousing('1600'); setUtilities('350'); setFood('600'); setOther('450'); setMonths('6'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Monthly Rent / Mortgage ($)">
          <input type="number"  value={housing} onChange={(e) => setHousing(e.target.value)} placeholder="" />
        </Field>
        <Field label="Monthly Utilities & Bills ($)">
          <input type="number"  value={utilities} onChange={(e) => setUtilities(e.target.value)} placeholder="" />
        </Field>
        <Field label="Monthly Food & Groceries ($)">
          <input type="number"  value={food} onChange={(e) => setFood(e.target.value)} placeholder="" />
        </Field>
        <Field label="Other Essential Expenses ($)">
          <input type="number"  value={other} onChange={(e) => setOther(e.target.value)} placeholder="" />
        </Field>
        <Field label="Desired Safety Buffer (Months)">
          <input type="number"  value={months} onChange={(e) => setMonths(e.target.value)} placeholder="" />
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