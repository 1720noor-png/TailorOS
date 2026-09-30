import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function CashOnCashReturnCalculator() {
  const [cashFlow, setCashFlow] = useState('')
  const [invested, setInvested] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const cf = Number(cashFlow), inv = Number(invested)
    if (!(inv > 0)) { setOut(null); return setErr('Enter total cash invested greater than 0.') }
    setErr('')
    setOut(((cf / inv) * 100).toFixed(2))
  }

  return (
    <div>
      <div className="row">
        <Field label="Annual pre-tax cash flow ($)"><input type="number" value={cashFlow} onChange={(e) => setCashFlow(e.target.value)} /></Field>
        <Field label="Total cash invested ($)"><input type="number" min="0" value={invested} onChange={(e) => setInvested(e.target.value)} placeholder="Down payment + closing costs + repairs" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate return</button></div>
      <Msg>{err}</Msg>
      {out !== null && <p className="out" role="status">Cash-on-cash return: <strong>{out}%</strong></p>}
      <Msg kind="status">Measures return on the actual cash you put in, not the full property value.</Msg>
    </div>
  )
}
