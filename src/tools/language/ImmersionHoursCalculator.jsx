import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// rough hour targets by CEFR-like milestone (self-study immersion, not a guarantee)
const MILESTONES = { 'Conversational basics': 300, 'Comfortable daily conversation': 600, 'Working fluency': 1200, 'Advanced fluency': 2200 }

export default function ImmersionHoursCalculator() {
  const [current, setCurrent] = useState('0')
  const [perWeek, setPerWeek] = useState('7')
  const [goal, setGoal] = useState('Comfortable daily conversation')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const c = Number(current), w = Number(perWeek)
    if (!(c >= 0 && w > 0)) { setOut(null); return setErr('Enter current hours (≥0) and weekly hours greater than 0.') }
    const target = MILESTONES[goal]
    const remaining = Math.max(0, target - c)
    const weeks = Math.ceil(remaining / w)
    setErr('')
    setOut({ remaining, weeks, months: (weeks / 4.33).toFixed(1) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Immersion hours so far"><input type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
        <Field label="Hours you can do per week"><input type="number" min="0.5" step="0.5" value={perWeek} onChange={(e) => setPerWeek(e.target.value)} /></Field>
        <Field label="Milestone goal"><select value={goal} onChange={(e) => setGoal(e.target.value)}>{Object.keys(MILESTONES).map((m) => <option key={m}>{m}</option>)}</select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate time to goal</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">{out.remaining === 0 ? "You've already reached this milestone's hour target." : <>About <strong>{out.remaining} hours</strong> left — roughly <strong>{out.weeks} weeks</strong> ({out.months} months) at your current pace.</>}</p>}
      <Msg kind="status">Hour targets are rough community estimates for self-study immersion, not a guarantee — actual progress depends heavily on method and the language pair.</Msg>
    </div>
  )
}
