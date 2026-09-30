import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function ClosingCostEstimator() {
  const [price, setPrice] = useState('')
  const [pctLow, setPctLow] = useState('2')
  const [pctHigh, setPctHigh] = useState('5')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const p = Number(price)
    if (!(p > 0)) { setOut(null); return setErr('Enter a home purchase price greater than 0.') }
    setErr('')
    setOut({ low: (p * Number(pctLow) / 100).toFixed(0), high: (p * Number(pctHigh) / 100).toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Home purchase price ($)"><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        <Field label="Low estimate (%)"><input type="number" min="0" step="0.1" value={pctLow} onChange={(e) => setPctLow(e.target.value)} /></Field>
        <Field label="High estimate (%)"><input type="number" min="0" step="0.1" value={pctHigh} onChange={(e) => setPctHigh(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate closing costs</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Estimated closing costs: <strong>${Number(out.low).toLocaleString()} – ${Number(out.high).toLocaleString()}</strong></p>}
      <Msg kind="status">Closing costs typically run 2-5% of the purchase price and include lender fees, title insurance, appraisal, and recording fees — get an actual Loan Estimate for precise figures.</Msg>
    </div>
  )
}
