import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function DomainNameGen() {
  const [keywords, setKeywords] = useState('')
  const [tlds, setTlds] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if(!keywords.trim()){setErr('Enter keywords.');return}
    const words=keywords.trim().split(/\s+/)
    const tlds=(tlds||'.com').split(/[,\s]+/).filter(Boolean)
    const combos=[]
    words.forEach(w=>{tlds.forEach(t=>{combos.push(w+t);combos.push('get'+w+t);combos.push(w+'hub'+t);combos.push(w+'ly'+t)})})
    if(words.length>=2){tlds.forEach(t=>{combos.push(words.join('')+t);combos.push(words[0]+words[1]+t)})}
    setResult(combos.join('\n'))
  }
  return (
    <div>
      <div className="row">
        <Field label="Keywords"><input type="text" value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="tech startup" /></Field>
        <Field label="TLDs"><input type="text" value={tlds} onChange={e=>setTlds(e.target.value)} placeholder=".com, .io, .co" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Generates domain name ideas from keywords.</p>
    </div>
  )
}
