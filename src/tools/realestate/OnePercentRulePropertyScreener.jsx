import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function OnePercentRulePropertyScreener() {
  const [price, setPrice] = useState('')
  const [rent, setRent] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const p = Number(price), r = Number(rent)
    if (!(p > 0 && r >= 0)) { setOut(null); return setErr('Enter purchase price greater than 0 and expected monthly rent.') }
    const ratio = (r / p) * 100
    setErr('')
    setOut({ ratio: ratio.toFixed(2), passes: ratio >= 1, target: (p * 0.01).toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Purchase price ($)"><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        <Field label="Expected monthly rent ($)"><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Check 1% rule</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Rent-to-price ratio: <strong>{out.ratio}%</strong><br />
          {out.passes ? <>✅ Passes the 1% rule (needs at least ${out.target}/mo).</> : <>❌ Falls short of the 1% rule — would need at least ${out.target}/mo rent.</>}
        </p>
      )}
      <Msg kind="status">The 1% rule is a rough first-pass screener, not a full investment analysis — always run detailed cash flow numbers too.</Msg>
    </div>
  )
}
