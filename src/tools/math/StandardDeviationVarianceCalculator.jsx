import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function StandardDeviationVarianceCalculator() {
  const [numbers, setNumbers] = useState('12, 15, 18, 22, 25, 30')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const nums = numbers.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      if (nums.length < 2) return setErr('Enter at least 2 numbers separated by commas.')
      setErr('')
      const n = nums.length
      const mean = nums.reduce((s, v) => s + v, 0) / n
      const variancePop = nums.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n
      const varianceSample = nums.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1)
      const stdDevPop = Math.sqrt(variancePop)
      const stdDevSample = Math.sqrt(varianceSample)
      setRes({ val: `Mean: ${mean.toFixed(2)} | Sample Std Dev: ${stdDevSample.toFixed(2)} | Pop. Std Dev: ${stdDevPop.toFixed(2)} | Sample Variance: ${varianceSample.toFixed(2)}`, copyText: `Mean: ${mean.toFixed(2)}, Sample SD: ${stdDevSample.toFixed(2)}, Pop SD: ${stdDevPop.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setNumbers('12, 15, 18, 22, 25, 30'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Data Set (Comma separated numbers)">
          <input type="text"  value={numbers} onChange={(e) => setNumbers(e.target.value)} placeholder="" />
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