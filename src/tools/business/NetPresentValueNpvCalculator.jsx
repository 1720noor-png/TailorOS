import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function NetPresentValueNpvCalculator() {
  const [discountRate, setDiscountRate] = useState('8')
  const [initialOutlay, setInitialOutlay] = useState('100000')
  const [cf1, setCf1] = useState('30000')
  const [cf2, setCf2] = useState('35000')
  const [cf3, setCf3] = useState('40000')
  const [cf4, setCf4] = useState('45000')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const r = parseFloat(discountRate) / 100, io = parseFloat(initialOutlay)
      const c1 = parseFloat(cf1), c2 = parseFloat(cf2), c3 = parseFloat(cf3), c4 = parseFloat(cf4)
      if (isNaN(r) || isNaN(io) || r < 0 || io <= 0) return setErr('Enter valid discount rate and initial outlay.')
      setErr('')
      const npv = -io + (c1 / Math.pow(1 + r, 1)) + (c2 / Math.pow(1 + r, 2)) + (c3 / Math.pow(1 + r, 3)) + (c4 / Math.pow(1 + r, 4))
      const status = npv > 0 ? 'Accept Project (Positive NPV)' : 'Reject Project (Negative NPV)'
      setRes({ val: `NPV: $${npv.toFixed(2)} (${status})`, copyText: `NPV: $${npv.toFixed(2)} at ${discountRate}% discount rate. ${status}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setDiscountRate('8'); setInitialOutlay('100000'); setCf1('30000'); setCf2('35000'); setCf3('40000'); setCf4('45000'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Discount Rate / Cost of Capital (%)">
          <input type="number" step="0.1" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} placeholder="" />
        </Field>
        <Field label="Initial Outlay Year 0 ($)">
          <input type="number"  value={initialOutlay} onChange={(e) => setInitialOutlay(e.target.value)} placeholder="" />
        </Field>
        <Field label="Cash Flow Year 1 ($)">
          <input type="number"  value={cf1} onChange={(e) => setCf1(e.target.value)} placeholder="" />
        </Field>
        <Field label="Cash Flow Year 2 ($)">
          <input type="number"  value={cf2} onChange={(e) => setCf2(e.target.value)} placeholder="" />
        </Field>
        <Field label="Cash Flow Year 3 ($)">
          <input type="number"  value={cf3} onChange={(e) => setCf3(e.target.value)} placeholder="" />
        </Field>
        <Field label="Cash Flow Year 4 ($)">
          <input type="number"  value={cf4} onChange={(e) => setCf4(e.target.value)} placeholder="" />
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