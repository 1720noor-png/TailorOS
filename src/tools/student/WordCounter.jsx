import { useMemo, useState } from 'react'
import { Field } from '../../components/ui.jsx'

function stats(text) {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || (trimmed ? 1 : 0) : 0
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
  const readingMins = words / 200
  const speakingMins = words / 130
  return { words, chars, charsNoSpace, sentences, paragraphs, readingMins, speakingMins }
}
const fmtMins = (m) => (m < 1 ? `${Math.max(1, Math.round(m * 60))} sec` : `${Math.ceil(m)} min`)

export default function WordCounter() {
  const [text, setText] = useState('')
  const s = useMemo(() => stats(text), [text])
  return (
    <div>
      <Field label="Paste or type your text">
        <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing…" />
      </Field>
      <div className="actions"><button className="btn ghost" onClick={() => setText('')}>Clear</button></div>
      <div className="out" role="status">
        <p>Words: <strong>{s.words}</strong></p>
        <p>Characters: <strong>{s.chars}</strong> ({s.charsNoSpace} without spaces)</p>
        <p>Sentences: <strong>{s.sentences}</strong> · Paragraphs: <strong>{s.paragraphs}</strong></p>
        <p>Estimated reading time: <strong>{fmtMins(s.readingMins)}</strong> · Speaking time: <strong>{fmtMins(s.speakingMins)}</strong></p>
      </div>
      <p className="hint">Counted locally as you type — nothing is uploaded.</p>
    </div>
  )
}
