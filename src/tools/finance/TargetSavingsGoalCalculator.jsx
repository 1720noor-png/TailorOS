import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function TargetSavingsGoalCalculator() {
  const [target, setTarget] = useState('10000')
  const [current, setCurrent] = useState('1500')
  const [months, setMonths] = useState('18')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const tgt = parseFloat(target), cur = parseFloat(current), m = parseFloat(months)
      if (isNaN(tgt) || isNaN(cur) || isNaN(m) || tgt <= 0 || m <= 0 || cur >= tgt) return setErr('Enter valid target and duration.')
      setErr('')
      const needed = tgt - cur
      const monthly = needed / m
      const weekly = monthly / 4.33
      setRes({ val: `$${monthly.toFixed(2)} / month ($${weekly.toFixed(2)} / week)`, copyText: `To reach $${tgt} from $${cur} in ${m} months, save $${monthly.toFixed(2)}/mo.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setTarget('10000'); setCurrent('1500'); setMonths('18'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Target Goal Amount ($)">
          <input type="number"  value={target} onChange={(e) => setTarget(e.target.value)} placeholder="" />
        </Field>
        <Field label="Current Savings ($)">
          <input type="number"  value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="" />
        </Field>
        <Field label="Time Horizon (Months)">
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