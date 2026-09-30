import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function NetWorthTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({item:'',type:'',value:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.item.trim()) { setErr('Asset/Liability is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({item:'',type:'',value:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Asset/Liability"><input type="text" value={form.item} onChange={e=>setForm({...form,item:e.target.value})} placeholder="Savings Account" /></Field>
        <Field label="Type"><input type="text" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="Asset" /></Field>
        <Field label="Value ($)"><input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} placeholder="5000" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Item</th><th>Type</th><th>Value</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.item}</td><td>{item.type}</td><td>{item.value}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Add assets and liabilities to calculate net worth.</p>
    </div>
  )
}
