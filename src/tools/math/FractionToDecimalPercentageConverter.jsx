import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function FractionToDecimalPercentageConverter() {
  const [num, setNum] = useState('3')
  const [den, setDen] = useState('8')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const n = parseFloat(num), d = parseFloat(den)
      if (isNaN(n) || isNaN(d) || d === 0) return setErr('Enter valid numerator and non-zero denominator.')
      setErr('')
      const decimal = n / d
      const pct = decimal * 100
      const getGcd = (x, y) => y === 0 ? x : getGcd(y, x % y)
      const gcd = getGcd(Math.abs(n), Math.abs(d))
      const simpNum = n / gcd, simpDen = d / gcd
      setRes({ val: `Decimal: ${decimal.toFixed(6)} | Percentage: ${pct.toFixed(2)}% | Simplified: ${simpNum}/${simpDen}`, copyText: `${n}/${d} = ${decimal.toFixed(4)} (${pct.toFixed(2)}%)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setNum('3'); setDen('8'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Numerator">
          <input type="number"  value={num} onChange={(e) => setNum(e.target.value)} placeholder="" />
        </Field>
        <Field label="Denominator">
          <input type="number"  value={den} onChange={(e) => setDen(e.target.value)} placeholder="" />
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