import { useState } from 'react'
import { useStored, uid } from './hooks.js'
import { Field, Msg } from './ui.jsx'
export default function Checklist({ storeKey, noun = 'item' }) {
  const [items, setItems] = useStored(storeKey, [])
  const [t, setT] = useState('')
  const [err, setErr] = useState('')
  const add = () => {
    const x = t.trim()
    if (!x) return setErr(`Enter a ${noun}.`)
    if (items.some((i) => i.text.toLowerCase() === x.toLowerCase())) return setErr('That item is already on the list.')
    setItems([...items, { id: uid(), text: x, done: false }]); setT(''); setErr('')
  }
  const done = items.filter((i) => i.done).length
  return (
    <div>
      <div className="row">
        <Field label={`New ${noun}`}><input value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} maxLength={200} /></Field>
        <button className="btn" onClick={add}>Add {noun}</button>
      </div>
      <Msg>{err}</Msg>
      {!items.length ? <div className="empty"><p>Your checklist is empty. Add your first {noun} above.</p></div> : <>
        <p role="status"><strong>{done}</strong> of {items.length} complete</p>
        <ul className="items">{items.map((i) => (
          <li className="item" key={i.id}>
            <label className="check"><input type="checkbox" checked={i.done} onChange={() => setItems(items.map((x) => (x.id === i.id ? { ...x, done: !x.done } : x)))} /> <span style={{ textDecoration: i.done ? 'line-through' : 'none', textTransform: 'none' }}>{i.text}</span></label>
            <button className="btn ghost" onClick={() => setItems(items.filter((x) => x.id !== i.id))} aria-label={`Remove ${i.text}`}>Remove</button>
          </li>))}</ul>
        <div className="actions">
          <button className="btn ghost" onClick={() => setItems(items.map((i) => ({ ...i, done: false })))}>Reset (uncheck all)</button>
          <button className="btn ghost" onClick={() => window.confirm('Remove every item?') && setItems([])}>Clear list</button>
        </div></>}
      <p className="hint">Saved only in this browser.</p>
    </div>
  )
}
