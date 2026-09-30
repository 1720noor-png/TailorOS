import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function WindspeedConverter() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const convert = () => {
    setErr(''); setResult('')
    if (!input.trim()) { setErr('Enter a value.'); return }
    setResult(input.trim())
  }
  return (
    <div>
      <Field label="Input"><input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter value" /></Field>
      <div className="actions"><button className="btn" onClick={convert}>Convert</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Result:</strong> {result}</p><CopyBtn text={result} /></div>}
      <p className="hint">Enter a value and convert.</p>
    </div>
  )
}
