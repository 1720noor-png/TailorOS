import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
export default function PriorityRanker() {
  const [items, setItems] = useState([])
  const [input, setInput] = useState('')
  const [err, setErr] = useState('')
  const add = () => { if(!input.trim()){setErr('Enter an item.');return}; setErr(''); setItems([...items,{text:input.trim(),score:5}]); setInput('') }
  const setScore = (i,s) => { const c=[...items]; c[i]={...c[i],score:Number(s)}; setItems(c) }
  const remove = i => setItems(items.filter((_,j)=>j!==i))
  const sorted = [...items].sort((a,b) => b.score - a.score)
  return (
    <div>
      <div className="row"><Field label="Item"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Task or item" onKeyDown={e=>e.key==='Enter'&&add()} /></Field></div>
      <div className="actions"><button className="btn" onClick={add}>Add</button></div>
      <Msg>{err}</Msg>
      {items.length > 0 && <div className="out" role="status">
        {items.map((item,i) => (
          <div key={i} className="row" style={{alignItems:'center'}}>
            <span style={{flex:1}}>{item.text}</span>
            <input type="range" min="1" max="10" value={item.score} onChange={e=>setScore(i,e.target.value)} style={{width:100}} />
            <span style={{width:20,textAlign:'center'}}>{item.score}</span>
            <button className="btn ghost" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        <hr />
        <p><strong>Ranked:</strong></p>
        {sorted.map((item,i) => <p key={i}>{i+1}. {item.text} (score: {item.score})</p>)}
        <CopyBtn text={sorted.map((item,i) => (i+1)+'. '+item.text+' ('+item.score+')').join('\n')} />
      </div>}
      <p className="hint">Score each item 1-10, see ranked order.</p>
    </div>
  )
}
