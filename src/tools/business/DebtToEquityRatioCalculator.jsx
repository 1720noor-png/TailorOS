import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DebtToEquityRatioCalculator() {
  const [totalDebt, setTotalDebt] = useState('450000')
  const [totalEquity, setTotalEquity] = useState('300000')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const d = parseFloat(totalDebt), e = parseFloat(totalEquity)
      if (isNaN(d) || isNaN(e) || d < 0 || e <= 0) return setErr('Enter valid debt and equity.')
      setErr('')
      const deRatio = d / e
      const dePct = deRatio * 100
      setRes({ val: `D/E Ratio: ${deRatio.toFixed(2)} (${dePct.toFixed(1)}% debt leverage)`, copyText: `Debt to Equity Ratio: ${deRatio.toFixed(2)} (${dePct.toFixed(1)}%)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setTotalDebt('450000'); setTotalEquity('300000'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Total Liabilities / Debt ($)">
          <input type="number"  value={totalDebt} onChange={(e) => setTotalDebt(e.target.value)} placeholder="" />
        </Field>
        <Field label="Total Shareholder Equity ($)">
          <input type="number"  value={totalEquity} onChange={(e) => setTotalEquity(e.target.value)} placeholder="" />
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