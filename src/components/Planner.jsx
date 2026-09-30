import { useState } from 'react'
import { useStored, uid, today } from './hooks.js'
import { Field, Msg, download } from './ui.jsx'
export default function Planner({ storeKey, fields, dateKey, statusKey, doneValue, csv, noun }) {
  const blank = () => Object.fromEntries(fields.map((x) => [x.k, x.def ?? (x.options ? x.options[0] : '')]))
  const [items, setItems] = useStored(storeKey, [])
  const [f, setF] = useState(blank)
  const [err, setErr] = useState('')
  const add = () => {
    const miss = fields.find((x) => x.req && !String(f[x.k]).trim())
    if (miss) return setErr(`${miss.label} is required.`)
    const bad = fields.find((x) => x.type === 'number' && f[x.k] !== '' && !(Number(f[x.k]) >= 0))
    if (bad) return setErr(`${bad.label} must be 0 or more.`)
    setItems([...items, { id: uid(), ...f }]); setF(blank()); setErr('')
  }
  const upd = (id, k, v) => setItems(items.map((i) => (i.id === id ? { ...i, [k]: v } : i)))
  const sorted = [...items].sort((a, b) => String(a[dateKey]).localeCompare(String(b[dateKey])))
  const done = items.filter((i) => i[statusKey] === doneValue).length
  const exportCsv = () => download(csv, [fields.map((x) => x.label).join(','), ...sorted.map((i) => fields.map((x) => `"${String(i[x.k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n'), 'text/csv')
  return (
    <div>
      <div className="row">
        {fields.map((x) => (
          <Field key={x.k} label={x.label + (x.req ? ' *' : '')}>
            {x.options ? <select value={f[x.k]} onChange={(e) => setF({ ...f, [x.k]: e.target.value })}>{x.options.map((o) => <option key={o}>{o}</option>)}</select>
              : <input type={x.type || 'text'} min={x.type === 'number' ? 0 : undefined} step={x.type === 'number' ? 0.5 : undefined} value={f[x.k]} onChange={(e) => setF({ ...f, [x.k]: e.target.value })} />}
          </Field>
        ))}
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add {noun}</button></div>
      <Msg>{err}</Msg>
      <h3>{items.length ? `${items.length} ${noun}${items.length === 1 ? '' : 's'}, ${done} done` : `Your ${noun} list`}</h3>
      {!items.length && <div className="empty"><p>No {noun}s yet. Fill in the form above and select Add {noun}.</p></div>}
      <ul className="items">
        {sorted.map((i) => (
          <li key={i.id} className={'item' + (i[dateKey] < today() && i[statusKey] !== doneValue ? ' late' : '')}>
            <div><strong>{i[fields[0].k]}</strong>
              {fields.slice(1).filter((x) => !x.options && String(i[x.k]).trim()).map((x) => <span key={x.k}> · {x.label}: {i[x.k]}</span>)}
              {i[dateKey] < today() && i[statusKey] !== doneValue && <em> (overdue)</em>}</div>
            <div className="actions">
              {fields.filter((x) => x.options).map((x) => <select key={x.k} aria-label={x.label} value={i[x.k]} onChange={(e) => upd(i.id, x.k, e.target.value)}>{x.options.map((o) => <option key={o}>{o}</option>)}</select>)}
              <button className="btn ghost" onClick={() => setItems(items.filter((y) => y.id !== i.id))} aria-label={`Delete ${i[fields[0].k]}`}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 0 && <div className="actions">
        <button className="btn ghost" onClick={exportCsv}>Download CSV</button>
        <button className="btn ghost" onClick={() => window.confirm(`Delete all ${noun}s?`) && setItems([])}>Clear all</button>
      </div>}
      <p className="hint">Saved only in this browser (local storage). Nothing is uploaded.</p>
    </div>
  )
}
