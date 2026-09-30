import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function BellScheduleMaker() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({period:'',start:'',end:''})
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!form.period.trim()) { setErr('Period is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({period:'',start:'',end:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Period"><input type="text" value={form.period} onChange={e => setForm({...form,period:e.target.value})} placeholder="1" /></Field>
        <Field label="Start Time"><input type="time" value={form.start} onChange={e => setForm({...form,start:e.target.value})} placeholder="" /></Field>
        <Field label="End Time"><input type="time" value={form.end} onChange={e => setForm({...form,end:e.target.value})} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Period</th><th>Start</th><th>End</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.period}</td><td>{item.start}</td><td>{item.end}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length} entries</p>
      </div>}
      <p className="hint">Add all periods to build your daily schedule.</p>
    </div>
  )
}
