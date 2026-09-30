import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

let n = 0
const CATS = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']
const blank = () => CATS.map((c) => ({ id: ++n, cat: c, keep: '', donate: '', toss: '' }))

export default function ClosetDeclutteringPlanner() {
  const [rows, setRows] = useState(blank())
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))
  const sum = (k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0)
  const total = sum('keep') + sum('donate') + sum('toss')

  const text = 'Closet decluttering summary\n' + rows.map((r) => `${r.cat}: keep ${r.keep || 0}, donate ${r.donate || 0}, toss ${r.toss || 0}`).join('\n') +
    `\n\nTotals: keep ${sum('keep')}, donate ${sum('donate')}, toss ${sum('toss')} (${total} items reviewed)`

  return (
    <div>
      {rows.map((r) => (
        <div className="row" key={r.id}>
          <Field label={r.cat}><span /></Field>
          <Field label="Keep"><input type="number" min="0" value={r.keep} onChange={(e) => upd(r.id, 'keep', e.target.value)} /></Field>
          <Field label="Donate"><input type="number" min="0" value={r.donate} onChange={(e) => upd(r.id, 'donate', e.target.value)} /></Field>
          <Field label="Toss"><input type="number" min="0" value={r.toss} onChange={(e) => upd(r.id, 'toss', e.target.value)} /></Field>
        </div>
      ))}
      <p className="out" role="status">Keep: <strong>{sum('keep')}</strong> · Donate: <strong>{sum('donate')}</strong> · Toss: <strong>{sum('toss')}</strong> · Total reviewed: <strong>{total}</strong></p>
      <div className="actions"><CopyBtn text={text} /></div>
    </div>
  )
}
