import { useState } from 'react'
import { useStored, uid } from '../../components/hooks.js'
import { Field, Msg } from '../../components/ui.jsx'

const QUADS = [
  { key: 'do', label: 'Do first', hint: 'Urgent & important' },
  { key: 'schedule', label: 'Schedule', hint: 'Important, not urgent' },
  { key: 'delegate', label: 'Delegate', hint: 'Urgent, not important' },
  { key: 'delete', label: 'Eliminate', hint: 'Neither urgent nor important' },
]

export default function EisenhowerMatrix() {
  const [tasks, setTasks] = useStored('toolhub.eisenhower', [])
  const [text, setText] = useState('')
  const [urgent, setUrgent] = useState(true)
  const [important, setImportant] = useState(true)
  const [err, setErr] = useState('')

  const quadOf = (u, i) => (u && i ? 'do' : !u && i ? 'schedule' : u && !i ? 'delegate' : 'delete')
  const add = () => {
    if (!text.trim()) return setErr('Enter a task.')
    setErr('')
    setTasks([...tasks, { id: uid(), text: text.trim(), quad: quadOf(urgent, important) }])
    setText('')
  }
  const remove = (id) => setTasks(tasks.filter((t) => t.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Task"><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} /></Field>
      </div>
      <label className="check"><input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} /> Urgent</label>
      <label className="check"><input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} /> Important</label>
      <div className="actions"><button className="btn" onClick={add}>Add task</button></div>
      <Msg>{err}</Msg>
      <div className="grid">
        {QUADS.map((q) => (
          <div className="out" key={q.key}>
            <p><strong>{q.label}</strong> <span className="muted">— {q.hint}</span></p>
            <ul className="items">
              {tasks.filter((t) => t.quad === q.key).map((t) => (
                <li className="item" key={t.id}>{t.text} <button className="btn ghost" onClick={() => remove(t.id)} aria-label="Remove">Remove</button></li>
              ))}
              {!tasks.some((t) => t.quad === q.key) && <li className="muted">No tasks here yet.</li>}
            </ul>
          </div>
        ))}
      </div>
      <p className="hint">Saved only in this browser. The Eisenhower Matrix sorts tasks by urgency and importance so you know what to tackle first.</p>
    </div>
  )
}
