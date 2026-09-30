import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function BodyMeasureTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({name:'',value:'',date:''})
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!form.name.trim()) { setErr('Name is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({name:'',value:'',date:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Name"><input type="text" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Entry" /></Field>
        <Field label="Value"><input type="text" value={form.value} onChange={e => setForm({...form,value:e.target.value})} placeholder="Value" /></Field>
        <Field label="Date"><input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Name</th><th>Value</th><th>Date</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.name}</td><td>{item.value}</td><td>{item.date}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length} entries</p>
      </div>}
      <p className="hint">Add entries to track over time.</p>
    </div>
  )
}
