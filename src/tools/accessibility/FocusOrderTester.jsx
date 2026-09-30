import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function FocusOrderTester() {
  const [elements, setElements] = useState([{name:'',tabindex:''}])
  const [err, setErr] = useState('')
  const add = () => setElements([...elements, {name:'',tabindex:''}])
  const update = (i, key, val) => { const c = [...elements]; c[i] = {...c[i], [key]: val}; setElements(c) }
  const remove = i => setElements(elements.filter((_,j)=>j!==i))
  const analyze = () => {
    const valid = elements.filter(e => e.name.trim())
    if (!valid.length) { setErr('Add some elements.'); return }
    setErr('')
  }
  const sorted = [...elements].filter(e => e.name.trim()).sort((a,b) => {
    const ta = parseInt(a.tabindex), tb = parseInt(b.tabindex)
    if (isNaN(ta) && isNaN(tb)) return 0
    if (isNaN(ta)) return 1
    if (isNaN(tb)) return -1
    if (ta === 0 && tb === 0) return 0
    if (ta === 0) return 1
    if (tb === 0) return -1
    return ta - tb
  })
  return (
    <div>
      {elements.map((el, i) => (
        <div className="row" key={i}>
          <Field label="Element"><input value={el.name} onChange={e=>update(i,'name',e.target.value)} placeholder="Submit Button" /></Field>
          <Field label="tabindex"><input type="number" value={el.tabindex} onChange={e=>update(i,'tabindex',e.target.value)} placeholder="0" style={{width:60}} /></Field>
          {elements.length > 1 && <button className="btn ghost" onClick={() => remove(i)}>✕</button>}
        </div>
      ))}
      <div className="actions">
        <button className="btn ghost" onClick={add}>+ Add Element</button>
        <button className="btn" onClick={analyze}>Analyze Order</button>
      </div>
      <Msg>{err}</Msg>
      {sorted.length > 0 && <div className="out" role="status">
        <p><strong>Predicted Focus Order:</strong></p>
        {sorted.map((el, i) => <p key={i}>{i+1}. {el.name} {el.tabindex ? '(tabindex=' + el.tabindex + ')' : '(natural order)'}</p>)}
      </div>}
      <p className="hint">Elements with tabindex &gt; 0 come first, then tabindex=0 in DOM order.</p>
    </div>
  )
}
