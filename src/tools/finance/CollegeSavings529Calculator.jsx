import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CollegeSavings529Calculator() {
  const [childAge, setChildAge] = useState('3')
  const [currentSaved, setCurrentSaved] = useState('5000')
  const [monthlyContrib, setMonthlyContrib] = useState('300')
  const [returnRate, setReturnRate] = useState('6.5')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const age = parseFloat(childAge), saved = parseFloat(currentSaved), m = parseFloat(monthlyContrib), r = parseFloat(returnRate)/100/12
      if (isNaN(age) || isNaN(saved) || isNaN(m) || isNaN(r) || age >= 18 || saved < 0 || m < 0) return setErr('Enter valid age (<18) and savings.')
      setErr('')
      const monthsToCollege = (18 - age) * 12
      let total = saved
      for (let i = 0; i < monthsToCollege; i++) {
        total = (total + m) * (1 + r)
      }
      setRes({ val: `Est. Fund at Age 18: $${Math.round(total).toLocaleString()} (${(18-age)} years of saving)`, copyText: `Est 529 Balance at Age 18: $${Math.round(total)} for child age ${age}.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setChildAge('3'); setCurrentSaved('5000'); setMonthlyContrib('300'); setReturnRate('6.5'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Child Current Age">
          <input type="number"  value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="" />
        </Field>
        <Field label="Current 529 Balance ($)">
          <input type="number"  value={currentSaved} onChange={(e) => setCurrentSaved(e.target.value)} placeholder="" />
        </Field>
        <Field label="Monthly Contribution ($)">
          <input type="number"  value={monthlyContrib} onChange={(e) => setMonthlyContrib(e.target.value)} placeholder="" />
        </Field>
        <Field label="Assumed Return (%)">
          <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} placeholder="" />
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