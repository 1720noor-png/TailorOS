import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function LinkedinHeadlineGen() {
  const [role, setRole] = useState('')
  const [skills, setSkills] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    if (!role.trim()) { setErr('Enter your role.'); return }
    const templates = [
      role + ' | ' + (skills || 'Passionate Professional') + ' | ' + (value || 'Driving Results'),
      (skills || 'Expert') + ' ' + role + ' — ' + (value || 'Helping Teams Succeed'),
      role + ' specializing in ' + (skills || 'innovation') + ' | ' + (value || 'Open to Opportunities'),
      'Experienced ' + role + ' | ' + (skills || 'Problem Solver') + ' | ' + (value || 'Let\'s Connect'),
    ]
    setResult(templates.join('\n\n'))
  }
  return (
    <div>
      <div className="row">
        <Field label="Role/Title"><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Product Manager" /></Field>
        <Field label="Key Skills"><input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Strategy, Data Analytics" /></Field>
        <Field label="Value Prop"><input value={value} onChange={e=>setValue(e.target.value)} placeholder="Growing SaaS Products" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate Headlines</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">Choose the headline that best represents your brand.</p>
    </div>
  )
}
