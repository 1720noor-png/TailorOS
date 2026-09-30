import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function CapRateCalculator() {
  const [noi, setNoi] = useState('')
  const [price, setPrice] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const n = Number(noi), p = Number(price)
    if (!(p > 0)) { setOut(null); return setErr('Enter a property price/value greater than 0.') }
    setErr('')
    setOut(((n / p) * 100).toFixed(2))
  }

  return (
    <div>
      <div className="row">
        <Field label="Annual Net Operating Income ($)"><input type="number" value={noi} onChange={(e) => setNoi(e.target.value)} /></Field>
        <Field label="Property price / value ($)"><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate cap rate</button></div>
      <Msg>{err}</Msg>
      {out !== null && <p className="out" role="status">Cap rate: <strong>{out}%</strong></p>}
      <Msg kind="status">Net Operating Income = rental income minus operating expenses, before mortgage payments.</Msg>
    </div>
  )
}
