import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function CoastFireCalculator() {
  const [current, setCurrent] = useState('')
  const [currentAge, setCurrentAge] = useState('30')
  const [retireAge, setRetireAge] = useState('65')
  const [targetNestEgg, setTargetNestEgg] = useState('')
  const [returnRate, setReturnRate] = useState('7')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(current), ca = Number(currentAge), ra = Number(retireAge), t = Number(targetNestEgg), r = Number(returnRate) / 100
    if (!(c >= 0 && ra > ca && t > 0)) { setOut(null); return setErr('Enter current savings (≥0), a retirement age greater than current age, and a target nest egg greater than 0.') }
    const years = ra - ca
    const projected = c * Math.pow(1 + r, years)
    const coastFireNumber = t / Math.pow(1 + r, years)
    setErr('')
    setOut({ projected: projected.toFixed(0), coastFireNumber: coastFireNumber.toFixed(0), hasCoasted: c >= coastFireNumber })
  }

  return (
    <div>
      <div className="row">
        <Field label="Current retirement savings ($)"><input type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
        <Field label="Current age"><input type="number" min="18" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Target retirement age"><input type="number" min="18" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} /></Field>
        <Field label="Target nest egg at retirement ($)"><input type="number" min="0" value={targetNestEgg} onChange={(e) => setTargetNestEgg(e.target.value)} /></Field>
        <Field label="Assumed annual return (%)"><input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate Coast FIRE number</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Coast FIRE number (needed today to hit your goal with no more contributions): <strong>${Number(out.coastFireNumber).toLocaleString()}</strong><br />
          Your current savings, projected to retirement with no more contributions: <strong>${Number(out.projected).toLocaleString()}</strong><br />
          {out.hasCoasted ? <>🎉 You've already reached Coast FIRE — future contributions are optional to hit this goal.</> : <>You haven't reached Coast FIRE yet based on these numbers.</>}
        </p>
      )}
      <Msg kind="status">"Coast FIRE" means you've saved enough that compound growth alone gets you to your goal, even without saving more.</Msg>
    </div>
  )
}
