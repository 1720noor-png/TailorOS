import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function AttendanceCalculator() {
  const [a, setA] = useState('')
  const [t, setT] = useState('')
  const [g, setG] = useState('75')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const calc = () => {
    setOut('')
    const att = Number(a), tot = Number(t), tg = Number(g)
    if (a === '' || t === '' || !Number.isInteger(att) || !Number.isInteger(tot) || att < 0 || tot <= 0) return setErr('Enter whole numbers: classes attended (0 or more) and total classes (above 0).')
    if (att > tot) return setErr('Classes attended cannot be more than total classes.')
    if (!(tg > 0 && tg <= 100)) return setErr('Target must be above 0 and at most 100.')
    const pct = (att / tot) * 100
    let msg = `Current attendance: ${pct.toFixed(2)}%. `
    if (pct >= tg) msg += `You can miss ${Math.floor((att * 100) / tg - tot + 1e-9)} more class(es) and stay at or above ${tg}%.`
    else if (tg === 100) msg += 'You cannot reach 100% because past absences cannot be undone.'
    else msg += `Attend the next ${Math.ceil((tg * tot - 100 * att) / (100 - tg) - 1e-9)} class(es) in a row to reach ${tg}%.`
    setErr(''); setOut(msg)
  }
  const reset = () => { setA(''); setT(''); setG('75'); setOut(''); setErr('') }
  return (
    <div>
      <div className="row">
        <Field label="Classes attended"><input type="number" min="0" step="1" value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="Total classes held"><input type="number" min="1" step="1" value={t} onChange={(e) => setT(e.target.value)} /></Field>
        <Field label="Target attendance %"><input type="number" min="1" max="100" value={g} onChange={(e) => setG(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>{out && <p className="out" role="status">{out}</p>}
    </div>
  )
}
