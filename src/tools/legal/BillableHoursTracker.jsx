import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function BillableHoursTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({client:'',hours:'',description:''})
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!form.client.trim()) { setErr('Client is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({client:'',hours:'',description:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Client"><input type="text" value={form.client} onChange={e => setForm({...form,client:e.target.value})} placeholder="Client A" /></Field>
        <Field label="Hours"><input type="number" value={form.hours} onChange={e => setForm({...form,hours:e.target.value})} placeholder="2" /></Field>
        <Field label="Description"><input type="text" value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Research" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Client</th><th>Hours</th><th>Description</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.client}</td><td>{item.hours}</td><td>{item.description}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length} entries</p>
      </div>}
      <p className="hint">Log time entries for accurate billing.</p>
    </div>
  )
}
