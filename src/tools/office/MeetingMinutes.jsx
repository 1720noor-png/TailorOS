import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import DocOut from '../../components/DocOut.jsx'
import { list } from '../../utils/text.js'
const cols = [{ k: 'task', label: 'Action item' }, { k: 'owner', label: 'Responsible person' }, { k: 'due', label: 'Due date', type: 'date' }]
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean)
export default function MeetingMinutes() {
  const blank = () => ({ title: '', dt: '', loc: '', people: '', disc: '', dec: '' })
  const [f, setF] = useState(blank)
  const [rows, setRows] = useState([newRow(cols)])
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const gen = () => {
    setOut('')
    const acts = rows.filter((r) => r.task.trim() || r.owner.trim())
    if (!f.title.trim()) return setErr('Enter the meeting title.')
    if (!list(f.people).length) return setErr('List at least one attendee.')
    if (!lines(f.disc).length && !lines(f.dec).length && !acts.length) return setErr('Add discussion points, decisions or action items.')
    if (acts.some((r) => !r.task.trim() || !r.owner.trim())) return setErr('Every action item needs a task and a responsible person.')
    const sec = (h, arr) => (arr.length ? ['', h, ...arr] : [])
    setErr(''); setOut([
      'MEETING MINUTES', f.title.trim(),
      ...(f.dt ? [`Date: ${new Date(f.dt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}`] : []), ...(f.loc.trim() ? [`Location: ${f.loc.trim()}`] : []),
      `Attendees: ${list(f.people).join(', ')}`,
      ...sec('Discussion', lines(f.disc).map((x, i) => `${i + 1}. ${x}`)), ...sec('Decisions', lines(f.dec).map((x, i) => `${i + 1}. ${x}`)),
      ...sec('Action items', acts.map((r, i) => `${i + 1}. ${r.task.trim()} — ${r.owner.trim()}${r.due ? ` (due ${r.due})` : ''}`)),
    ].join('\n'))
  }
  const reset = () => { setF(blank()); setRows([newRow(cols)]); setOut(''); setErr('') }
  return (
    <div>
      <div className="row">
        <Field label="Meeting title *"><input value={f.title} onChange={set('title')} /></Field>
        <Field label="Date and time"><input type="datetime-local" value={f.dt} onChange={set('dt')} /></Field>
        <Field label="Location or link"><input value={f.loc} onChange={set('loc')} /></Field>
      </div>
      <Field label="Attendees * (comma or new line separated)"><textarea rows="2" value={f.people} onChange={set('people')} /></Field>
      <Field label="Discussion points (one per line)"><textarea rows="4" value={f.disc} onChange={set('disc')} /></Field>
      <Field label="Decisions (one per line)"><textarea rows="3" value={f.dec} onChange={set('dec')} /></Field>
      <h3>Action items</h3>
      <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add action item" />
      <div className="actions"><button className="btn" onClick={gen}>Create minutes</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <DocOut text={out} title="Meeting minutes" filename="meeting-minutes.txt" />}
    </div>
  )
}
