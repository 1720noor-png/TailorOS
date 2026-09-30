import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function EmployerMatchCalculator() {
  const [salary, setSalary] = useState('')
  const [yourPct, setYourPct] = useState('6')
  const [matchPct, setMatchPct] = useState('50')
  const [matchLimit, setMatchLimit] = useState('6')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const s = Number(salary), yp = Number(yourPct), mp = Number(matchPct), ml = Number(matchLimit)
    if (!(s > 0 && yp >= 0 && mp >= 0 && ml >= 0)) { setOut(null); return setErr('Enter salary and percentages of 0 or more.') }
    const yourContribution = s * (yp / 100)
    const matchedPct = Math.min(yp, ml)
    const employerMatch = s * (matchedPct / 100) * (mp / 100)
    const leftOnTable = yp < ml ? s * ((ml - yp) / 100) * (mp / 100) : 0
    setErr('')
    setOut({ yourContribution: yourContribution.toFixed(0), employerMatch: employerMatch.toFixed(0), leftOnTable: leftOnTable.toFixed(0), total: (yourContribution + employerMatch).toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Annual salary ($)"><input type="number" min="0" value={salary} onChange={(e) => setSalary(e.target.value)} /></Field>
        <Field label="Your contribution (% of salary)"><input type="number" min="0" step="0.1" value={yourPct} onChange={(e) => setYourPct(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Employer match rate (%)"><input type="number" min="0" value={matchPct} onChange={(e) => setMatchPct(e.target.value)} placeholder="e.g. 50 for 50 cents/dollar" /></Field>
        <Field label="Match applies up to (% of salary)"><input type="number" min="0" value={matchLimit} onChange={(e) => setMatchLimit(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate match</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Your annual contribution: <strong>${Number(out.yourContribution).toLocaleString()}</strong><br />
          Employer match: <strong>${Number(out.employerMatch).toLocaleString()}</strong><br />
          Total going into your 401(k): <strong>${Number(out.total).toLocaleString()}</strong>
          {Number(out.leftOnTable) > 0 && <><br /><strong style={{ color: 'var(--danger, #c0392b)' }}>You're leaving ${Number(out.leftOnTable).toLocaleString()}/year of free match on the table.</strong></>}
        </p>
      )}
    </div>
  )
}
