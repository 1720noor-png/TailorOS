import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function KanbanBoard() {
  const [cols] = useState(['To Do','In Progress','Done'])
  const [items, setItems] = useState([])
  const [input, setInput] = useState('')
  const [err, setErr] = useState('')
  const add = () => {
    if (!input.trim()) { setErr('Enter an item.'); return }
    setErr(''); setItems([...items, { text: input.trim(), col: 0, id: Date.now() }]); setInput('')
  }
  const move = (id, dir) => setItems(items.map(it => it.id === id ? {...it, col: Math.max(0, Math.min(2, it.col + dir))} : it))
  const remove = id => setItems(items.filter(it => it.id !== id))
  return (
    <div>
      <div className="row">
        <Field label="New Item"><input value={input} onChange={e => setInput(e.target.value)} placeholder="Task description" onKeyDown={e => e.key === 'Enter' && add()} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:12}}>
        {cols.map((col, ci) => (
          <div key={ci} style={{background:'var(--bg2,#f7fafc)',borderRadius:8,padding:8,minHeight:100}}>
            <p style={{fontWeight:'bold',marginBottom:8}}>{col}</p>
            {items.filter(it => it.col === ci).map(it => (
              <div key={it.id} style={{background:'white',padding:6,borderRadius:4,marginBottom:4,fontSize:'.85rem',display:'flex',gap:4,alignItems:'center'}}>
                <span style={{flex:1}}>{it.text}</span>
                {ci > 0 && <button className="btn ghost" onClick={() => move(it.id, -1)}>←</button>}
                {ci < 2 && <button className="btn ghost" onClick={() => move(it.id, 1)}>→</button>}
                <button className="btn ghost" onClick={() => remove(it.id)}>✕</button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="hint">Move items between columns with arrows.</p>
    </div>
  )
}
