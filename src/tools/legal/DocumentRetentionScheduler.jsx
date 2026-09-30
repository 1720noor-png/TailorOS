import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function DocumentRetentionScheduler() {
  const [name1, setName1] = useState('')
  const [details, setDetails] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')

  const generate = () => {
    setErr(''); setResult('')
    if(!name1.trim()){setErr('Enter a name.');return}
    setResult('DOCUMENT RETENTION SCHEDULER\n════════════════════════════════════════\nPrepared for: '+name1.trim()+'\n\n'+(details.trim()||'Details to be filled in.')+'\n\nDate: '+new Date().toLocaleDateString()+'\n\n[This is a template. Consult a legal professional.]')
  }

  return (
    <div>
      <div className="row">
        <Field label="Name/Party"><input type="text" value={name1} onChange={e=>setName1(e.target.value)} placeholder="Your name or company" /></Field>
        <Field label="Key Details"><textarea rows={3} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Describe the situation" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{result}</pre>
        <div className="actions"><CopyBtn text={result} /></div>
      </div>}
      <p className="hint">This is a template only. Consult a lawyer.</p>
    </div>
  )
}
