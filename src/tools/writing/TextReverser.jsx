import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function TextReverser() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter text.'); return }
    const charRev=[...input].reverse().join('')
    const wordRev=input.split(/\s+/).reverse().join(' ')
    setResult({charRev,wordRev})
  }
  return (
    <div>
      <Field label="Text to Reverse"><textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="Hello World" /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Characters reversed:</strong> {result.charRev}</p><p><strong>Words reversed:</strong> {result.wordRev}</p><CopyBtn text={result.charRev} /></div>}
      <p className="hint">Reverse by characters or by words.</p>
    </div>
  )
}
