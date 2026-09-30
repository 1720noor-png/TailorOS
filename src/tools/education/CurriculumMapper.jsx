import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function CurriculumMapper() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({standard:'',unit:'',assessment:''})
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!form.standard.trim()) { setErr('Standard is required.'); return }
    setItems([...items, {...form, id: Date.now()}])
    setForm({standard:'',unit:'',assessment:''})
  }
  const remove = id => setItems(items.filter(x => x.id !== id))

  return (
    <div>
      <div className="row">
        <Field label="Standard"><input type="text" value={form.standard} onChange={e => setForm({...form,standard:e.target.value})} placeholder="CCSS.MATH.3.OA.1" /></Field>
        <Field label="Unit"><input type="text" value={form.unit} onChange={e => setForm({...form,unit:e.target.value})} placeholder="Unit 3: Multiplication" /></Field>
        <Field label="Assessment"><input type="text" value={form.assessment} onChange={e => setForm({...form,assessment:e.target.value})} placeholder="Unit Test" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th>Standard</th><th>Unit</th><th>Assessment</th><th></th></tr></thead>
          <tbody>{items.map(item => (
            <tr key={item.id}><td>{item.standard}</td><td>{item.unit}</td><td>{item.assessment}</td><td><button className="btn ghost" onClick={() => remove(item.id)}>✕</button></td></tr>
          ))}</tbody>
        </table>
        <p><strong>Total:</strong> {items.length} entries</p>
      </div>}
      <p className="hint">Map each standard to its unit and assessment.</p>
    </div>
  )
}
