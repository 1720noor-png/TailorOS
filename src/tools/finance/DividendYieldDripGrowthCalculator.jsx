import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DividendYieldDripGrowthCalculator() {
  const [shares, setShares] = useState('500')
  const [price, setPrice] = useState('85')
  const [divPerShare, setDivPerShare] = useState('3.40')
  const [years, setYears] = useState('10')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const s = parseFloat(shares), p = parseFloat(price), d = parseFloat(divPerShare), y = parseFloat(years)
      if (isNaN(s) || isNaN(p) || isNaN(d) || isNaN(y) || s <= 0 || p <= 0 || d < 0 || y <= 0) return setErr('Enter valid positive values.')
      setErr('')
      const initialVal = s * p
      const yieldPct = (d / p) * 100
      let curShares = s
      for (let i = 0; i < y; i++) {
        const annualDiv = curShares * d
        curShares += annualDiv / p
      }
      const finalVal = curShares * p
      setRes({ val: `Dividend Yield: ${yieldPct.toFixed(2)}% | Year ${y} Value: $${Math.round(finalVal).toLocaleString()} (${Math.round(curShares)} shares)`, copyText: `Yield: ${yieldPct.toFixed(2)}%, Annual Div: $${(s*d).toFixed(2)}. Year ${y} DRIP Value: $${Math.round(finalVal)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setShares('500'); setPrice('85'); setDivPerShare('3.40'); setYears('10'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Number of Shares Owned">
          <input type="number"  value={shares} onChange={(e) => setShares(e.target.value)} placeholder="" />
        </Field>
        <Field label="Share Price ($)">
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="" />
        </Field>
        <Field label="Annual Dividend per Share ($)">
          <input type="number" step="0.01" value={divPerShare} onChange={(e) => setDivPerShare(e.target.value)} placeholder="" />
        </Field>
        <Field label="Reinvestment Horizon (Years)">
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