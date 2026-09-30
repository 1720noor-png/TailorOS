import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function IrrigationPlanner() {
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')

  const generate = () => {
    setErr(''); setResult('')
    if(!input1.trim()){setErr('Please enter the main input.');return}
    const lines=['IRRIGATION SCHEDULE PLANNER','══════════════════════════════','','Input: '+input1.trim(),'','Details:',input2.trim()||'None specified','','Generated: '+new Date().toLocaleDateString()]
    setResult(lines.join('\n'))
  }

  return (
    <div>
      <div className="row">
        <Field label="Main Input"><input type="text" value={input1} onChange={e=>setInput1(e.target.value)} placeholder="Enter details" /></Field>
        <Field label="Additional Details"><textarea rows={3} value={input2} onChange={e=>setInput2(e.target.value)} placeholder="Enter more details" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{result}</pre>
        <div className="actions"><CopyBtn text={result} /></div>
      </div>}
      <p className="hint">Fill in the fields and click Generate.</p>
    </div>
  )
}
