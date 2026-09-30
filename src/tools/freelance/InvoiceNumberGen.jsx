import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function InvoiceNumberGen() {
  const [prefix, setPrefix] = useState('INV')
  const [year, setYear] = useState('')
  const [sequence, setSequence] = useState('1')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    const p=prefix.trim()||'INV',y=year.trim()||new Date().getFullYear(),s=parseInt(sequence)||1
    const nums=Array.from({length:10},(_,i)=>p+'-'+y+'-'+String(s+i).padStart(4,'0'))
    setResult(nums.join('\n'))
  }
  return (
    <div>
      <div className="row">
        <Field label="Prefix"><input type="text" value={prefix} onChange={e=>setPrefix(e.target.value)} placeholder="INV" /></Field>
        <Field label="Year"><input type="text" value={year} onChange={e=>setYear(e.target.value)} placeholder="2026" /></Field>
        <Field label="Starting Number"><input type="number" value={sequence} onChange={e=>setSequence(e.target.value)} placeholder="1" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Generates sequential invoice numbers.</p>
    </div>
  )
}
