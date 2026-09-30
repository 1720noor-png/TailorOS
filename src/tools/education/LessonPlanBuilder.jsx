import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function LessonPlanBuilder() {
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('45')
  const [grade, setGrade] = useState('')
  const [objectives, setObjectives] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')

  const generate = () => {
    setErr(''); setResult('')
    if (!subject.trim()||!topic.trim()){setErr('Subject and topic are required.');return}
    const objs=objectives.trim()?objectives.trim().split('\n').filter(Boolean):['Students will understand '+topic]
    const d=Number(duration)||45,intro=Math.round(d*.15),main=Math.round(d*.6),wrap=d-intro-main
    setResult(['LESSON PLAN','═'.repeat(40),'Subject: '+subject,'Topic: '+topic,'Grade: '+(grade||'N/A'),'Duration: '+d+' min','','OBJECTIVES:',...objs.map((o,i)=>(i+1)+'. '+o),'','STRUCTURE:','• Introduction ('+intro+' min)','• Main Activity ('+main+' min)','• Wrap-up ('+wrap+' min)'].join('\n'))
  }

  return (
    <div>
      <div className="row">
        <Field label="Subject"><input type="text" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Mathematics" /></Field>
        <Field label="Topic"><input type="text" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Fractions" /></Field>
        <Field label="Duration (min)"><input type="number" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="" /></Field>
        <Field label="Grade Level"><input type="text" value={grade} onChange={e=>setGrade(e.target.value)} placeholder="Grade 5" /></Field>
        <Field label="Learning Objectives"><textarea rows={3} value={objectives} onChange={e=>setObjectives(e.target.value)} placeholder="One per line" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{result}</pre>
        <div className="actions"><CopyBtn text={result} /></div>
      </div>}
      <p className="hint">Customize for your classroom needs.</p>
    </div>
  )
}
