import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function InsuranceCoverageGapCalculator() {
  const [assetValue, setAssetValue] = useState('')
  const [currentCoverage, setCurrentCoverage] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const a = Number(assetValue), c = Number(currentCoverage)
    if (!(a >= 0 && c >= 0)) { setOut(null); return setErr('Enter asset value and current coverage as 0 or more.') }
    const gap = a - c
    setErr('')
    setOut(gap)
  }

  return (
    <div>
      <div className="row">
        <Field label="Total value to insure ($)"><input type="number" min="0" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} placeholder="e.g. home + contents replacement cost" /></Field>
        <Field label="Current policy coverage ($)"><input type="number" min="0" value={currentCoverage} onChange={(e) => setCurrentCoverage(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate gap</button></div>
      <Msg>{err}</Msg>
      {out !== null && (
        out > 0
          ? <p className="out" role="status">You may be underinsured by <strong>${out.toLocaleString()}</strong>.</p>
          : <p className="out" role="status">Your coverage meets or exceeds the value entered (surplus of ${Math.abs(out).toLocaleString()}).</p>
      )}
      <Msg kind="status">A simple gap check — actual adequate coverage also depends on policy exclusions and local rebuild costs.</Msg>
    </div>
  )
}
