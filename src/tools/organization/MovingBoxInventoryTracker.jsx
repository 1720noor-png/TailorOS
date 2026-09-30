import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, num: '', room: '', contents: '', fragile: false })

export default function MovingBoxInventoryTracker() {
  const [boxes, setBoxes] = useState([{ ...blank(), num: '1' }])
  const upd = (id, k, v) => setBoxes((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const text = 'Moving box inventory\n\n' + boxes.map((b) => `Box ${b.num || '?'} — ${b.room || 'Unlabeled room'}${b.fragile ? ' [FRAGILE]' : ''}\n  Contents: ${b.contents || '—'}`).join('\n\n')

  return (
    <div>
      {boxes.map((b, i) => (
        <div className="row" key={b.id}>
          <Field label="Box #"><input value={b.num} onChange={(e) => upd(b.id, 'num', e.target.value)} /></Field>
          <Field label="Room"><input value={b.room} onChange={(e) => upd(b.id, 'room', e.target.value)} placeholder="e.g. Kitchen" /></Field>
          <Field label="Contents"><input value={b.contents} onChange={(e) => upd(b.id, 'contents', e.target.value)} placeholder="e.g. Plates, mugs, pans" /></Field>
          <Field label="Fragile"><input type="checkbox" checked={b.fragile} onChange={(e) => upd(b.id, 'fragile', e.target.checked)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setBoxes((x) => (x.length > 1 ? x.filter((y) => y.id !== b.id) : x))} aria-label={`Remove box ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions">
        <button className="btn ghost" onClick={() => setBoxes((b) => [...b, { ...blank(), num: String(b.length + 1) }])}>Add box</button>
        <CopyBtn text={text} />
        <button className="btn ghost" onClick={() => download('moving-box-inventory.txt', text)}>Download</button>
      </div>
      <p className="out" role="status">Total boxes: <strong>{boxes.length}</strong> · Fragile: <strong>{boxes.filter((b) => b.fragile).length}</strong></p>
    </div>
  )
}
