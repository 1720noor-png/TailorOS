import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
const modes = { of: ['What is X% of Y?', 'Percent (X)', 'Number (Y)'], is: ['X is what % of Y?', 'X', 'Y'], chg: ['Percent change from X to Y', 'From (X)', 'To (Y)'] }
export default function PercentageCalculator() {
  const [m, setM] = useState('of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const calc = () => {
    const x = parseFloat(a), y = parseFloat(b)
    setOut('')
    if (Number.isNaN(x) || Number.isNaN(y)) return setErr('Enter both numbers.')
    if ((m === 'is' && y === 0) || (m === 'chg' && x === 0)) return setErr('That calculation would divide by zero. Change the number.')
    const r = m === 'of' ? (x / 100) * y : m === 'is' ? (x / y) * 100 : ((y - x) / x) * 100
    setErr(''); setOut(String(+r.toFixed(4)) + (m === 'of' ? '' : '%'))
  }
  const reset = () => { setA(''); setB(''); setOut(''); setErr('') }
  return (
    <div>
      <Field label="Question"><select value={m} onChange={(e) => { setM(e.target.value); setOut(''); setErr('') }}>{Object.entries(modes).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></Field>
      <div className="row">
        <Field label={modes[m][1]}><input type="number" value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label={modes[m][2]}><input type="number" value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Result: <strong>{out}</strong> <CopyBtn text={out} /></p>}
    </div>
  )
}
