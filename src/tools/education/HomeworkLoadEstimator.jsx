import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function HomeworkLoadEstimator() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({subject:'',hours:''})
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!form.subject.trim()) { setErr('Subject is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({subject:'',hours:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Subject"><input type="text" value={form.subject} onChange={e => setForm({...form,subject:e.target.value})} placeholder="Math" /></Field>
        <Field label="Hours/week"><input type="number" value={form.hours} onChange={e => setForm({...form,hours:e.target.value})} placeholder="2" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Subject</th><th>Hours</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.subject}</td><td>{item.hours}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length} entries</p>
      </div>}
      <p className="hint">Add subjects to see total weekly homework load.</p>
    </div>
  )
}
