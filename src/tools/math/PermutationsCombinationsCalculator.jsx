import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PermutationsCombinationsCalculator() {
  const [nVal, setNVal] = useState('10')
  const [rVal, setRVal] = useState('3')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const n = parseInt(nVal, 10), r = parseInt(rVal, 10)
      if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) return setErr('Enter valid integers where 0 ≤ r ≤ n.')
      setErr('')
      const fact = (num) => { let res = 1n; for (let i = 2n; i <= BigInt(num); i++) res *= i; return res }
      const nFact = fact(n)
      const rFact = fact(r)
      const nMinusRFact = fact(n - r)
      const nPr = nFact / nMinusRFact
      const nCr = nFact / (rFact * nMinusRFact)
      setRes({ val: `Combinations nCr (Order doesn't matter): ${nCr.toLocaleString()} | Permutations nPr (Order matters): ${nPr.toLocaleString()}`, copyText: `nCr: ${nCr}, nPr: ${nPr}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setNVal('10'); setRVal('3'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Total Items (n)">
          <input type="number"  value={nVal} onChange={(e) => setNVal(e.target.value)} placeholder="" />
        </Field>
        <Field label="Items Selected (r)">
          <input type="number"  value={rVal} onChange={(e) => setRVal(e.target.value)} placeholder="" />
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