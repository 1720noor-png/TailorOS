import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function MeetingCostPerMinuteCalculator() {
  const [attendees, setAttendees] = useState('8')
  const [avgSalary, setAvgSalary] = useState('95000')
  const [durationMins, setDurationMins] = useState('60')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const n = parseFloat(attendees), sal = parseFloat(avgSalary), m = parseFloat(durationMins)
      if (isNaN(n) || isNaN(sal) || isNaN(m) || n <= 0 || sal <= 0 || m <= 0) return setErr('Enter valid meeting parameters.')
      setErr('')
      const hourlyPerPerson = sal / 2080
      const meetingCost = n * hourlyPerPerson * (m / 60)
      const costPerMin = meetingCost / m
      setRes({ val: `Total Meeting Cost: $${meetingCost.toFixed(2)} ($${costPerMin.toFixed(2)} / minute)`, copyText: `Meeting Cost: $${meetingCost.toFixed(2)} for ${n} people over ${m} mins.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAttendees('8'); setAvgSalary('95000'); setDurationMins('60'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Number of Attendees">
          <input type="number"  value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="" />
        </Field>
        <Field label="Average Annual Salary ($)">
          <input type="number"  value={avgSalary} onChange={(e) => setAvgSalary(e.target.value)} placeholder="" />
        </Field>
        <Field label="Meeting Duration (Minutes)">
          <input type="number"  value={durationMins} onChange={(e) => setDurationMins(e.target.value)} placeholder="" />
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