import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function DecisionMatrix() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({option:'',criteria:'',score:''})
  const [err, setErr] = useState('')
  const add = () => {
    setErr('')
    if (!form.option.trim()) { setErr('Option is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({option:'',criteria:'',score:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="Option"><input type="text" value={form.option} onChange={e=>setForm({...form,option:e.target.value})} placeholder="Option A" /></Field>
        <Field label="Criteria"><input type="text" value={form.criteria} onChange={e=>setForm({...form,criteria:e.target.value})} placeholder="Cost, Quality" /></Field>
        <Field label="Score (1-10)"><input type="number" value={form.score} onChange={e=>setForm({...form,score:e.target.value})} placeholder="7" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Option</th><th>Criteria</th><th>Score</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.option}</td><td>{item.criteria}</td><td>{item.score}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length}</p>
      </div>}
      <p className="hint">Score options against weighted criteria.</p>
    </div>
  )
}
