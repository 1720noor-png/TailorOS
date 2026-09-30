import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function RubricGenerator() {
  const [items, setItems] = useState([{criterion:'',weight:''}])
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')

  const addItem = () => setItems([...items, {criterion:'',weight:''}])
  const removeItem = i => setItems(items.filter((_,j) => j !== i))
  const updateItem = (i, key, val) => { const c = [...items]; c[i] = {...c[i], [key]: val}; setItems(c) }

  const process = () => {
    setErr(''); setResult('')
    const valid = items.filter(it => Object.values(it).some(v => v.trim()))
    if (!valid.length) { setErr('Add at least one item.'); return }
    const lines = valid.map((it, i) => (i+1) + '. ' + Object.entries(it).map(([k,v]) => v||'N/A').join(' | ')).join('\n')
    setResult(lines)
  }

  return (
    <div>
      {items.map((item, i) => (
        <div className="row" key={i}>
          <Field label="Criterion"><input type="text" value={item.criterion} onChange={e => updateItem(i,'criterion',e.target.value)} placeholder="Content quality" /></Field>
          <Field label="Weight"><input type="number" value={item.weight} onChange={e => updateItem(i,'weight',e.target.value)} placeholder="25" /></Field>
          {items.length > 1 && <button className="btn ghost" onClick={() => removeItem(i)}>✕</button>}
        </div>
      ))}
      <div className="actions">
        <button className="btn ghost" onClick={addItem}>+ Add</button>
        <button className="btn" onClick={process}>Process</button>
      </div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{result}</pre>
        <CopyBtn text={result} />
      </div>}
      <p className="hint">Add criteria with weights, then generate.</p>
    </div>
  )
}
