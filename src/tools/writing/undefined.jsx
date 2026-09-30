import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function WhitespaceCleaner() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const clean = () => {
    setErr(''); setResult('')
    if (!input) { setErr('Enter text to clean.'); return }
    let cleaned = input
      .replace(/\t/g, ' ')
      .replace(/ +/g, ' ')
      .replace(/^ +| +$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    const origLen = input.length, newLen = cleaned.length
    setResult(cleaned)
  }
  return (
    <div>
      <Field label="Text with messy whitespace"><textarea rows={6} value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste  text   with   extra    spaces..." /></Field>
      <div className="actions"><button className="btn" onClick={clean}>Clean</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <p style={{fontSize:'.85rem',color:'#888'}}>Cleaned: {input.length} → {result.length} chars ({input.length - result.length} removed)</p>
        <pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre>
        <CopyBtn text={result} />
      </div>}
      <p className="hint">Removes extra spaces, tabs, and blank lines.</p>
    </div>
  )
}
