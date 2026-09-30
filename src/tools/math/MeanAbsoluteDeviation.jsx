import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function MeanAbsoluteDeviation() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter text.'); return }
    const nums=input.split(/[,\s]+/).map(Number).filter(n=>!isNaN(n))
    if(nums.length<2){setErr('Enter at least 2 numbers.');return}
    const mean=nums.reduce((a,b)=>a+b,0)/nums.length
    const mad=nums.reduce((s,n)=>s+Math.abs(n-mean),0)/nums.length
    setResult({mean:mean.toFixed(4),mad:mad.toFixed(4),count:nums.length})
  }
  return (
    <div>
      <Field label="Numbers (comma separated)"><textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="3, 7, 5, 12, 8" /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Mean:</strong> {result.mean}</p><p><strong>MAD:</strong> {result.mad}</p><p><strong>Count:</strong> {result.count}</p></div>}
      <p className="hint">Mean Absolute Deviation from the mean.</p>
    </div>
  )
}
