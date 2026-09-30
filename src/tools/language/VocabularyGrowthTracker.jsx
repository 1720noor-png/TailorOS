import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, date: '', count: '' })

export default function VocabularyGrowthTracker() {
  const [lang, setLang] = useState('')
  const [entries, setEntries] = useState([blank(), blank()])
  const upd = (id, k, v) => setEntries((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const valid = entries.filter((e) => e.date && Number(e.count) >= 0).sort((a, b) => a.date.localeCompare(b.date))
  let rate = null
  if (valid.length >= 2) {
    const first = valid[0], last = valid[valid.length - 1]
    const days = (new Date(last.date) - new Date(first.date)) / 86400000
    if (days > 0) rate = ((Number(last.count) - Number(first.count)) / days) * 7
  }

  return (
    <div>
      <Field label="Language (optional)"><input value={lang} onChange={(e) => setLang(e.target.value)} placeholder="e.g. Spanish" /></Field>
      {entries.map((e, i) => (
        <div className="row" key={e.id}>
          <Field label={`Check-in ${i + 1} date`}><input type="date" value={e.date} onChange={(ev) => upd(e.id, 'date', ev.target.value)} /></Field>
          <Field label="Known words (total)"><input type="number" min="0" value={e.count} onChange={(ev) => upd(e.id, 'count', ev.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setEntries((x) => (x.length > 1 ? x.filter((y) => y.id !== e.id) : x))} aria-label={`Remove check-in ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setEntries((e) => [...e, blank()])}>Add check-in</button></div>
      {rate !== null && <p className="out" role="status">Growth rate: <strong>{rate.toFixed(1)} words/week</strong>{lang && <> in {lang}</>}</p>}
      <Msg kind="status">Add at least two dated check-ins to see your rate of growth.</Msg>
    </div>
  )
}
