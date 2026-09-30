import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function SalaryToHourly() {
  const [salary, setSalary] = useState('')
  const [hoursWeek, setHoursWeek] = useState('')
  const [weeksYear, setWeeksYear] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const s=parseFloat(salary),h=parseFloat(hoursWeek)||40,w=parseFloat(weeksYear)||52
    if(!s){setErr('Enter salary.');return}
    const hourly=s/(h*w),daily=hourly*h/5,monthly=s/12
    setResult({hourly:hourly.toFixed(2),daily:daily.toFixed(2),weekly:(hourly*h).toFixed(2),monthly:monthly.toFixed(2)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Annual Salary ($)"><input type="number" value={salary} onChange={e=>setSalary(e.target.value)} placeholder="60000" /></Field>
        <Field label="Hours/Week"><input type="number" value={hoursWeek} onChange={e=>setHoursWeek(e.target.value)} placeholder="40" /></Field>
        <Field label="Weeks/Year"><input type="number" value={weeksYear} onChange={e=>setWeeksYear(e.target.value)} placeholder="52" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Hourly:</strong> ${result.hourly}</p><p><strong>Daily:</strong> ${result.daily}</p><p><strong>Weekly:</strong> ${result.weekly}</p><p><strong>Monthly:</strong> ${result.monthly}</p></div>}
      <p className="hint">Based on standard work schedule.</p>
    </div>
  )
}
