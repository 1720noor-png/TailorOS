import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function SemanticVersionBump() {
  const [version, setVersion] = useState('')
  const [bump, setBump] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const parts=(version||'0.0.0').split('.').map(Number)
    if(parts.length!==3||parts.some(isNaN)){setErr('Enter valid semver (e.g., 1.2.3)');return}
    const b=(bump||'patch').toLowerCase()
    if(b==='major'){parts[0]++;parts[1]=0;parts[2]=0}
    else if(b==='minor'){parts[1]++;parts[2]=0}
    else{parts[2]++}
    setResult({v:parts.join('.'),type:b})
  }
  return (
    <div>
      <div className="row">
        <Field label="Current Version"><input type="text" value={version} onChange={e=>setVersion(e.target.value)} placeholder="1.2.3" /></Field>
        <Field label="Bump Type"><input type="text" value={bump} onChange={e=>setBump(e.target.value)} placeholder="patch" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>New Version:</strong> {result.v} ({result.type})</p></div>}
      <p className="hint">Enter current version and bump type (major/minor/patch).</p>
    </div>
  )
}
