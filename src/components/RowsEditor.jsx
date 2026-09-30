import { Field } from './ui.jsx'
import { uid } from './hooks.js'
export const newRow = (cols) => ({ id: uid(), ...Object.fromEntries(cols.map((c) => [c.k, c.def ?? (c.options ? c.options[0] : '')])) })
export default function RowsEditor({ rows, setRows, cols, addLabel = 'Add row', min = 1 }) {
  const upd = (id, k, v) => setRows(rows.map((r) => (r.id === id ? { ...r, [k]: v } : r)))
  return (
    <div>
      {rows.map((r, i) => (
        <div className="row" key={r.id}>
          {cols.map((c) => (
            <Field key={c.k} label={`${c.label} (row ${i + 1})`}>
              {c.options
                ? <select value={r[c.k]} onChange={(e) => upd(r.id, c.k, e.target.value)}>{c.options.map((o) => <option key={o}>{o}</option>)}</select>
                : <input type={c.type || 'text'} min={c.min} step={c.step} value={r[c.k]} onChange={(e) => upd(r.id, c.k, e.target.value)} />}
            </Field>
          ))}
          <button type="button" className="btn ghost" disabled={rows.length <= min} onClick={() => setRows(rows.filter((x) => x.id !== r.id))} aria-label={`Remove row ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button type="button" className="btn ghost" onClick={() => setRows([...rows, newRow(cols)])}>{addLabel}</button></div>
    </div>
  )
}
