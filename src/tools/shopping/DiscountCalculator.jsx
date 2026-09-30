import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function DiscountCalculator() {
  const [p, setP] = useState('')
  const [d, setD] = useState('')
  const [t, setT] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    const price = parseFloat(p), disc = parseFloat(d), tax = t === '' ? 0 : parseFloat(t)
    if (Number.isNaN(price) || price < 0) return setErr('Enter a price of 0 or more.')
    if (Number.isNaN(disc) || disc < 0 || disc > 100) return setErr('Discount must be between 0 and 100.')
    if (Number.isNaN(tax) || tax < 0) return setErr('Tax rate must be 0 or more.')
    const save = (price * disc) / 100, sub = price - save, tx = (sub * tax) / 100
    setErr(''); setOut({ save, sub, tx, total: sub + tx })
  }
  const reset = () => { setP(''); setD(''); setT(''); setOut(null); setErr('') }
  const m = (v) => v.toFixed(2)
  return (
    <div>
      <div className="row">
        <Field label="Original price"><input type="number" min="0" step="0.01" value={p} onChange={(e) => setP(e.target.value)} /></Field>
        <Field label="Discount %"><input type="number" min="0" max="100" step="0.01" value={d} onChange={(e) => setD(e.target.value)} /></Field>
        <Field label="Tax % (optional)"><input type="number" min="0" step="0.01" value={t} onChange={(e) => setT(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <p>You save: <strong>{m(out.save)}</strong></p>
        <p>Price after discount: <strong>{m(out.sub)}</strong></p>
        {out.tx > 0 && <p>Tax: <strong>{m(out.tx)}</strong></p>}
        <p>Final price: <strong>{m(out.total)}</strong></p>
      </div>}
    </div>
  )
}
