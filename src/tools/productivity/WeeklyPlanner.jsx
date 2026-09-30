import { useState } from 'react'
import { useStored, today } from '../../components/hooks.js'
import { Field } from '../../components/ui.jsx'
import DocOut from '../../components/DocOut.jsx'
import { shiftDay, dayLabel, weekStart } from '../../utils/time.js'

export default function WeeklyPlanner() {
  const [data, setData] = useStored('toolhub.weekly', {})
  const [startDay, setStartDay] = useStored('toolhub.weekly-start', '1')
  const [anchor, setAnchor] = useState(today())
  const start = weekStart(anchor, Number(startDay))
  const days = Array.from({ length: 7 }, (_, i) => shiftDay(start, i))
  const wk = data[start] || { goals: '', days: {} }
  const save = (w) => {
    const next = { ...data }
    if (!w.goals && !Object.values(w.days).some((v) => v)) delete next[start]; else next[start] = w
    setData(next)
  }
  const setDay = (d, v) => save({ ...wk, days: { ...wk.days, [d]: v } })
  const filled = days.some((d) => (wk.days[d] || '').trim()) || wk.goals.trim()
  const summary = [`Weekly plan – ${dayLabel(days[0], { day: 'numeric', month: 'short', year: 'numeric' })} to ${dayLabel(days[6], { day: 'numeric', month: 'short', year: 'numeric' })}`,
    ...(wk.goals.trim() ? ['', 'Goals for the week:', wk.goals.trim()] : []),
    ...days.flatMap((d) => (wk.days[d] || '').trim() ? ['', dayLabel(d, { weekday: 'long', day: 'numeric', month: 'short' }), (wk.days[d] || '').trim()] : [])].join('\n')
  return (
    <div>
      <div className="actions">
        <button className="btn ghost" onClick={() => setAnchor(shiftDay(start, -7))}>← Previous week</button>
        <button className="btn ghost" onClick={() => setAnchor(today())}>This week</button>
        <button className="btn ghost" onClick={() => setAnchor(shiftDay(start, 7))}>Next week →</button>
      </div>
      <div className="row">
        <Field label="Week starts on"><select value={startDay} onChange={(e) => setStartDay(e.target.value)}><option value="1">Monday</option><option value="0">Sunday</option></select></Field>
      </div>
      <h2>{dayLabel(days[0], { day: 'numeric', month: 'short' })} – {dayLabel(days[6], { day: 'numeric', month: 'short', year: 'numeric' })}</h2>
      <Field label="Goals for the week"><textarea rows={3} maxLength={1500} value={wk.goals} onChange={(e) => save({ ...wk, goals: e.target.value })} placeholder="One goal per line" /></Field>
      <div className="row">
        {days.map((d) => (
          <Field key={d} label={dayLabel(d, { weekday: 'long', day: 'numeric', month: 'short' }) + (d === today() ? ' (today)' : '')}>
            <textarea rows={4} maxLength={1500} value={wk.days[d] || ''} onChange={(e) => setDay(d, e.target.value)} placeholder="Tasks, one per line" />
          </Field>
        ))}
      </div>
      {filled ? <>
        <h2>Copy, download or print</h2>
        <DocOut text={summary} title={`Weekly plan ${start}`} filename={`weekly-plan-${start}.txt`} />
        <div className="actions"><button className="btn ghost" onClick={() => window.confirm('Clear everything planned for this week?') && save({ goals: '', days: {} })}>Clear this week</button></div>
      </> : <p className="hint">Start typing in any box; the plan is saved automatically.</p>}
      <p className="hint">Each week is saved separately in this browser only.</p>
    </div>
  )
}
