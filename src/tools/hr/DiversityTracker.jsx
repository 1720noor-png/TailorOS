import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function DiversityTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({name:'',value:'',notes:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.name.trim()) { setErr('Name is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({name:'',value:'',notes:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Entry" /></Field>
        <Field label="Value"><input value={form.value} onChange={e=>setForm({...form,value:e.target.value})} placeholder="Value" /></Field>
        <Field label="Notes"><input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}><thead><tr><th style={{textAlign:'left',padding:4}}>Name</th><th style={{padding:4}}>Value</th><th style={{padding:4}}>Notes</th><th></th></tr></thead>
        <tbody>{items.map(item => <tr key={item.id}><td style={{padding:4}}>{item.name}</td><td style={{padding:4}}>{item.value}</td><td style={{padding:4}}>{item.notes}</td><td><button className="btn ghost" onClick={()=>remove(item.id)}>✕</button></td></tr>)}</tbody></table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Add entries to track.</p>
    </div>
  )
}
