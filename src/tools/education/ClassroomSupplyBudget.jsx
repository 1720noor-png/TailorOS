import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function ClassroomSupplyBudget() {
  const [budget, setBudget] = useState('500')
  const [items, setItems] = useState([])
  const [itemName, setItemName] = useState('')
  const [itemCost, setItemCost] = useState('')
  const [err, setErr] = useState('')

  const add = () => {
    setErr('')
    if (!itemName.trim()) { setErr('Enter item name.'); return }
    const cost = parseFloat(itemCost) || 0
    setItems([...items, { name: itemName.trim(), cost, id: Date.now() }])
    setItemName(''); setItemCost('')
  }
  const remove = id => setItems(items.filter(x => x.id !== id))
  const spent = items.reduce((s, i) => s + i.cost, 0)
  const remaining = (parseFloat(budget) || 0) - spent

  return (
    <div>
      <Field label="Total Budget ($)"><input type="number" value={budget} onChange={e => setBudget(e.target.value)} /></Field>
      <div className="row">
        <Field label="Item"><input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Markers" /></Field>
        <Field label="Cost ($)"><input type="number" step="0.01" value={itemCost} onChange={e => setItemCost(e.target.value)} placeholder="12.99" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add Purchase</button></div>
      <Msg>{err}</Msg>
      <div className="out" role="status">
        <p><strong>Spent:</strong> ${spent.toFixed(2)} | <strong>Remaining:</strong> <span style={{color:remaining<0?'var(--red,#e53e3e)':'inherit'}}>${remaining.toFixed(2)}</span></p>
        {items.map(item => <p key={item.id}>{item.name}: ${item.cost.toFixed(2)} <button className="btn ghost" onClick={() => remove(item.id)}>✕</button></p>)}
      </div>
      <p className="hint">Track all classroom purchases to stay within budget.</p>
    </div>
  )
}
