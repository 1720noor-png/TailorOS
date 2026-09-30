import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SeatingChartPlanner() {
  const [names, setNames] = useState('')
  const [tables, setTables] = useState('5')
  const [perTable, setPerTable] = useState('8')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const assign = () => {
    const list = names.split('\n').map((s) => s.trim()).filter(Boolean)
    const t = Number(tables), p = Number(perTable)
    if (!list.length) { setOut(null); return setErr('Enter at least one guest name, one per line.') }
    if (!(t > 0 && p > 0)) { setOut(null); return setErr('Enter number of tables and seats per table greater than 0.') }
    if (list.length > t * p) { setOut(null); return setErr(`${list.length} guests won't fit in ${t} tables × ${p} seats (${t * p} total seats). Add more tables or seats.`) }
    const result = Array.from({ length: t }, () => [])
    list.forEach((name, i) => { result[i % t].push(name) })
    setErr(''); setOut(result)
  }

  const text = out ? out.map((g, i) => `Table ${i + 1}: ${g.join(', ')}`).join('\n') : ''

  return (
    <div>
      <Field label="Guest names (one per line)"><textarea rows={8} value={names} onChange={(e) => setNames(e.target.value)} placeholder={'Alex\nJordan\nTaylor'} /></Field>
      <div className="row">
        <Field label="Number of tables"><input type="number" min="1" value={tables} onChange={(e) => setTables(e.target.value)} /></Field>
        <Field label="Seats per table"><input type="number" min="1" value={perTable} onChange={(e) => setPerTable(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={assign}>Assign seating</button></div>
      <Msg>{err}</Msg>
      {out && (
        <div className="out" role="status">
          {out.map((g, i) => <p key={i}><strong>Table {i + 1}</strong> ({g.length}): {g.join(', ') || '—'}</p>)}
          <div className="actions"><CopyBtn text={text} /></div>
        </div>
      )}
      <Msg kind="status">Seats guests in the order listed, spread evenly across tables — reorder the list to control who sits together.</Msg>
    </div>
  )
}
