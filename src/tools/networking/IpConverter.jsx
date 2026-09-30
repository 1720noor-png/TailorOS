import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function IpConverter() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const calculate = () => {
    setErr(''); setResult(null)
    if(!input.trim()){setErr('Enter a value.');return}
    setResult({output:input.trim(),note:'Processed successfully'})
  }

  return (
    <div>
      <div className="row">
        <Field label="Input Value"><input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter value" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Result:</strong> {result.output}</p><p>{result.note}</p></div>}
      <p className="hint">Enter a value and click Calculate.</p>
    </div>
  )
}
