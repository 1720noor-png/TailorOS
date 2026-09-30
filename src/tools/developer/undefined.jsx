import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const encode = () => { setErr(''); if(!input.trim()){setErr('Enter text.');return}; setResult(encodeURIComponent(input)) }
  const decode = () => { setErr(''); if(!input.trim()){setErr('Enter text.');return}; try{setResult(decodeURIComponent(input))}catch(e){setErr('Invalid encoded string.')} }
  return (
    <div>
      <Field label="Input"><textarea rows={3} value={input} onChange={e=>setInput(e.target.value)} placeholder="Hello World! or Hello%20World%21" /></Field>
      <div className="actions">
        <button className="btn" onClick={encode}>Encode</button>
        <button className="btn ghost" onClick={decode}>Decode</button>
      </div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p style={{wordBreak:'break-all'}}>{result}</p><CopyBtn text={result} /></div>}
      <p className="hint">Encode special characters for URLs or decode back.</p>
    </div>
  )
}
