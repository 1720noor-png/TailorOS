import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function TextCaseConverterTool() {
  const [text, setText] = useState('hello world example text')
  const [mode, setMode] = useState('upper')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      if (!text.trim()) return setErr('Enter text to convert.')
      setErr('')
      let out = ''
      if (mode === 'upper') out = text.toUpperCase()
      else if (mode === 'lower') out = text.toLowerCase()
      else if (mode === 'title') out = text.replace(/\b\w/g, c => c.toUpperCase())
      else if (mode === 'sentence') out = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      else if (mode === 'camel') out = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      else if (mode === 'snake') out = text.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
      else if (mode === 'kebab') out = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
      setRes({ val: out, copyText: out })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setText('hello world example text'); setMode('upper'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Case Format">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
            <option value="title">Title Case</option>
            <option value="sentence">Sentence case</option>
            <option value="camel">camelCase</option>
            <option value="snake">snake_case</option>
            <option value="kebab">kebab-case</option>
          </select>
        </Field>
        
        <Field label="Input Text">
          <input type="text"  value={text} onChange={(e) => setText(e.target.value)} placeholder="" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}