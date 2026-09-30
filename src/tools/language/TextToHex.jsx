import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function TextToHex() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('encode')
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const convert = () => {
    setErr(''); setResult('')
    if (!input.trim()) { setErr('Enter text.'); return }
    if (mode === 'encode') {
      setResult(input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '))
    } else {
      try { setResult(input.trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join('')) }
      catch(e) { setErr('Invalid hex.') }
    }
  }
  return (
    <div>
      <div className="row">
        <label><input type="radio" checked={mode==='encode'} onChange={()=>setMode('encode')} /> Text → Hex</label>
        <label><input type="radio" checked={mode==='decode'} onChange={()=>setMode('decode')} /> Hex → Text</label>
      </div>
      <Field label="Input"><textarea rows={3} value={input} onChange={e=>setInput(e.target.value)} /></Field>
      <div className="actions"><button className="btn" onClick={convert}>Convert</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><pre style={{whiteSpace:'pre-wrap',font:'inherit'}}>{result}</pre><CopyBtn text={result} /></div>}
      <p className="hint">ASCII text to/from hexadecimal.</p>
    </div>
  )
}
