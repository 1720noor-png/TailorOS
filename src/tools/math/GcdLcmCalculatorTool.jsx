import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function GcdLcmCalculatorTool() {
  const [n1, setN1] = useState('24')
  const [n2, setN2] = useState('36')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const a = Math.abs(parseInt(n1, 10)), b = Math.abs(parseInt(n2, 10))
      if (isNaN(a) || isNaN(b) || a === 0 || b === 0) return setErr('Enter positive integers.')
      setErr('')
      const getGcd = (x, y) => y === 0 ? x : getGcd(y, x % y)
      const gcd = getGcd(a, b)
      const lcm = (a * b) / gcd
      setRes({ val: `GCD (${a}, ${b}): ${gcd} | LCM (${a}, ${b}): ${lcm}`, copyText: `GCD: ${gcd}, LCM: ${lcm}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setN1('24'); setN2('36'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="First Number">
          <input type="number"  value={n1} onChange={(e) => setN1(e.target.value)} placeholder="" />
        </Field>
        <Field label="Second Number">
          <input type="number"  value={n2} onChange={(e) => setN2(e.target.value)} placeholder="" />
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