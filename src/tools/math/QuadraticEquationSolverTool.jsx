import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function QuadraticEquationSolverTool() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('-5')
  const [c, setC] = useState('6')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const va = parseFloat(a), vb = parseFloat(b), vc = parseFloat(c)
      if (isNaN(va) || isNaN(vb) || isNaN(vc) || va === 0) return setErr('Enter valid quadratic coefficients (a ≠ 0).')
      setErr('')
      const disc = vb * vb - 4 * va * vc
      if (disc > 0) {
        const x1 = (-vb + Math.sqrt(disc)) / (2 * va)
        const x2 = (-vb - Math.sqrt(disc)) / (2 * va)
        setRes({ val: `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)} (Discriminant Δ = ${disc})`, copyText: `x1 = ${x1}, x2 = ${x2}` })
      } else if (disc === 0) {
        const x = -vb / (2 * va)
        setRes({ val: `Single Root x = ${x.toFixed(4)} (Discriminant Δ = 0)`, copyText: `x = ${x}` })
      } else {
        const real = (-vb / (2 * va)).toFixed(4)
        const imag = (Math.sqrt(-disc) / (2 * va)).toFixed(4)
        setRes({ val: `Complex Roots: x₁ = ${real} + ${imag}i, x₂ = ${real} - ${imag}i (Δ = ${disc})`, copyText: `x1 = ${real} + ${imag}i, x2 = ${real} - ${imag}i` })
      }
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setA('1'); setB('-5'); setC('6'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Coefficient a">
          <input type="number"  value={a} onChange={(e) => setA(e.target.value)} placeholder="" />
        </Field>
        <Field label="Coefficient b">
          <input type="number"  value={b} onChange={(e) => setB(e.target.value)} placeholder="" />
        </Field>
        <Field label="Coefficient c">
          <input type="number"  value={c} onChange={(e) => setC(e.target.value)} placeholder="" />
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