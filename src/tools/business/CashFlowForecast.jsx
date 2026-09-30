import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function CashFlowForecast() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({month:'',income:'',expenses:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.month.trim()) { setErr('Month is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({month:'',income:'',expenses:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Month"><input type="text" value={form.month} onChange={e=>setForm({...form,month:e.target.value})} placeholder="January" /></Field>
        <Field label="Income ($)"><input type="number" value={form.income} onChange={e=>setForm({...form,income:e.target.value})} placeholder="10000" /></Field>
        <Field label="Expenses ($)"><input type="number" value={form.expenses} onChange={e=>setForm({...form,expenses:e.target.value})} placeholder="8000" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.month}</td><td>{item.income}</td><td>{item.expenses}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Track monthly cash flow projections.</p>
    </div>
  )
}
