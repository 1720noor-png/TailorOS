import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function StudentBehaviorTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({student:'',points:'',reason:''})
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!form.student.trim()) { setErr('Student is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({student:'',points:'',reason:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Student"><input type="text" value={form.student} onChange={e => setForm({...form,student:e.target.value})} placeholder="Alice" /></Field>
        <Field label="Points (+/-)"><input type="number" value={form.points} onChange={e => setForm({...form,points:e.target.value})} placeholder="5" /></Field>
        <Field label="Reason"><input type="text" value={form.reason} onChange={e => setForm({...form,reason:e.target.value})} placeholder="Helped classmate" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Student</th><th>Points</th><th>Reason</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.student}</td><td>{item.points}</td><td>{item.reason}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length} entries</p>
      </div>}
      <p className="hint">Use positive numbers for rewards and negative for deductions.</p>
    </div>
  )
}
