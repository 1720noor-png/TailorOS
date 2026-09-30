import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SalaryToHourlyWageConverter() {
  const [salary, setSalary] = useState('75000')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const s = parseFloat(salary), h = parseFloat(hoursPerWeek)
      if (isNaN(s) || isNaN(h) || s <= 0 || h <= 0) return setErr('Enter valid salary and hours.')
      setErr('')
      const hourly = s / (h * 52)
      const daily = hourly * (h / 5)
      const weekly = s / 52
      const monthly = s / 12
      setRes({ val: `Hourly: $${hourly.toFixed(2)}/hr | Daily: $${daily.toFixed(2)}/day | Weekly: $${weekly.toFixed(2)} | Monthly: $${monthly.toFixed(2)}`, copyText: `Salary: $${s}/yr = $${hourly.toFixed(2)}/hr ($${monthly.toFixed(2)}/mo)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setSalary('75000'); setHoursPerWeek('40'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Annual Base Salary ($)">
          <input type="number"  value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="" />
        </Field>
        <Field label="Work Hours per Week">
          <input type="number"  value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="" />
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