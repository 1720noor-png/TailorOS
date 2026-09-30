import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function ParagraphCounter() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter text.'); return }
    const paras=input.split(/\n\s*\n/).filter(p=>p.trim())
    const words=input.split(/\s+/).filter(Boolean)
    const sentences=input.split(/[.!?]+/).filter(s=>s.trim())
    const avgWords=paras.length?Math.round(words.length/paras.length):0
    setResult({paras:paras.length,words:words.length,sentences:sentences.length,avgWords})
  }
  return (
    <div>
      <Field label="Text"><textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste your text..." /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Paragraphs:</strong> {result.paras}</p><p><strong>Words:</strong> {result.words}</p><p><strong>Sentences:</strong> {result.sentences}</p><p><strong>Avg words/paragraph:</strong> {result.avgWords}</p></div>}
      <p className="hint">Separate paragraphs with blank lines.</p>
    </div>
  )
}
