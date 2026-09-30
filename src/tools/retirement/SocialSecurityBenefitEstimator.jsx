import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function SocialSecurityBenefitEstimator() {
  const [fullBenefit, setFullBenefit] = useState('')
  const [claimAge, setClaimAge] = useState('67')
  const [fra, setFra] = useState('67')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const f = Number(fullBenefit), c = Number(claimAge), r = Number(fra)
    if (!(f > 0 && c >= 62 && c <= 70)) { setOut(null); return setErr('Enter your full retirement age benefit and a claiming age between 62 and 70.') }
    let adjusted
    if (c === r) adjusted = f
    else if (c < r) {
      const monthsEarly = (r - c) * 12
      const reduction = Math.min(monthsEarly, 36) * (5 / 9) / 100 + Math.max(0, monthsEarly - 36) * (5 / 12) / 100
      adjusted = f * (1 - reduction)
    } else {
      const monthsLate = (c - r) * 12
      adjusted = f * (1 + monthsLate * (2 / 3) / 100)
    }
    setErr('')
    setOut({ adjusted: adjusted.toFixed(0), pctOfFull: ((adjusted / f) * 100).toFixed(1) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Estimated monthly benefit at full retirement age ($)"><input type="number" min="0" value={fullBenefit} onChange={(e) => setFullBenefit(e.target.value)} /></Field>
        <Field label="Your full retirement age"><input type="number" min="65" max="67" step="1" value={fra} onChange={(e) => setFra(e.target.value)} /></Field>
        <Field label="Age you plan to claim"><input type="number" min="62" max="70" value={claimAge} onChange={(e) => setClaimAge(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate adjusted benefit</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Estimated monthly benefit at age {claimAge}: <strong>${Number(out.adjusted).toLocaleString()}</strong> ({out.pctOfFull}% of your full benefit)</p>}
      <Msg kind="status">Uses the standard SSA early/delayed retirement adjustment formulas — get your actual estimate from ssa.gov for precise figures.</Msg>
    </div>
  )
}
