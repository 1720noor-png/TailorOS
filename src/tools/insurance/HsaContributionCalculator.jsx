import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const LIMITS = { 'Self-only': 4300, 'Family': 8550 }

export default function HsaContributionCalculator() {
  const [coverage, setCoverage] = useState('Self-only')
  const [contributed, setContributed] = useState('')
  const [age55, setAge55] = useState(false)
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(contributed)
    if (!(c >= 0)) { setOut(null); return setErr('Enter your contributions so far as 0 or more.') }
    const limit = LIMITS[coverage] + (age55 ? 1000 : 0)
    const remaining = Math.max(0, limit - c)
    setErr('')
    setOut({ limit, remaining, over: c > limit ? (c - limit).toFixed(0) : null })
  }

  return (
    <div>
      <div className="row">
        <Field label="Coverage type"><select value={coverage} onChange={(e) => setCoverage(e.target.value)}><option>Self-only</option><option>Family</option></select></Field>
        <Field label="Contributed so far this year ($)"><input type="number" min="0" value={contributed} onChange={(e) => setContributed(e.target.value)} /></Field>
        <Field label="Age 55+"><input type="checkbox" checked={age55} onChange={(e) => setAge55(e.target.checked)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate remaining room</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Annual limit: <strong>${out.limit.toLocaleString()}</strong><br />
          {out.over ? <>You're over the limit by ${out.over} — talk to your HSA custodian about a corrective withdrawal.</> : <>Remaining contribution room: <strong>${out.remaining.toLocaleString()}</strong></>}
        </p>
      )}
      <Msg kind="status">Limits shown reflect a recent tax year — always confirm the current year's IRS limits.</Msg>
    </div>
  )
}
