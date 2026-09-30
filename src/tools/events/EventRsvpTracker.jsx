import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function EventRsvpTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({name:'',email:'',status:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.name.trim()) { setErr('Guest Name is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({name:'',email:'',status:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Guest Name"><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="" /></Field>
        <Field label="Email"><input type="text" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="" /></Field>
        <Field label="RSVP"><input type="text" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} placeholder="Attending" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.name}</td><td>{item.email}</td><td>{item.status}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Track RSVPs for your event.</p>
    </div>
  )
}
