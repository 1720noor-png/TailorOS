import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CalorieDeficitWeightLossPlanner() {
  const [currentWt, setCurrentWt] = useState('185')
  const [targetWt, setTargetWt] = useState('165')
  const [tdee, setTdee] = useState('2400')
  const [weeks, setWeeks] = useState('10')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const cw = parseFloat(currentWt), tw = parseFloat(targetWt), t = parseFloat(tdee), w = parseFloat(weeks)
      if (isNaN(cw) || isNaN(tw) || isNaN(t) || isNaN(w) || cw <= tw || t <= 0 || w <= 0) return setErr('Enter valid weight and timeline.')
      setErr('')
      const totalLbsToLose = cw - tw
      const totalCalorieDeficitNeeded = totalLbsToLose * 3500
      const dailyDeficit = totalCalorieDeficitNeeded / (w * 7)
      const targetDailyCalories = t - dailyDeficit
      const lbsPerWeek = totalLbsToLose / w
      setRes({ val: `Target Daily Intake: ${Math.round(targetDailyCalories)} kcal/day (${Math.round(dailyDeficit)} kcal deficit/day for ${lbsPerWeek.toFixed(1)} lbs/wk loss)`, copyText: `Eat ${Math.round(targetDailyCalories)} kcal/day to lose ${totalLbsToLose} lbs in ${w} weeks.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setCurrentWt('185'); setTargetWt('165'); setTdee('2400'); setWeeks('10'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Current Weight (lbs)">
          <input type="number"  value={currentWt} onChange={(e) => setCurrentWt(e.target.value)} placeholder="" />
        </Field>
        <Field label="Target Goal Weight (lbs)">
          <input type="number"  value={targetWt} onChange={(e) => setTargetWt(e.target.value)} placeholder="" />
        </Field>
        <Field label="Daily Maintenance Calories (TDEE)">
          <input type="number"  value={tdee} onChange={(e) => setTdee(e.target.value)} placeholder="" />
        </Field>
        <Field label="Timeline (Weeks)">
          <input type="number"  value={weeks} onChange={(e) => setWeeks(e.target.value)} placeholder="" />
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