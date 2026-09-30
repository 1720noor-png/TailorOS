import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function RepetitionFinder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter text.'); return }
    const words=input.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/).filter(w=>w.length>3)
    const freq={};words.forEach(w=>freq[w]=(freq[w]||0)+1)
    const repeated=Object.entries(freq).filter(([,c])=>c>2).sort((a,b)=>b[1]-a[1])
    setResult({repeated,total:words.length})
  }
  return (
    <div>
      <Field label="Text"><textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter your text..." /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Words repeated 3+ times</strong> (of {result.total} total):</p>{result.repeated.map(([w,c],i)=><p key={i}>• {w}: {c}×</p>)}{result.repeated.length===0&&<p>No excessive repetitions found.</p>}</div>}
      <p className="hint">Finds words used more than twice (4+ letters).</p>
    </div>
  )
}
