import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function PregnancyDueDate() {
  const [lmp, setLmp] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    if (!lmp) { setErr('Enter date.'); return }
    const start = new Date(lmp)
    const due = new Date(start.getTime() + 280 * 86400000)
    const now = Date.now()
    const weeksPassed = Math.floor((now - start.getTime()) / (7 * 86400000))
    const trimester = weeksPassed < 13 ? '1st' : weeksPassed < 27 ? '2nd' : '3rd'
    setResult({due:due.toLocaleDateString(),weeks:Math.max(0,weeksPassed),trimester})
  }
  return (
    <div>
      <Field label="Last Menstrual Period"><input type="date" value={lmp} onChange={e=>setLmp(e.target.value)} /></Field>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <p><strong>Due Date:</strong> {result.due}</p>
        <p><strong>Current Week:</strong> {result.weeks}</p>
        <p><strong>Trimester:</strong> {result.trimester}</p>
      </div>}
      <p className="hint">Naegele rule: LMP + 280 days. Consult your OB-GYN.</p>
    </div>
  )
}
