import { useState } from 'react'
import { useStored, uid, today } from '../../components/hooks.js'
import { Field, Msg } from '../../components/ui.jsx'
import DocOut from '../../components/DocOut.jsx'
import { shiftDay, dayLabel, validDay } from '../../utils/time.js'

export default function DailyPlanner() {
  const [data, setData] = useStored('toolhub.daily', {})
  const [date, setDate] = useState(today())
  const [time, setTime] = useState('')
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  const ok = validDay(date)
  const day = (ok && data[date]) || { items: [], notes: '' }
  const save = (d) => {
    const next = { ...data }
    if (!d.items.length && !d.notes) delete next[date]; else next[date] = d
    setData(next)
  }
  const add = () => {
    if (!ok) return setErr('Pick a valid date first.')
    const x = text.trim()
    if (!x) return setErr('Enter a task or appointment.')
    save({ ...day, items: [...day.items, { id: uid(), time, text: x, done: false }] })
    setText(''); setTime(''); setErr('')
  }
  const items = [...day.items].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
  const upd = (id, f) => save({ ...day, items: day.items.map((i) => (i.id === id ? f(i) : i)) })
  const done = day.items.filter((i) => i.done).length
  const summary = ok ? [`Daily plan – ${dayLabel(date)}`, '', ...items.map((i) => `[${i.done ? 'x' : ' '}] ${i.time ? i.time + '  ' : ''}${i.text}`), ...(day.notes.trim() ? ['', 'Notes:', day.notes.trim()] : [])].join('\n') : ''
  return (
    <div>
      <div className="actions">
        <button className="btn ghost" onClick={() => ok && setDate(shiftDay(date, -1))} disabled={!ok}>← Previous day</button>
        <button className="btn ghost" onClick={() => setDate(today())}>Today</button>
        <button className="btn ghost" onClick={() => ok && setDate(shiftDay(date, 1))} disabled={!ok}>Next day →</button>
      </div>
      <Field label="Date"><input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErr('') }} /></Field>
      {!ok ? <Msg>Pick a valid date to see or edit that day’s plan.</Msg> : <>
        <h2>{dayLabel(date)}</h2>
        <div className="row">
          <Field label="Time (optional)"><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
          <Field label="Task or appointment"><input value={text} maxLength={200} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} /></Field>
          <button className="btn" onClick={add}>Add to plan</button>
        </div>
        <Msg>{err}</Msg>
        {!items.length ? <div className="empty"><p>Nothing planned for this day yet.</p></div> : <>
          <p role="status"><strong>{done}</strong> of {items.length} done</p>
          <ul className="items">{items.map((i) => (
            <li className="item" key={i.id}>
              <label className="check"><input type="checkbox" checked={i.done} onChange={() => upd(i.id, (x) => ({ ...x, done: !x.done }))} />
                <span style={{ textDecoration: i.done ? 'line-through' : 'none', textTransform: 'none' }}>{i.time && <b>{i.time} </b>}{i.text}</span></label>
              <button className="btn ghost" onClick={() => save({ ...day, items: day.items.filter((x) => x.id !== i.id) })} aria-label={`Remove ${i.text}`}>Remove</button>
            </li>))}</ul></>}
        <Field label="Notes for the day"><textarea rows={3} value={day.notes} maxLength={2000} onChange={(e) => save({ ...day, notes: e.target.value })} /></Field>
        {(items.length > 0 || day.notes.trim()) && <>
          <h2>Copy, download or print</h2>
          <DocOut text={summary} title={`Daily plan ${date}`} filename={`daily-plan-${date}.txt`} />
          <div className="actions"><button className="btn ghost" onClick={() => window.confirm('Clear this whole day?') && save({ items: [], notes: '' })}>Clear this day</button></div>
        </>}
      </>}
      <p className="hint">Each day is saved separately in this browser only.</p>
    </div>
  )
}
