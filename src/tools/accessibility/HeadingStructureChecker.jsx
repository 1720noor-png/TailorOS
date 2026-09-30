import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function HeadingStructureChecker() {
  const [html, setHtml] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const check = () => {
    setErr(''); setResult(null)
    if (!html.trim()) { setErr('Paste HTML with headings.'); return }
    const headings = [...html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi)].map(m => ({level:parseInt(m[1]),text:m[2].replace(/<[^>]*>/g,'')}))
    if (!headings.length) { setErr('No headings found.'); return }
    const issues = []
    if (headings[0].level !== 1) issues.push('Page should start with H1')
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level > headings[i-1].level + 1) issues.push('H' + headings[i].level + ' skips level after H' + headings[i-1].level + ' ("' + headings[i].text.slice(0,30) + '")')
    }
    const h1Count = headings.filter(h => h.level === 1).length
    if (h1Count > 1) issues.push('Multiple H1 tags found (' + h1Count + ')')
    setResult({headings, issues})
  }
  return (
    <div>
      <Field label="HTML Content"><textarea rows={6} value={html} onChange={e=>setHtml(e.target.value)} placeholder="<h1>Title</h1>\n<h2>Section</h2>..." /></Field>
      <div className="actions"><button className="btn" onClick={check}>Check Structure</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <p><strong>Heading Outline:</strong></p>
        {result.headings.map((h,i) => <p key={i} style={{paddingLeft:(h.level-1)*16}}>{'  '.repeat(h.level-1)}H{h.level}: {h.text}</p>)}
        {result.issues.length > 0 ? <div style={{marginTop:12,color:'var(--red,#e53e3e)'}}><p><strong>Issues:</strong></p>{result.issues.map((iss,i)=><p key={i}>⚠️ {iss}</p>)}</div> : <p style={{color:'#38a169',marginTop:12}}>✅ Heading structure looks good!</p>}
      </div>}
      <p className="hint">Proper heading hierarchy is essential for screen readers.</p>
    </div>
  )
}
