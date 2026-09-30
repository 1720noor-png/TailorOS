import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

function benefitAtAge(fullBenefit, fra, claimAge) {
  if (claimAge === fra) return fullBenefit
  if (claimAge < fra) {
    const monthsEarly = (fra - claimAge) * 12
    const reduction = Math.min(monthsEarly, 36) * (5 / 9) / 100 + Math.max(0, monthsEarly - 36) * (5 / 12) / 100
    return fullBenefit * (1 - reduction)
  }
  const monthsLate = (claimAge - fra) * 12
  return fullBenefit * (1 + monthsLate * (2 / 3) / 100)
}

export default function SocialSecurityClaimingAgeComparison() {
  const [fullBenefit, setFullBenefit] = useState('')
  const [fra, setFra] = useState('67')
  const [breakEvenAge, setBreakEvenAge] = useState('80')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const f = Number(fullBenefit), r = Number(fra), be = Number(breakEvenAge)
    if (!(f > 0)) { setOut(null); return setErr('Enter your full retirement age benefit amount.') }
    const ages = [62, 65, r, 70].filter((v, i, arr) => arr.indexOf(v) === i).sort((a, b) => a - b)
    const results = ages.map((age) => {
      const monthly = benefitAtAge(f, r, age)
      const monthsCollecting = (be - age) * 12
      const totalByBreakEven = monthsCollecting > 0 ? monthly * monthsCollecting : 0
      return { age, monthly: monthly.toFixed(0), totalByBreakEven: totalByBreakEven.toFixed(0) }
    })
    setErr('')
    setOut(results)
  }

  return (
    <div>
      <div className="row">
        <Field label="Full retirement age benefit ($/mo)"><input type="number" min="0" value={fullBenefit} onChange={(e) => setFullBenefit(e.target.value)} /></Field>
        <Field label="Your full retirement age"><input type="number" min="65" max="67" value={fra} onChange={(e) => setFra(e.target.value)} /></Field>
        <Field label="Compare total by age"><input type="number" min="63" max="100" value={breakEvenAge} onChange={(e) => setBreakEvenAge(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Compare claiming ages</button></div>
      <Msg>{err}</Msg>
      {out && (
        <div className="out" role="status">
          {out.map((r) => <p key={r.age}>Claim at <strong>{r.age}</strong>: ${r.monthly}/mo — total collected by age {breakEvenAge}: <strong>${Number(r.totalByBreakEven).toLocaleString()}</strong></p>)}
        </div>
      )}
      <Msg kind="status">Total collected depends heavily on how long you live — there's no single "best" age that's right for everyone.</Msg>
    </div>
  )
}
