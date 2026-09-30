import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function CaffeineTracker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({drink:'',mg:'',time:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.drink.trim()) { setErr('Drink is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({drink:'',mg:'',time:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Drink"><input type="text" value={form.drink} onChange={e=>setForm({...form,drink:e.target.value})} placeholder="Coffee" /></Field>
        <Field label="Caffeine (mg)"><input type="number" value={form.mg} onChange={e=>setForm({...form,mg:e.target.value})} placeholder="95" /></Field>
        <Field label="Time"><input type="text" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} placeholder="8:00 AM" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Drink</th><th>mg</th><th>Time</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.drink}</td><td>{item.mg}</td><td>{item.time}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">400mg/day is the general limit for adults.</p>
    </div>
  )
}
