import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DiscountedCashFlowDcfValuationTool() {
  const [fcf, setFcf] = useState('500000')
  const [growthRate, setGrowthRate] = useState('10')
  const [termRate, setTermRate] = useState('2.5')
  const [wacc, setWacc] = useState('8.5')
  const [shares, setShares] = useState('100000')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const f = parseFloat(fcf), g = parseFloat(growthRate)/100, t = parseFloat(termRate)/100, r = parseFloat(wacc)/100, sh = parseFloat(shares)
      if (isNaN(f) || isNaN(g) || isNaN(t) || isNaN(r) || isNaN(sh) || f <= 0 || r <= t || sh <= 0) return setErr('Enter valid positive values (WACC > Terminal Rate).')
      setErr('')
      let pvSum = 0
      let cf = f
      for (let i = 1; i <= 5; i++) {
        cf *= (1 + g)
        pvSum += cf / Math.pow(1 + r, i)
      }
      const terminalVal = (cf * (1 + t)) / (r - t)
      const pvTerminal = terminalVal / Math.pow(1 + r, 5)
      const enterpriseVal = pvSum + pvTerminal
      const perShare = enterpriseVal / sh
      setRes({ val: `Intrinsic Value: $${perShare.toFixed(2)} / share (Total Enterprise Value: $${Math.round(enterpriseVal).toLocaleString()})`, copyText: `Fair Value: $${perShare.toFixed(2)}/share, EV: $${Math.round(enterpriseVal)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setFcf('500000'); setGrowthRate('10'); setTermRate('2.5'); setWacc('8.5'); setShares('100000'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Current Free Cash Flow ($)">
          <input type="number"  value={fcf} onChange={(e) => setFcf(e.target.value)} placeholder="" />
        </Field>
        <Field label="Expected Growth Rate Yr 1-5 (%)">
          <input type="number" step="0.1" value={growthRate} onChange={(e) => setGrowthRate(e.target.value)} placeholder="" />
        </Field>
        <Field label="Terminal Growth Rate (%)">
          <input type="number" step="0.1" value={termRate} onChange={(e) => setTermRate(e.target.value)} placeholder="" />
        </Field>
        <Field label="Discount Rate / WACC (%)">
          <input type="number" step="0.1" value={wacc} onChange={(e) => setWacc(e.target.value)} placeholder="" />
        </Field>
        <Field label="Shares Outstanding">
          <input type="number"  value={shares} onChange={(e) => setShares(e.target.value)} placeholder="" />
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