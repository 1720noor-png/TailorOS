import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function ClassAverageCalculator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter some text.'); return }
    const nums=input.split(/[,\s]+/).map(Number).filter(n=>!isNaN(n))
    if(nums.length<2){setErr('Enter at least 2 scores.');return}
    const mean=(nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(2)
    const sorted=[...nums].sort((a,b)=>a-b),mid=Math.floor(sorted.length/2)
    const median=sorted.length%2?sorted[mid]:((sorted[mid-1]+sorted[mid])/2).toFixed(2)
    const freq={};nums.forEach(n=>freq[n]=(freq[n]||0)+1);const mx=Math.max(...Object.values(freq))
    const modes=Object.keys(freq).filter(k=>freq[k]===mx).join(', ')
    setResult({mean,median,modes,min:sorted[0],max:sorted[sorted.length-1],count:nums.length,range:sorted[sorted.length-1]-sorted[0]})
  }

  return (
    <div>
      <Field label="Scores (comma separated)"><textarea rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder="85, 92, 78, 90" /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Count:</strong> {result.count}</p><p><strong>Mean:</strong> {result.mean} | <strong>Median:</strong> {result.median} | <strong>Mode:</strong> {result.modes}</p><p><strong>Range:</strong> {result.range} (Min: {result.min}, Max: {result.max})</p></div>}
      <p className="hint">Enter scores separated by commas or spaces.</p>
    </div>
  )
}
