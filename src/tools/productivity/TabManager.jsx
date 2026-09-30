import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function TabManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({group:'',url:'',notes:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.group.trim()) { setErr('Group is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({group:'',url:'',notes:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Group"><input type="text" value={form.group} onChange={e=>setForm({...form,group:e.target.value})} placeholder="Research" /></Field>
        <Field label="URL/Title"><input type="text" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://example.com" /></Field>
        <Field label="Notes"><input type="text" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Group</th><th>URL/Title</th><th>Notes</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.group}</td><td>{item.url}</td><td>{item.notes}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Organize links and tabs by group.</p>
    </div>
  )
}
