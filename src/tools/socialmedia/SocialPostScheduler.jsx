import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function SocialPostScheduler() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult('')
    if (!input.trim()) { setErr('Enter some input.'); return }
    setResult(input.trim())
  }
  return (
    <div>
      <Field label="Input"><textarea rows={4} value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter data" /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">Enter data and process.</p>
    </div>
  )
}
