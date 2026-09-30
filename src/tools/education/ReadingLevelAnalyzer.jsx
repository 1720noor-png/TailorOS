import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function ReadingLevelAnalyzer() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const process = () => {
    setErr(''); setResult(null)
    if (!input.trim()) { setErr('Please enter some text.'); return }
    const t=input.trim(),ss=t.split(/[.!?]+/).filter(s=>s.trim()),ws=t.split(/\s+/).filter(Boolean)
    const sy=ws.reduce((sum,w)=>{let s=w.toLowerCase().replace(/[^a-z]/g,'');if(s.length<=3)return sum+1;s=s.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');const m=s.match(/[aeiouy]{1,2}/g);return sum+(m?m.length:1)},0)
    if(ws.length<10){setErr('Enter at least 10 words.');return}
    const avgSy=sy/ws.length,avgSe=ws.length/Math.max(ss.length,1)
    const grade=(0.39*avgSe+11.8*avgSy-15.59).toFixed(1)
    const ease=(206.835-1.015*avgSe-84.6*avgSy).toFixed(1)
    let lvl='College+';if(ease>=90)lvl='Very easy (5th)';else if(ease>=80)lvl='Easy (6th)';else if(ease>=70)lvl='Fairly easy (7th)';else if(ease>=60)lvl='Standard (8-9th)';else if(ease>=50)lvl='Fairly hard (10-12th)';else if(ease>=30)lvl='Difficult (College)'
    setResult({words:ws.length,sentences:ss.length,grade,ease,lvl})
  }

  return (
    <div>
      <Field label="Text to analyze"><textarea rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder="Paste text here..." /></Field>
      <div className="actions"><button className="btn" onClick={process}>Process</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Words:</strong> {result.words} | <strong>Sentences:</strong> {result.sentences}</p><p><strong>Grade Level:</strong> {result.grade}</p><p><strong>Reading Ease:</strong> {result.ease} — {result.lvl}</p></div>}
      <p className="hint">Flesch-Kincaid is standard in US education.</p>
    </div>
  )
}
