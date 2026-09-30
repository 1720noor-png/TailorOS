import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const LIMITS = {
  '401(k)/403(b)': { base: 23500, catchup: 7500, catchup60: 11250 },
  'IRA': { base: 7000, catchup: 1000, catchup60: 1000 },
  'SIMPLE IRA': { base: 16500, catchup: 3500, catchup60: 5250 },
}

export default function CatchUpContributionCalculator() {
  const [type, setType] = useState('401(k)/403(b)')
  const [age, setAge] = useState('55')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const a = Number(age)
    if (!(a > 0)) { setOut(null); return setErr('Enter your age greater than 0.') }
    const l = LIMITS[type]
    let limit = l.base
    let catchup = 0
    if (a >= 50 && a < 60) catchup = l.catchup
    else if (a >= 60 && a <= 63) catchup = l.catchup60
    else if (a > 63) catchup = l.catchup
    limit += catchup
    setErr('')
    setOut({ limit, catchup, eligible: a >= 50 })
  }

  return (
    <div>
      <div className="row">
        <Field label="Account type"><select value={type} onChange={(e) => setType(e.target.value)}>{Object.keys(LIMITS).map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Your age"><input type="number" min="18" max="100" value={age} onChange={(e) => setAge(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate contribution limit</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Total annual contribution limit: <strong>${out.limit.toLocaleString()}</strong>
          {out.eligible ? <> (includes ${out.catchup.toLocaleString()} catch-up contribution)</> : <> (not yet eligible for catch-up contributions)</>}
        </p>
      )}
      <Msg kind="status">Limits reflect a recent tax year and the SECURE 2.0 enhanced catch-up for ages 60-63 — always confirm current IRS figures.</Msg>
    </div>
  )
}
