import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function PigLatinConverter() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const convert = () => {
    if (!input.trim()) return
    setResult(input.split(/\s+/).map(w => {
      const m = w.match(/^([^aeiouAEIOU]*)(.*)/);
      return m[1] ? m[2] + m[1].toLowerCase() + 'ay' : w + 'way'
    }).join(' '))
  }
  return (
    <div>
      <Field label="English Text"><textarea rows={3} value={input} onChange={e=>setInput(e.target.value)} placeholder="Hello world" /></Field>
      <div className="actions"><button className="btn" onClick={convert}>Convert</button></div>
      {result && <div className="out" role="status"><p>{result}</p><CopyBtn text={result} /></div>}
      <p className="hint">Converts English to Pig Latin.</p>
    </div>
  )
}
