import { useMemo, useState } from 'react'
import { Field } from '../../components/ui.jsx'

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  const matches = word.match(/[aeiouy]+/g)
  let count = matches ? matches.length : 1
  if (word.endsWith('e') && count > 1) count--
  return Math.max(1, count)
}
function analyze(text) {
  const words = (text.trim().match(/[A-Za-z']+/g) || [])
  const sentences = (text.trim().match(/[.!?]+(\s|$)/g) || (text.trim() ? [1] : [])).length
  const syllables = words.reduce((s, w) => s + countSyllables(w), 0)
  const w = words.length || 1
  const s = sentences || 1
  const fkGrade = 0.39 * (w / s) + 11.8 * (syllables / w) - 15.59
  const flesch = 206.835 - 1.015 * (w / s) - 84.6 * (syllables / w)
  const level = flesch >= 90 ? 'Very easy (5th grade)' : flesch >= 70 ? 'Easy (7th grade)' : flesch >= 60 ? 'Standard (8th-9th grade)' : flesch >= 50 ? 'Fairly difficult (college)' : flesch >= 30 ? 'Difficult (college graduate)' : 'Very difficult'
  return { words: words.length, fkGrade: Math.max(0, fkGrade), flesch, level }
}

export default function ReadabilityScoreChecker() {
  const [text, setText] = useState('')
  const a = useMemo(() => analyze(text), [text])
  return (
    <div>
      <Field label="Text to check"><textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      {a.words > 0 && <div className="out" role="status">
        <p>Flesch Reading Ease: <strong>{a.flesch.toFixed(1)}</strong> — {a.level}</p>
        <p>Flesch-Kincaid Grade Level: <strong>{a.fkGrade.toFixed(1)}</strong></p>
      </div>}
      <p className="hint">Standard readability formulas based on sentence length and syllable count — a guide, not a precise measure.</p>
    </div>
  )
}
