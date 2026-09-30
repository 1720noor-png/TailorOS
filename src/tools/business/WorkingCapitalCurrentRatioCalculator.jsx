import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function WorkingCapitalCurrentRatioCalculator() {
  const [assets, setAssets] = useState('180000')
  const [liabilities, setLiabilities] = useState('95000')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const a = parseFloat(assets), l = parseFloat(liabilities)
      if (isNaN(a) || isNaN(l) || a < 0 || l <= 0) return setErr('Enter valid assets and liabilities.')
      setErr('')
      const netWorkingCapital = a - l
      const currentRatio = a / l
      const health = currentRatio >= 2.0 ? 'Strong Liquidity' : currentRatio >= 1.2 ? 'Adequate Liquidity' : 'Low Liquidity Risk'
      setRes({ val: `Working Capital: $${netWorkingCapital.toLocaleString()} | Current Ratio: ${currentRatio.toFixed(2)} (${health})`, copyText: `Working Capital: $${netWorkingCapital}, Current Ratio: ${currentRatio.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAssets('180000'); setLiabilities('95000'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Current Assets ($)">
          <input type="number"  value={assets} onChange={(e) => setAssets(e.target.value)} placeholder="" />
        </Field>
        <Field label="Current Liabilities ($)">
          <input type="number"  value={liabilities} onChange={(e) => setLiabilities(e.target.value)} placeholder="" />
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