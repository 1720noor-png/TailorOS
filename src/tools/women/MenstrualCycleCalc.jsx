import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function MenstrualCycleCalc() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [periodLength, setPeriodLength] = useState('5')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    if (!lastPeriod) { setErr('Enter last period date.'); return }
    const start = new Date(lastPeriod)
    const cl = parseInt(cycleLength) || 28, pl = parseInt(periodLength) || 5
    const nextPeriod = new Date(start.getTime() + cl * 86400000)
    const ovulation = new Date(start.getTime() + (cl - 14) * 86400000)
    const fertileStart = new Date(ovulation.getTime() - 5 * 86400000)
    const fertileEnd = new Date(ovulation.getTime() + 1 * 86400000)
    setResult({nextPeriod:nextPeriod.toLocaleDateString(),ovulation:ovulation.toLocaleDateString(),fertileStart:fertileStart.toLocaleDateString(),fertileEnd:fertileEnd.toLocaleDateString()})
  }
  return (
    <div>
      <div className="row">
        <Field label="Last Period Start"><input type="date" value={lastPeriod} onChange={e=>setLastPeriod(e.target.value)} /></Field>
        <Field label="Cycle Length (days)"><input type="number" value={cycleLength} onChange={e=>setCycleLength(e.target.value)} /></Field>
        <Field label="Period Length (days)"><input type="number" value={periodLength} onChange={e=>setPeriodLength(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <p><strong>Next Period:</strong> {result.nextPeriod}</p>
        <p><strong>Estimated Ovulation:</strong> {result.ovulation}</p>
        <p><strong>Fertile Window:</strong> {result.fertileStart} — {result.fertileEnd}</p>
      </div>}
      <p className="hint">Estimates based on average cycle. Consult your doctor for medical advice.</p>
    </div>
  )
}
