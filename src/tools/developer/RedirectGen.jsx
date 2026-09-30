import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function RedirectGen() {
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')

  const generate = () => {
    setErr(''); setResult('')
    if(!input1.trim()){setErr('Please fill in the main field.');return}
    setResult('REDIRECT RULE GENERATOR\n══════════════════════════════\n\n'+input1.trim()+'\n\n'+(input2.trim()||'')+'\n\nGenerated: '+new Date().toLocaleDateString())
  }

  return (
    <div>
      <div className="row">
        <Field label="Main Input"><input type="text" value={input1} onChange={e=>setInput1(e.target.value)} placeholder="Enter details" /></Field>
        <Field label="Additional Info"><textarea rows={3} value={input2} onChange={e=>setInput2(e.target.value)} placeholder="More details" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{result}</pre>
        <div className="actions"><CopyBtn text={result} /></div>
      </div>}
      <p className="hint">Fill in details and generate.</p>
    </div>
  )
}
