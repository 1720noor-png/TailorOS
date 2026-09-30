import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function UmbrellaPolicyCoverageCalculator() {
  const [netWorth, setNetWorth] = useState('')
  const [homeLiability, setHomeLiability] = useState('300000')
  const [autoLiability, setAutoLiability] = useState('300000')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const nw = Number(netWorth), hl = Number(homeLiability), al = Number(autoLiability)
    if (!(nw >= 0)) { setOut(null); return setErr('Enter your net worth as 0 or more.') }
    const baseLiability = Math.max(hl, al)
    const gap = Math.max(0, nw - baseLiability)
    const suggestedUmbrella = Math.ceil(gap / 1000000) * 1000000
    setErr('')
    setOut({ gap: gap.toFixed(0), suggested: Math.max(1000000, suggestedUmbrella) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Your approximate net worth ($)"><input type="number" min="0" value={netWorth} onChange={(e) => setNetWorth(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Home policy liability limit ($)"><input type="number" min="0" value={homeLiability} onChange={(e) => setHomeLiability(e.target.value)} /></Field>
        <Field label="Auto policy liability limit ($)"><input type="number" min="0" value={autoLiability} onChange={(e) => setAutoLiability(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate umbrella coverage needed</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Assets exceeding your base liability limits: <strong>${Number(out.gap).toLocaleString()}</strong><br />Suggested umbrella policy: <strong>${Number(out.suggested).toLocaleString()}</strong> (umbrella policies are typically sold in $1M increments)</p>}
      <Msg kind="status">A common rule of thumb is to insure at least up to your net worth — a licensed agent can tailor this to your risk exposure.</Msg>
    </div>
  )
}
