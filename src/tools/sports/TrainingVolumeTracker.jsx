import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function TrainingVolumeTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({date:'',exercise:'',sets:'',reps:'',weight:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.date.trim()) { setErr('Date is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({date:'',exercise:'',sets:'',reps:'',weight:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Date"><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="" /></Field>
        <Field label="Exercise"><input type="text" value={form.exercise} onChange={e=>setForm({...form,exercise:e.target.value})} placeholder="Squat" /></Field>
        <Field label="Sets"><input type="number" value={form.sets} onChange={e=>setForm({...form,sets:e.target.value})} placeholder="3" /></Field>
        <Field label="Reps"><input type="number" value={form.reps} onChange={e=>setForm({...form,reps:e.target.value})} placeholder="10" /></Field>
        <Field label="Weight"><input type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="100" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Date</th><th>Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.date}</td><td>{item.exercise}</td><td>{item.sets}</td><td>{item.reps}</td><td>{item.weight}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Track training volume for progressive overload.</p>
    </div>
  )
}
