import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let n = 0
const blank = () => ({ id: ++n, task: '', freqDays: '7' })

export default function CleaningScheduleRotator() {
  const [tasks, setTasks] = useState([
    { ...blank(), task: 'Vacuum living areas', freqDays: '7' },
    { ...blank(), task: 'Clean bathrooms', freqDays: '7' },
    { ...blank(), task: 'Dust surfaces', freqDays: '14' },
    { ...blank(), task: 'Mop floors', freqDays: '7' },
  ])
  const [startDay, setStartDay] = useState('Sunday')
  const upd = (id, k, v) => setTasks((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const startIdx = DAYS.indexOf(startDay)
  const schedule = DAYS.map((_, offset) => {
    const dayIdx = (startIdx + offset) % 7
    const due = tasks.filter((t) => Number(t.freqDays) > 0 && offset % Number(t.freqDays) === 0)
    return { day: DAYS[dayIdx], due }
  })

  return (
    <div>
      {tasks.map((t, i) => (
        <div className="row" key={t.id}>
          <Field label={`Task ${i + 1}`}><input value={t.task} onChange={(e) => upd(t.id, 'task', e.target.value)} /></Field>
          <Field label="Every N days"><input type="number" min="1" value={t.freqDays} onChange={(e) => upd(t.id, 'freqDays', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setTasks((x) => (x.length > 1 ? x.filter((y) => y.id !== t.id) : x))} aria-label={`Remove task ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="row">
        <Field label="Start day"><select value={startDay} onChange={(e) => setStartDay(e.target.value)}>{DAYS.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <button className="btn ghost" onClick={() => setTasks((t) => [...t, blank()])}>Add task</button>
      </div>
      <div className="out" role="status">
        {schedule.map((s, i) => <p key={i}><strong>{s.day}</strong>: {s.due.length ? s.due.map((t) => t.task).filter(Boolean).join(', ') || '—' : '—'}</p>)}
      </div>
      <Msg kind="status">Shows the next 7 days from your start day — tasks recur every N days from day 1.</Msg>
    </div>
  )
}
