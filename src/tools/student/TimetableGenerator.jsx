import { useState } from 'react'
import { Field, Msg, download } from '../../components/ui.jsx'
import { useStored, uid } from '../../components/hooks.js'
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export default function TimetableGenerator() {
  const [rows, setRows] = useStored('toolhub.timetable', [])
  const [f, setF] = useState({ day: 'Monday', start: '', end: '', subject: '', room: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const add = () => {
    if (!f.subject.trim()) return setErr('Enter a subject.')
    if (!f.start || !f.end) return setErr('Choose start and end times.')
    if (f.end <= f.start) return setErr('End time must be after the start time.')
    const clash = rows.find((r) => r.day === f.day && r.start < f.end && r.end > f.start)
    if (clash) return setErr(`This overlaps with ${clash.subject} (${clash.start}–${clash.end}).`)
    setRows([...rows, { id: uid(), ...f, subject: f.subject.trim(), room: f.room.trim() }])
    setF({ ...f, start: '', end: '', subject: '', room: '' }); setErr('')
  }
  const csv = () => download('timetable.csv', ['Day,Start,End,Subject,Room', ...DAYS.flatMap((d) => rows.filter((r) => r.day === d).sort((a, b) => a.start.localeCompare(b.start)).map((r) => [r.day, r.start, r.end, r.subject, r.room].map((v) => `"${v.replace(/"/g, '""')}"`).join(',')))].join('\n'), 'text/csv')
  return (
    <div>
      <div className="row">
        <Field label="Day"><select value={f.day} onChange={set('day')}>{DAYS.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Start"><input type="time" value={f.start} onChange={set('start')} /></Field>
        <Field label="End"><input type="time" value={f.end} onChange={set('end')} /></Field>
        <Field label="Subject"><input value={f.subject} onChange={set('subject')} /></Field>
        <Field label="Room (optional)"><input value={f.room} onChange={set('room')} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={add}>Add class</button></div>
      <Msg>{err}</Msg>
      {!rows.length && <div className="empty"><p>Your timetable is empty. Add your first class above.</p></div>}
      <div className="grid">
        {DAYS.filter((d) => rows.some((r) => r.day === d)).map((d) => (
          <section className="tool" key={d}><h3>{d}</h3>
            {rows.filter((r) => r.day === d).sort((a, b) => a.start.localeCompare(b.start)).map((r) => (
              <p key={r.id}>{r.start}–{r.end} · <strong>{r.subject}</strong>{r.room && ` (${r.room})`} <button className="btn ghost" onClick={() => setRows(rows.filter((x) => x.id !== r.id))} aria-label={`Delete ${r.subject} on ${d}`}>×</button></p>
            ))}
          </section>
        ))}
      </div>
      {rows.length > 0 && <div className="actions"><button className="btn ghost" onClick={csv}>Download CSV</button><button className="btn ghost" onClick={() => window.print()}>Print</button><button className="btn ghost" onClick={() => window.confirm('Delete the whole timetable?') && setRows([])}>Clear all</button></div>}
      <p className="hint">Saved only in this browser.</p>
    </div>
  )
}
