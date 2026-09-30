import { useMemo, useState } from 'react'
import { Field } from '../../components/ui.jsx'

function analyze(text) {
  const words = text.trim() ? text.trim().split(/\s+/) : []
  const upperWords = words.filter((w) => w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w))
  const exclaims = (text.match(/!/g) || []).length
  const questions = (text.match(/\?/g) || []).length
  const negWords = ['never', 'no', 'not', "don't", "can't", 'stupid', 'wrong', 'fail', 'bad', 'hate', 'annoying', 'unacceptable']
  const posWords = ['thanks', 'great', 'appreciate', 'awesome', 'good', 'please', 'happy', 'love', 'excellent']
  const lower = text.toLowerCase()
  const negHits = negWords.filter((w) => lower.includes(w)).length
  const posHits = posWords.filter((w) => lower.includes(w)).length
  const flags = []
  if (upperWords.length > 0) flags.push(`${upperWords.length} ALL-CAPS word(s) can read as shouting.`)
  if (exclaims >= 3) flags.push('Multiple exclamation marks can come across as overly intense.')
  if (negHits > posHits + 1) flags.push('More negative than positive words — may read as blunt or critical.')
  if (!text.trim()) flags.push('')
  let overall = 'Neutral'
  if (posHits > negHits && exclaims <= 2 && upperWords.length === 0) overall = 'Warm / positive'
  else if (negHits > posHits || upperWords.length > 0) overall = 'Could read as harsh'
  return { flags: flags.filter(Boolean), overall, upperWords: upperWords.length, exclaims, questions }
}

export default function MessageToneChecker() {
  const [text, setText] = useState('')
  const a = useMemo(() => analyze(text), [text])
  return (
    <div>
      <Field label="Message"><textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your message before sending it…" /></Field>
      {text.trim() && <div className="out" role="status">
        <p>Likely reads as: <strong>{a.overall}</strong></p>
        {a.flags.length > 0 ? a.flags.map((f, i) => <p key={i} className="muted">• {f}</p>) : <p className="muted">No obvious tone flags found.</p>}
      </div>}
      <p className="hint">A simple heuristic check (capitalization, punctuation, common wording) — always re-read a message yourself before sending anything important.</p>
    </div>
  )
}
