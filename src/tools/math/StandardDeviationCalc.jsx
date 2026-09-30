import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function StandardDeviationCalc() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter text.'); return }
    const nums=input.split(/[,\s]+/).map(Number).filter(n=>!isNaN(n))
    if(nums.length<2){setErr('Enter at least 2 numbers.');return}
    const mean=nums.reduce((a,b)=>a+b,0)/nums.length
    const variance=nums.reduce((s,n)=>s+Math.pow(n-mean,2),0)/nums.length
    const sd=Math.sqrt(variance)
    setResult({mean:mean.toFixed(4),variance:variance.toFixed(4),sd:sd.toFixed(4),count:nums.length})
  }
  return (
    <div>
      <Field label="Numbers (comma separated)"><textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="10, 12, 23, 23, 16, 23, 21, 16" /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Mean:</strong> {result.mean}</p><p><strong>Variance:</strong> {result.variance}</p><p><strong>Std Dev:</strong> {result.sd}</p><p><strong>Count:</strong> {result.count}</p></div>}
      <p className="hint">Population standard deviation.</p>
    </div>
  )
}
