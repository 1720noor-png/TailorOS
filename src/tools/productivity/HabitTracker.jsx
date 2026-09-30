import { useState } from 'react'
import { useStored, uid, today } from '../../components/hooks.js'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { shiftDay, dayLabel, streaks, completion } from '../../utils/time.js'

export default function HabitTracker() {
  const [habits, setHabits] = useStored('toolhub.habits', [])
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const t = today()
  const week = Array.from({ length: 7 }, (_, i) => shiftDay(t, i - 6))
  const add = () => {
    const n = name.trim()
    if (!n) return setErr('Enter a habit name.')
    if (habits.some((h) => h.name.toLowerCase() === n.toLowerCase())) return setErr('You already track that habit.')
    setHabits([...habits, { id: uid(), name: n, log: {} }]); setName(''); setErr('')
  }
  const toggle = (id, d) => setHabits(habits.map((h) => {
    if (h.id !== id) return h
    const log = { ...h.log }
    if (log[d]) delete log[d]; else log[d] = true
    return { ...h, log }
  }))
  const remove = (h) => window.confirm(`Delete “${h.name}” and its history?`) && setHabits(habits.filter((x) => x.id !== h.id))
  const summary = habits.map((h) => { const s = streaks(h.log, t); return `${h.name}: current streak ${s.current} day${s.current === 1 ? '' : 's'}, best ${s.best}, last 30 days ${completion(h.log, t)}%` }).join('\n')
  return (
    <div>
      <div className="row">
        <Field label="New habit"><input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="e.g. Read 10 pages" /></Field>
        <button className="btn" onClick={add}>Add habit</button>
      </div>
      <Msg>{err}</Msg>
      {!habits.length ? <div className="empty"><p>No habits yet. Add your first habit above, then tick a day each time you do it.</p></div> : <>
        <ul className="items">
          {habits.map((h) => {
            const s = streaks(h.log, t)
            return (
              <li className="item" key={h.id}>
                <div>
                  <strong>{h.name}</strong>
                  <p className="hint">Current streak: {s.current} · Best: {s.best} · Last 30 days: {completion(h.log, t)}%</p>
                  <div className="days" role="group" aria-label={`Last 7 days for ${h.name}`}>
                    {week.map((d) => (
                      <button key={d} type="button" className={'day' + (h.log[d] ? ' on' : '')} aria-pressed={!!h.log[d]}
                        aria-label={`${d === t ? 'Today, ' : ''}${dayLabel(d)}: ${h.log[d] ? 'done' : 'not done'}`} onClick={() => toggle(h.id, d)}>
                        {d === t ? 'Today' : dayLabel(d, { weekday: 'short' })}<br />{h.log[d] ? '✓' : '·'}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn ghost" onClick={() => remove(h)} aria-label={`Delete ${h.name}`}>Delete</button>
              </li>
            )
          })}
        </ul>
        <div className="actions">
          <CopyBtn text={summary} label="Copy summary" />
          <button className="btn ghost" onClick={() => window.confirm('Delete all habits and history?') && setHabits([])}>Clear all</button>
        </div>
      </>}
      <p className="hint">Tap a day to mark it done or undo it. Your streak counts consecutive days ending today (or yesterday, if you haven’t ticked today yet). Saved only in this browser.</p>
    </div>
  )
}
