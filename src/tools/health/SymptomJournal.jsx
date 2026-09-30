import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function SymptomJournal() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({date:'',symptom:'',severity:'',notes:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.date.trim()) { setErr('Date is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({date:'',symptom:'',severity:'',notes:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Date"><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="" /></Field>
        <Field label="Symptom"><input type="text" value={form.symptom} onChange={e=>setForm({...form,symptom:e.target.value})} placeholder="Headache" /></Field>
        <Field label="Severity (1-10)"><input type="number" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})} placeholder="5" /></Field>
        <Field label="Notes"><input type="text" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="After screen time" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Date</th><th>Symptom</th><th>Severity</th><th>Notes</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.date}</td><td>{item.symptom}</td><td>{item.severity}</td><td>{item.notes}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Track symptoms to discuss with your doctor.</p>
    </div>
  )
}
