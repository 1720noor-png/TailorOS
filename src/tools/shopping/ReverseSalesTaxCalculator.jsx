import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function ReverseSalesTaxCalculator() {
  const [total, setTotal] = useState('')
  const [rate, setRate] = useState('8')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    const t = parseFloat(total), r = parseFloat(rate)
    if (isNaN(t) || isNaN(r) || t <= 0 || r < 0) return setErr('Enter valid positive total and tax rate.')
    setErr('')
    const preTax = t / (1 + r / 100)
    const taxAmt = t - preTax
    setRes({ preTax: preTax.toFixed(2), taxAmt: taxAmt.toFixed(2), total: t.toFixed(2) })
  }

  const reset = () => { setTotal(''); setRate('8'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        <Field label="Total Receipt Price ($)"><input type="number" step="0.01" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="e.g. 108.00" /></Field>
        <Field label="Tax Rate (%)"><input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 8" /></Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Extract Tax</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          <p>Pre-Tax Base Price: <strong>${res.preTax}</strong></p>
          <p>Sales Tax Amount: <strong>${res.taxAmt}</strong></p>
          <p>Total Paid: <strong>${res.total}</strong></p>
          <CopyBtn text={`Pre-tax: \$${res.preTax}, Tax (${rate}%): \$${res.taxAmt}, Total: \$${res.total}`} />
        </div>
      )}
    </div>
  )
}