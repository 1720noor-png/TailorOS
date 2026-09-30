import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function CrontabGenerator() {
  const [minute, setMinute] = useState('')
  const [hour, setHour] = useState('')
  const [dom, setDom] = useState('')
  const [month, setMonth] = useState('')
  const [dow, setDow] = useState('')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    const expr=[minute||'*',hour||'*',dom||'*',month||'*',dow||'*'].join(' ')
    setResult('Crontab Expression: '+expr+'\n\nFields:\n• Minute: '+(minute||'*')+'\n• Hour: '+(hour||'*')+'\n• Day of Month: '+(dom||'*')+'\n• Month: '+(month||'*')+'\n• Day of Week: '+(dow||'*'))
  }
  return (
    <div>
      <div className="row">
        <Field label="Minute"><input type="text" value={minute} onChange={e=>setMinute(e.target.value)} placeholder="*" /></Field>
        <Field label="Hour"><input type="text" value={hour} onChange={e=>setHour(e.target.value)} placeholder="*" /></Field>
        <Field label="Day of Month"><input type="text" value={dom} onChange={e=>setDom(e.target.value)} placeholder="*" /></Field>
        <Field label="Month"><input type="text" value={month} onChange={e=>setMonth(e.target.value)} placeholder="*" /></Field>
        <Field label="Day of Week"><input type="text" value={dow} onChange={e=>setDow(e.target.value)} placeholder="*" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><div className="actions"><CopyBtn text={result} /></div></div>}
      <p className="hint">Use * for any, */5 for every 5, 1-5 for range.</p>
    </div>
  )
}
