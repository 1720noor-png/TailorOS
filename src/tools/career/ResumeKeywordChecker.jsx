import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function ResumeKeywordChecker() {
  const [resume, setResume] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const check = () => {
    setErr(''); setResult(null)
    if (!resume.trim() || !jobDesc.trim()) { setErr('Enter both resume and job description.'); return }
    const jobWords = [...new Set(jobDesc.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/).filter(w => w.length > 3))]
    const resumeLower = resume.toLowerCase()
    const found = jobWords.filter(w => resumeLower.includes(w))
    const missing = jobWords.filter(w => !resumeLower.includes(w))
    const score = Math.round(found.length / jobWords.length * 100)
    setResult({ found, missing: missing.slice(0, 20), score })
  }
  return (
    <div>
      <div className="row">
        <Field label="Your Resume"><textarea rows={5} value={resume} onChange={e=>setResume(e.target.value)} placeholder="Paste resume text" /></Field>
        <Field label="Job Description"><textarea rows={5} value={jobDesc} onChange={e=>setJobDesc(e.target.value)} placeholder="Paste job description" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={check}>Analyze</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <p><strong>Match Score:</strong> {result.score}%</p>
        <p><strong>Keywords Found ({result.found.length}):</strong> {result.found.join(', ')}</p>
        {result.missing.length > 0 && <p><strong>Missing Keywords ({result.missing.length}):</strong> <span style={{color:'var(--red,#e53e3e)'}}>{result.missing.join(', ')}</span></p>}
      </div>}
      <p className="hint">Compare your resume against job descriptions.</p>
    </div>
  )
}
