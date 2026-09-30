import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function InterviewPrepGen() {
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [result, setResult] = useState('')
  const generate = () => {
    if (!role.trim()) return
    const questions = [
      'Tell me about yourself and why you are interested in this '+role+' role.',
      'What relevant experience do you bring to this position?',
      'Describe a challenging project you have worked on.',
      'How do you handle tight deadlines and pressure?',
      'Where do you see yourself in 5 years?',
      'Why do you want to work at '+(company||'our company')+'?',
      'What is your greatest professional achievement?',
      'How do you stay current with industry trends?',
      'Describe a time you resolved a conflict at work.',
      'Do you have any questions for us?'
    ]
    setResult('INTERVIEW PREP: '+role.toUpperCase()+(company?' at '+company:'')+
      '\n'+'═'.repeat(40)+'\n\n'+
      questions.map((q,i) => (i+1)+'. '+q+'\n   Your answer: ________________').join('\n\n'))
  }
  return (
    <div>
      <div className="row">
        <Field label="Role"><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Software Engineer" /></Field>
        <Field label="Company"><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Google" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">Practice answering each question aloud.</p>
    </div>
  )
}
