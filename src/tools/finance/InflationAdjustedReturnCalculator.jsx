import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function InflationAdjustedReturnCalculator() {
  const [nominalReturn, setNominalReturn] = useState('9.5')
  const [inflationRate, setInflationRate] = useState('3.2')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const n = parseFloat(nominalReturn) / 100, i = parseFloat(inflationRate) / 100
      if (isNaN(n) || isNaN(i)) return setErr('Enter valid percentage rates.')
      setErr('')
      const realReturn = ((1 + n) / (1 + i) - 1) * 100
      setRes({ val: `Real Purchasing Power Return: ${realReturn.toFixed(2)}%`, copyText: `Nominal: ${nominalReturn}%, Inflation: ${inflationRate}%, Real Return: ${realReturn.toFixed(2)}%` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setNominalReturn('9.5'); setInflationRate('3.2'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Nominal Investment Return (%)">
          <input type="number" step="0.1" value={nominalReturn} onChange={(e) => setNominalReturn(e.target.value)} placeholder="" />
        </Field>
        <Field label="Annual Inflation Rate (%)">
          <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} placeholder="" />
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