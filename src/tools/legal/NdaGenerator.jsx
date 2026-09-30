import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function NdaGenerator() {
  const [party1, setParty1] = useState('')
  const [party2, setParty2] = useState('')
  const [purpose, setPurpose] = useState('')
  const [duration, setDuration] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')

  const generate = () => {
    setErr(''); setResult('')
    if(!party1.trim()||!party2.trim()){setErr('Both parties required.');return}
    setResult(['NON-DISCLOSURE AGREEMENT','═'.repeat(40),'','This NDA is entered between:','Party 1: '+party1.trim(),'Party 2: '+party2.trim(),'','Purpose: '+(purpose.trim()||'Confidential discussions'),'Duration: '+(duration.trim()||'2 years'),'','TERMS:','1. Both parties agree to keep all shared information confidential.','2. Confidential information includes business plans, financial data, and trade secrets.','3. This agreement is effective from the date of signing.','4. Breach of this agreement may result in legal action.','','SIGNATURES:','','Party 1: ___________________ Date: ___________','','Party 2: ___________________ Date: ___________'].join('\n'))
  }

  return (
    <div>
      <div className="row">
        <Field label="First Party"><input type="text" value={party1} onChange={e=>setParty1(e.target.value)} placeholder="Company A" /></Field>
        <Field label="Second Party"><input type="text" value={party2} onChange={e=>setParty2(e.target.value)} placeholder="Company B" /></Field>
        <Field label="Purpose"><input type="text" value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder="Business discussions" /></Field>
        <Field label="Duration"><input type="text" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="2 years" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{result}</pre>
        <div className="actions"><CopyBtn text={result} /></div>
      </div>}
      <p className="hint">This is a template only. Consult a lawyer for binding agreements.</p>
    </div>
  )
}
