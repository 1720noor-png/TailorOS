import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import { useStored, uid, today } from '../../components/hooks.js'
const RANK = { High: 0, Medium: 1, Low: 2 }
export default function TaskManager() {
  const [tasks, setTasks] = useStored('toolhub.tasks', [])
  const [t, setT] = useState('')
  const [due, setDue] = useState('')
  const [pri, setPri] = useState('Medium')
  const [flt, setFlt] = useState('all')
  const [pf, setPf] = useState('all')
  const [err, setErr] = useState('')
  const td = today()
  const add = () => {
    if (!t.trim()) return setErr('Enter a task.')
    if (t.length > 200) return setErr('Keep the task under 200 characters.')
    setTasks([...tasks, { id: uid(), title: t.trim(), due, pri, done: false }]); setT(''); setDue(''); setErr('')
  }
  const shown = tasks.filter((x) => (flt === 'all' || (flt === 'active' && !x.done) || (flt === 'done' && x.done) || (flt === 'overdue' && !x.done && x.due && x.due < td)) && (pf === 'all' || x.pri === pf))
    .sort((a, b) => a.done - b.done || (a.due || '9').localeCompare(b.due || '9') || RANK[a.pri] - RANK[b.pri])
  return (
    <div>
      <div className="row">
        <Field label="Task"><input value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} /></Field>
        <Field label="Due date (optional)"><input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></Field>
        <Field label="Priority"><select value={pri} onChange={(e) => setPri(e.target.value)}><option>High</option><option>Medium</option><option>Low</option></select></Field>
        <button className="btn" onClick={add}>Add task</button>
      </div>
      <Msg>{err}</Msg>
      <div className="row">
        <Field label="Show"><select value={flt} onChange={(e) => setFlt(e.target.value)}><option value="all">All tasks</option><option value="active">Active</option><option value="done">Completed</option><option value="overdue">Overdue</option></select></Field>
        <Field label="Priority filter"><select value={pf} onChange={(e) => setPf(e.target.value)}><option value="all">Any priority</option><option>High</option><option>Medium</option><option>Low</option></select></Field>
      </div>
      {!tasks.length ? <div className="empty"><p>No tasks yet. Add your first task above.</p></div>
        : !shown.length ? <div className="empty"><p>No tasks match these filters.</p></div>
        : <ul className="items">{shown.map((x) => (
          <li key={x.id} className={'item' + (!x.done && x.due && x.due < td ? ' late' : '')}>
            <label className="check"><input type="checkbox" checked={x.done} onChange={() => setTasks(tasks.map((y) => (y.id === x.id ? { ...y, done: !y.done } : y)))} />
              <span style={{ textDecoration: x.done ? 'line-through' : 'none', textTransform: 'none' }}>{x.title}</span></label>
            <span>{x.pri}{x.due && ` · due ${x.due}`}{!x.done && x.due && x.due < td && <em> (overdue)</em>}</span>
            <button className="btn ghost" onClick={() => setTasks(tasks.filter((y) => y.id !== x.id))} aria-label={`Delete ${x.title}`}>Delete</button>
          </li>))}</ul>}
      {tasks.some((x) => x.done) && <div className="actions"><button className="btn ghost" onClick={() => setTasks(tasks.filter((x) => !x.done))}>Clear completed</button></div>}
      <p className="hint">{tasks.filter((x) => !x.done).length} active of {tasks.length}. Saved only in this browser.</p>
    </div>
  )
}
