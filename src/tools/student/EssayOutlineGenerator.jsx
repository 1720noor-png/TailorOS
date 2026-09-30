import { useState } from 'react'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'

export default function EssayOutlineGenerator() {
  const [topic, setTopic] = useState('')
  const [thesis, setThesis] = useState('')
  const [points, setPoints] = useState(['', '', ''])
  const [style, setStyle] = useState('5')
  const [err, setErr] = useState('')

  const setPoint = (i, v) => setPoints(points.map((p, idx) => (idx === i ? v : p)))
  const addPoint = () => setPoints([...points, ''])
  const removePoint = (i) => setPoints(points.filter((_, idx) => idx !== i))

  const build = () => {
    if (!topic.trim()) return setErr('Enter an essay topic.'), ''
    const body = points.filter((p) => p.trim())
    if (!body.length) return setErr('Add at least one body point.'), ''
    setErr('')
    const lines = []
    lines.push(`${topic.trim()} — Essay Outline`)
    lines.push('')
    lines.push('I. Introduction')
    lines.push(`   - Hook / context for "${topic.trim()}"`)
    lines.push(`   - Thesis statement: ${thesis.trim() || '(write your thesis here)'}`)
    body.forEach((p, i) => {
      const n = i + 2
      lines.push('')
      lines.push(`${toRoman(n)}. ${p.trim()}`)
      lines.push('   - Supporting evidence / example')
      lines.push('   - Analysis: why this supports the thesis')
      if (style === '5' && i === body.length - 1) return
    })
    lines.push('')
    lines.push(`${toRoman(body.length + 2)}. Conclusion`)
    lines.push('   - Restate thesis in new words')
    lines.push('   - Summarize main points')
    lines.push('   - Closing thought / call to action')
    return lines.join('\n')
  }
  const toRoman = (n) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] || String(n)

  const [out, setOut] = useState('')
  const generate = () => setOut(build())

  return (
    <div>
      <div className="row">
        <Field label="Essay topic"><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. The impact of social media on teenagers" /></Field>
        <Field label="Thesis statement (optional)"><input value={thesis} onChange={(e) => setThesis(e.target.value)} /></Field>
      </div>
      <Field label="Body paragraph points">
        <div>
          {points.map((p, i) => (
            <div className="row" key={i}>
              <input value={p} onChange={(e) => setPoint(i, e.target.value)} placeholder={`Point ${i + 1}`} />
              {points.length > 1 && <button className="btn ghost" onClick={() => removePoint(i)} aria-label="Remove point">Remove</button>}
            </div>
          ))}
        </div>
      </Field>
      <div className="actions">
        <button className="btn ghost" onClick={addPoint}>Add point</button>
        <button className="btn" onClick={generate}>Generate outline</button>
      </div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{out}</pre>
        <div className="actions">
          <CopyBtn text={out} label="Copy outline" />
          <button className="btn ghost" onClick={() => download('essay-outline.txt', out)}>Download .txt</button>
        </div>
      </div>}
      <p className="hint">A starting structure — fill in the evidence and analysis yourself.</p>
    </div>
  )
}
