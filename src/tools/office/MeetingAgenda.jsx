import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
import RowsEditor, { newRow } from '../../components/RowsEditor.jsx'
import DocOut from '../../components/DocOut.jsx'
import { list } from '../../utils/text.js'
const cols = [{ k: 'topic', label: 'Agenda item' }, { k: 'min', label: 'Minutes', type: 'number', def: '10', step: 1, min: 1 }, { k: 'owner', label: 'Lead (optional)' }]
export default function MeetingAgenda() {
  const [f, setF] = useState({ title: '', dt: '', loc: '', people: '', notes: '' })
  const [rows, setRows] = useState([newRow(cols)])
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const gen = () => {
    setOut('')
    if (!f.title.trim()) return setErr('Enter the meeting title.')
    const used = rows.filter((r) => r.topic.trim())
    if (!used.length) return setErr('Add at least one agenda item.')
    if (used.some((r) => !Number.isInteger(Number(r.min)) || Number(r.min) < 1)) return setErr('Minutes must be a whole number of 1 or more for every item.')
    let t = f.dt ? new Date(f.dt) : null
    const lines = used.map((r, i) => {
      const at = t ? t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' : ''
      if (t) t = new Date(t.getTime() + Number(r.min) * 60000)
      return `${i + 1}. ${at}(${r.min} min) ${r.topic.trim()}${r.owner.trim() ? ` — ${r.owner.trim()}` : ''}`
    })
    const total = used.reduce((a, r) => a + Number(r.min), 0), p = list(f.people)
    const o = (c, x) => (c ? [x] : [])
    setErr(''); setOut(['MEETING AGENDA', f.title.trim(), '', ...o(f.dt, `Date: ${new Date(f.dt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}`), ...o(f.loc.trim(), `Location: ${f.loc.trim()}`), ...o(p.length, `Participants: ${p.join(', ')}`), '', 'Agenda', ...lines, '', `Total time: ${total} minutes`, ...o(f.notes.trim(), `\nNotes: ${f.notes.trim()}`)].join('\n'))
  }
  const reset = () => { setF({ title: '', dt: '', loc: '', people: '', notes: '' }); setRows([newRow(cols)]); setOut(''); setErr('') }
  return (
    <div>
      <div className="row">
        <Field label="Meeting title *"><input value={f.title} onChange={set('title')} /></Field>
        <Field label="Date and start time"><input type="datetime-local" value={f.dt} onChange={set('dt')} /></Field>
        <Field label="Location or link"><input value={f.loc} onChange={set('loc')} /></Field>
      </div>
      <Field label="Participants (comma or new line separated)"><textarea rows="2" value={f.people} onChange={set('people')} /></Field>
      <h3>Agenda items</h3>
      <RowsEditor rows={rows} setRows={setRows} cols={cols} addLabel="Add agenda item" />
      <Field label="Notes (optional)"><textarea rows="2" value={f.notes} onChange={set('notes')} /></Field>
      <div className="actions"><button className="btn" onClick={gen}>Create agenda</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <DocOut text={out} title="Meeting agenda" filename="meeting-agenda.txt" />}
    </div>
  )
}
