import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function WorkReferenceTemplate() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [duration, setDuration] = useState('')
  const [strengths, setStrengths] = useState('')
  const [result, setResult] = useState('')
  const generate = () => {
    if (!name.trim()) return
    setResult('LETTER OF REFERENCE\n'+'═'.repeat(30)+'\n\nTo Whom It May Concern,\n\nI am writing to recommend '+name.trim()+' who served as '+(role||'a valued team member')+' at '+(company||'our organization')+' for '+(duration||'their tenure')+'.\n\nDuring this time, '+name.split(' ')[0]+' demonstrated '+
    (strengths||'exceptional skills, strong work ethic, and excellent teamwork')+'.\n\nI highly recommend '+name.split(' ')[0]+' for any future endeavors.\n\nSincerely,\n[Your Name]\n[Your Title]\n'+new Date().toLocaleDateString())
  }
  return (
    <div>
      <div className="row">
        <Field label="Employee Name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Smith" /></Field>
        <Field label="Their Role"><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Senior Developer" /></Field>
      </div>
      <div className="row">
        <Field label="Company"><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Acme Corp" /></Field>
        <Field label="Duration"><input value={duration} onChange={e=>setDuration(e.target.value)} placeholder="2 years" /></Field>
      </div>
      <Field label="Key Strengths"><textarea rows={2} value={strengths} onChange={e=>setStrengths(e.target.value)} placeholder="Leadership, technical excellence..." /></Field>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">Customize the template with specific achievements.</p>
    </div>
  )
}
