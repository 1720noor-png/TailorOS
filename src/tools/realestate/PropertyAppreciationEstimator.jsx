import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function PropertyAppreciationEstimator() {
  const [value, setValue] = useState('')
  const [rate, setRate] = useState('3.5')
  const [years, setYears] = useState('10')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const v = Number(value), r = Number(rate), y = Number(years)
    if (!(v > 0 && y > 0)) { setOut(null); return setErr('Enter a current value and years greater than 0.') }
    const future = v * Math.pow(1 + r / 100, y)
    setErr('')
    setOut({ future: future.toFixed(0), gain: (future - v).toFixed(0) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Current property value ($)"><input type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
        <Field label="Assumed annual appreciation rate (%)"><input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
        <Field label="Years"><input type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Estimate future value</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Estimated value in {years} years: <strong>${Number(out.future).toLocaleString()}</strong> (gain of ${Number(out.gain).toLocaleString()})</p>}
      <Msg kind="status">Real appreciation varies by market and isn't guaranteed — this is a straight-line compounding projection only.</Msg>
    </div>
  )
}
