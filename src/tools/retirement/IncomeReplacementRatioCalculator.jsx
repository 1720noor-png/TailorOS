import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function IncomeReplacementRatioCalculator() {
  const [currentIncome, setCurrentIncome] = useState('')
  const [expectedRetirementIncome, setExpectedRetirementIncome] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(currentIncome), e = Number(expectedRetirementIncome)
    if (!(c > 0 && e >= 0)) { setOut(null); return setErr('Enter current income greater than 0 and expected retirement income of 0 or more.') }
    const ratio = (e / c) * 100
    setErr('')
    setOut(ratio.toFixed(1))
  }

  return (
    <div>
      <div className="row">
        <Field label="Current annual income ($)"><input type="number" min="0" value={currentIncome} onChange={(e) => setCurrentIncome(e.target.value)} /></Field>
        <Field label="Expected annual retirement income ($)"><input type="number" min="0" value={expectedRetirementIncome} onChange={(e) => setExpectedRetirementIncome(e.target.value)} placeholder="Social Security + pension + withdrawals" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate replacement ratio</button></div>
      <Msg>{err}</Msg>
      {out !== null && (
        <p className="out" role="status">
          Income replacement ratio: <strong>{out}%</strong>
          {Number(out) < 70 && <><br /><small>Most guidelines target 70-80% of pre-retirement income — you may be below that range.</small></>}
        </p>
      )}
    </div>
  )
}
