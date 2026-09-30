import { useState } from 'react'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
const cols = [{ k: 'date', label: 'Date', type: 'date' }, { k: 'start', label: 'Start', type: 'time' }, { k: 'end', label: 'End', type: 'time' }, { k: 'brk', label: 'Break (min)', type: 'number', def: '0', step: 1, min: 0 }]
const hm = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`
const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
export default function TimesheetCalculator() {
  const [rows, setRows] = useState([newRow(cols)])
  const [rate, setRate] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const calc = () => {
    setOut(null)
    const used = rows.filter((r) => r.date || r.start || r.end)
    if (!used.length) return setErr('Enter at least one day with a date, start and end time.')
    if (rate !== '' && !(Number(rate) >= 0)) return setErr('Hourly rate must be 0 or more.')
    const res = []
    for (const [i, r] of used.entries()) {
      if (!r.date || !r.start || !r.end) return setErr(`Row ${i + 1}: date, start time and end time are all required.`)
      let d = mins(r.end) - mins(r.start)
      if (d === 0) return setErr(`Row ${i + 1}: start and end times are the same.`)
      const overnight = d < 0
      if (overnight) d += 1440
      const b = Number(r.brk || 0)
      if (!Number.isInteger(b) || b < 0 || b >= d) return setErr(`Row ${i + 1}: break must be a whole number of minutes shorter than the shift.`)
      res.push({ ...r, net: d - b, overnight })
    }
    const total = res.reduce((a, r) => a + r.net, 0)
    setErr(''); setOut({ res, total, pay: rate === '' ? null : (total / 60) * Number(rate) })
  }
  const csv = () => download('timesheet.csv', ['Date,Start,End,Break (min),Hours', ...out.res.map((r) => `${r.date},${r.start},${r.end},${r.brk || 0},${(r.net / 60).toFixed(2)}`), `Total,,,,${(out.total / 60).toFixed(2)}`].join('\n'), 'text/csv')
  return (
    <div>
      <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add day" />
      <Field label="Hourly rate (optional)"><input type="number" min="0" step="any" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
      <div className="actions"><button className="btn" onClick={calc}>Calculate hours</button><button className="btn ghost" onClick={() => { setRows([newRow(cols)]); setRate(''); setOut(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <table><thead><tr><th>Date</th><th>Worked</th><th>Decimal</th></tr></thead><tbody>{out.res.map((r) => <tr key={r.id}><td>{r.date}</td><td>{hm(r.net)}{r.overnight && ' (overnight)'}</td><td>{(r.net / 60).toFixed(2)}</td></tr>)}</tbody></table>
        <p>Total: <strong>{hm(out.total)}</strong> ({(out.total / 60).toFixed(2)} hours) over {out.res.length} day(s)</p>
        {out.pay !== null && <p>Earnings at this rate: <strong>{out.pay.toFixed(2)}</strong></p>}
        <div className="actions"><CopyBtn text={`Total: ${hm(out.total)} (${(out.total / 60).toFixed(2)} h) over ${out.res.length} day(s)`} /><button className="btn ghost" onClick={csv}>Download CSV</button></div>
      </div>}
      <p className="hint">If the end time is earlier than the start time the shift is treated as overnight.</p>
    </div>
  )
}
