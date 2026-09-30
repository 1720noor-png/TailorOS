import { useState } from 'react'
import { useStored, uid } from '../../components/hooks.js'
import { Field, Msg } from '../../components/ui.jsx'

export default function GoalMilestoneTracker() {
  const [goals, setGoals] = useStored('toolhub.goal-milestones', [])
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [milestoneText, setMilestoneText] = useState({})

  const addGoal = () => {
    if (!name.trim()) return setErr('Enter a goal name.')
    setErr('')
    setGoals([...goals, { id: uid(), name: name.trim(), milestones: [] }])
    setName('')
  }
  const removeGoal = (id) => setGoals(goals.filter((g) => g.id !== id))
  const addMilestone = (gid) => {
    const t = (milestoneText[gid] || '').trim()
    if (!t) return
    setGoals(goals.map((g) => (g.id === gid ? { ...g, milestones: [...g.milestones, { id: uid(), text: t, done: false }] } : g)))
    setMilestoneText({ ...milestoneText, [gid]: '' })
  }
  const toggle = (gid, mid) => setGoals(goals.map((g) => (g.id === gid ? { ...g, milestones: g.milestones.map((m) => (m.id === mid ? { ...m, done: !m.done } : m)) } : g)))

  return (
    <div>
      <div className="row">
        <Field label="New goal"><input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGoal()} /></Field>
        <button className="btn" onClick={addGoal}>Add goal</button>
      </div>
      <Msg>{err}</Msg>
      {!goals.length && <div className="empty"><p>No goals yet — add one above.</p></div>}
      {goals.map((g) => {
        const done = g.milestones.filter((m) => m.done).length
        const pct = g.milestones.length ? Math.round((done / g.milestones.length) * 100) : 0
        return (
          <div className="out" key={g.id}>
            <p><strong>{g.name}</strong> <button className="btn ghost" onClick={() => removeGoal(g.id)}>Remove goal</button></p>
            <p role="status">{done} of {g.milestones.length} milestones complete ({pct}%)</p>
            <div style={{ background: 'var(--line, #e5e5e5)', borderRadius: 6, height: 8, overflow: 'hidden', margin: '.4rem 0' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brand, #2563eb)' }} />
            </div>
            <ul className="items">
              {g.milestones.map((m) => (
                <li className="item" key={m.id}>
                  <label className="check"><input type="checkbox" checked={m.done} onChange={() => toggle(g.id, m.id)} /> <span style={{ textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span></label>
                </li>
              ))}
            </ul>
            <div className="row">
              <input value={milestoneText[g.id] || ''} onChange={(e) => setMilestoneText({ ...milestoneText, [g.id]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addMilestone(g.id)} placeholder="New milestone" />
              <button className="btn ghost" onClick={() => addMilestone(g.id)}>Add milestone</button>
            </div>
          </div>
        )
      })}
      <p className="hint">Saved only in this browser.</p>
    </div>
  )
}
