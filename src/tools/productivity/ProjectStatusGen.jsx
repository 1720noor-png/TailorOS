import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function ProjectStatusGen() {
  const [project, setProject] = useState('')
  const [status, setStatus] = useState('')
  const [completed, setCompleted] = useState('')
  const [upcoming, setUpcoming] = useState('')
  const [blockers, setBlockers] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if(!project.trim()){setErr('Enter project name.');return}
    setResult('PROJECT STATUS UPDATE\n'+'═'.repeat(30)+'\n\nProject: '+project.trim()+'\nStatus: '+(status.trim()||'In Progress')+'\nDate: '+new Date().toLocaleDateString()+'\n\nCOMPLETED:\n'+(completed.trim()||'None listed')+'\n\nUPCOMING:\n'+(upcoming.trim()||'None listed')+'\n\nBLOCKERS:\n'+(blockers.trim()||'None'))
  }
  return (
    <div>
      <div className="row">
        <Field label="Project Name"><input type="text" value={project} onChange={e=>setProject(e.target.value)} placeholder="Website Redesign" /></Field>
        <Field label="Status"><input type="text" value={status} onChange={e=>setStatus(e.target.value)} placeholder="On Track" /></Field>
        <Field label="Completed"><textarea rows={3} value={completed} onChange={e=>setCompleted(e.target.value)} placeholder="" /></Field>
        <Field label="Upcoming"><textarea rows={3} value={upcoming} onChange={e=>setUpcoming(e.target.value)} placeholder="" /></Field>
        <Field label="Blockers"><textarea rows={3} value={blockers} onChange={e=>setBlockers(e.target.value)} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Generate weekly status reports.</p>
    </div>
  )
}
