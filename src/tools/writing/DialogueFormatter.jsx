import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function DialogueFormatter() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter text.'); return }
    const lines=input.trim().split('\n').filter(l=>l.trim())
    const formatted=lines.map(l=>{const m=l.match(/^([^:]+):\s*(.+)/);if(!m)return l;return '"'+m[2].trim()+'" '+m[1].trim()+' said.'}).join('\n\n')
    setResult({text:formatted})
  }
  return (
    <div>
      <Field label="Dialogue (Name: text, one per line)"><textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="John: Hello there\nJane: Hi!" /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result.text}</pre><CopyBtn text={result.text} /></div>}
      <p className="hint">Format: Name: dialogue text</p>
    </div>
  )
}
