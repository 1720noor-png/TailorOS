import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function HomeEquityCalculator() {
  const [value, setValue] = useState('')
  const [balance, setBalance] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const v = Number(value), b = Number(balance)
    if (!(v > 0 && b >= 0)) { setOut(null); return setErr('Enter home value greater than 0 and loan balance of 0 or more.') }
    const equity = v - b
    const pct = (equity / v) * 100
    const maxBorrow80 = Math.max(0, v * 0.8 - b)
    setErr('')
    setOut({ equity: equity.toFixed(0), pct: pct.toFixed(1), maxBorrow80: maxBorrow80.toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Current home value ($)"><input type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
        <Field label="Remaining mortgage balance ($)"><input type="number" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate equity</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Home equity: <strong>${Number(out.equity).toLocaleString()}</strong> ({out.pct}% of value)<br />Potential borrowing room at 80% loan-to-value: <strong>${Number(out.maxBorrow80).toLocaleString()}</strong></p>}
    </div>
  )
}
