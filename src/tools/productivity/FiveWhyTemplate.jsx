import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function FiveWhyTemplate() {
  const [problem, setProblem] = useState('')
  const [why1, setWhy1] = useState('')
  const [why2, setWhy2] = useState('')
  const [why3, setWhy3] = useState('')
  const [why4, setWhy4] = useState('')
  const [why5, setWhy5] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if(!problem.trim()){setErr('Enter the problem.');return}
    const whys=[why1,why2,why3,why4,why5].filter(w=>w.trim())
    setResult('5 WHYS ANALYSIS\n'+'═'.repeat(30)+'\n\nProblem: '+problem.trim()+'\n'+whys.map((w,i)=>'\nWhy '+(i+1)+': '+w.trim()).join('')+'\n\nRoot Cause: '+(whys[whys.length-1]||'(analyze further)').trim())
  }
  return (
    <div>
      <div className="row">
        <Field label="Problem Statement"><input type="text" value={problem} onChange={e=>setProblem(e.target.value)} placeholder="Delivery was late" /></Field>
        <Field label="Why 1"><input type="text" value={why1} onChange={e=>setWhy1(e.target.value)} placeholder="" /></Field>
        <Field label="Why 2"><input type="text" value={why2} onChange={e=>setWhy2(e.target.value)} placeholder="" /></Field>
        <Field label="Why 3"><input type="text" value={why3} onChange={e=>setWhy3(e.target.value)} placeholder="" /></Field>
        <Field label="Why 4"><input type="text" value={why4} onChange={e=>setWhy4(e.target.value)} placeholder="" /></Field>
        <Field label="Why 5"><input type="text" value={why5} onChange={e=>setWhy5(e.target.value)} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Dig to root cause by asking why repeatedly.</p>
    </div>
  )
}
