import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function AlliterationFinder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter text.'); return }
    const words=input.trim().split(/\s+/)
    const pairs=[];for(let i=0;i<words.length-1;i++){
      const a=words[i].replace(/[^a-zA-Z]/g,'')[0],b=words[i+1].replace(/[^a-zA-Z]/g,'')[0]
      if(a&&b&&a.toLowerCase()===b.toLowerCase())pairs.push(words[i]+' '+words[i+1])
    }
    setResult({pairs,count:pairs.length})
  }
  return (
    <div>
      <Field label="Text"><textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter your text..." /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>{result.count} alliterative pairs found:</strong></p>{result.pairs.map((p,i)=><p key={i}>• {p}</p>)}{result.count===0&&<p>No alliteration detected.</p>}</div>}
      <p className="hint">Finds adjacent words starting with the same letter.</p>
    </div>
  )
}
