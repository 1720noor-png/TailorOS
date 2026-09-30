import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function HistoricalPurchasingPowerInflationTool() {
  const [amount, setAmount] = useState('10000')
  const [avgInflation, setAvgInflation] = useState('3.5')
  const [years, setYears] = useState('15')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const a = parseFloat(amount), i = parseFloat(avgInflation)/100, y = parseFloat(years)
      if (isNaN(a) || isNaN(i) || isNaN(y) || a <= 0 || y <= 0) return setErr('Enter valid amount and years.')
      setErr('')
      const futurePower = a / Math.pow(1 + i, y)
      const lostPct = ((a - futurePower) / a) * 100
      setRes({ val: `Future Purchasing Power: $${futurePower.toFixed(2)} (Lost ${lostPct.toFixed(1)}% of value in ${y} years)`, copyText: `$${a} today equals $${futurePower.toFixed(2)} in ${y} years at ${avgInflation}% inflation.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAmount('10000'); setAvgInflation('3.5'); setYears('15'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Initial Cash Amount ($)">
          <input type="number"  value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="" />
        </Field>
        <Field label="Average Annual Inflation (%)">
          <input type="number" step="0.1" value={avgInflation} onChange={(e) => setAvgInflation(e.target.value)} placeholder="" />
        </Field>
        <Field label="Time Span (Years)">
          <input type="number"  value={years} onChange={(e) => setYears(e.target.value)} placeholder="" />
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