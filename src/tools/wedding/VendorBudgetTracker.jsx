import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function VendorBudgetTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({item:'',value:'',notes:''})
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!form.item.trim()) { setErr('Item is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({item:'',value:'',notes:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Item"><input type="text" value={form.item} onChange={e => setForm({...form,item:e.target.value})} placeholder="Enter item" /></Field>
        <Field label="Value"><input type="text" value={form.value} onChange={e => setForm({...form,value:e.target.value})} placeholder="Value" /></Field>
        <Field label="Notes"><input type="text" value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} placeholder="Optional notes" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Item</th><th>Value</th><th>Notes</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.item}</td><td>{item.value}</td><td>{item.notes}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length} entries</p>
      </div>}
      <p className="hint">Add entries to track over time.</p>
    </div>
  )
}
