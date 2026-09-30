import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function AltTextGenerator() {
  const [subject, setSubject] = useState('')
  const [context, setContext] = useState('')
  const [purpose, setPurpose] = useState('informative')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if (!subject.trim()) { setErr('Describe what is in the image.'); return }
    const s = subject.trim(), c = context.trim()
    if (purpose === 'decorative') { setResult('alt="" (decorative image — use empty alt)'); return }
    const suggestions = [
      s + (c ? ', ' + c : ''),
      (c ? c + ' showing ' : '') + s,
      'Image of ' + s + (c ? ' in the context of ' + c : ''),
    ]
    setResult('Suggestions:\n\n' + suggestions.map((s,i) => (i+1) + '. alt="' + s + '"').join('\n'))
  }
  return (
    <div>
      <Field label="What is in the image?"><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="A golden retriever playing fetch" /></Field>
      <Field label="Context (optional)"><input value={context} onChange={e=>setContext(e.target.value)} placeholder="Article about dog training" /></Field>
      <div className="row">
        <label><input type="radio" checked={purpose==='informative'} onChange={()=>setPurpose('informative')} /> Informative</label>
        <label><input type="radio" checked={purpose==='decorative'} onChange={()=>setPurpose('decorative')} /> Decorative</label>
        <label><input type="radio" checked={purpose==='functional'} onChange={()=>setPurpose('functional')} /> Functional (button/link)</label>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">Good alt text is concise and describes the image purpose.</p>
    </div>
  )
}
