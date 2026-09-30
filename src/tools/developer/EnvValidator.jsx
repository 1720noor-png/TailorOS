import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function EnvValidator() {
  const [vars, setVars] = useState('')
  const [format, setFormat] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if(!vars.trim()){setErr('Enter variable names.');return}
    const names=vars.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean)
    setResult('ENV VALIDATION CHECKLIST\n'+'═'.repeat(30)+'\n\n'+names.map((n,i)=>(i+1)+'. '+n+' — ⬜ Not set').join('\n')+'\n\nTotal: '+names.length+' variables to check')
  }
  return (
    <div>
      <div className="row">
        <Field label="Required Variables"><input type="text" value={vars} onChange={e=>setVars(e.target.value)} placeholder="API_KEY, DB_URL, PORT" /></Field>
        <Field label="Format"><input type="text" value={format} onChange={e=>setFormat(e.target.value)} placeholder=".env format" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">List required env vars for validation.</p>
    </div>
  )
}
