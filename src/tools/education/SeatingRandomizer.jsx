import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function SeatingRandomizer() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter some text.'); return }
    const names=input.trim().split('\n').filter(n=>n.trim())
    if(names.length<2){setErr('Enter at least 2 names.');return}
    const shuffled=[...names].sort(()=>Math.random()-0.5)
    setResult({list:shuffled.map((n,i)=>({seat:i+1,name:n.trim()}))})
  }

  return (
    <div>
      <Field label="Student Names (one per line)"><textarea rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder="Alice\nBob\nCharlie" /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:'4px'}}>Seat</th><th style={{textAlign:'left',padding:'4px'}}>Student</th></tr></thead><tbody>{result.list.map(r=><tr key={r.seat}><td style={{padding:'4px'}}>{r.seat}</td><td style={{padding:'4px'}}>{r.name}</td></tr>)}</tbody></table></div>}
      <p className="hint">Click Process again for a new random arrangement.</p>
    </div>
  )
}
