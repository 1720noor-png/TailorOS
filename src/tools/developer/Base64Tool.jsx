import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
export default function Base64Tool() {
  const [mode, setMode] = useState('encode')
  const [src, setSrc] = useState('')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const run = () => {
    setOut('')
    if (!src) return setErr('Enter some text first.')
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(src)
        setOut(btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join('')))
      } else {
        const bin = atob(src.trim().replace(/-/g, '+').replace(/_/g, '/'))
        setOut(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))))
      }
      setErr('')
    } catch { setErr(mode === 'decode' ? 'This is not valid Base64 text (or it does not contain UTF-8 text).' : 'Could not encode this text.') }
  }
  const reset = () => { setSrc(''); setOut(''); setErr('') }
  return (
    <div>
      <Field label="Mode"><select value={mode} onChange={(e) => { setMode(e.target.value); setOut(''); setErr('') }}><option value="encode">Encode text to Base64</option><option value="decode">Decode Base64 to text</option></select></Field>
      <Field label="Input"><textarea rows="6" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck="false" /></Field>
      <div className="actions"><button className="btn" onClick={run}>Convert</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <><Field label="Output"><textarea rows="6" readOnly value={out} /></Field><div className="actions"><CopyBtn text={out} /></div></>}
      <p className="hint">Processed locally in your browser.</p>
    </div>
  )
}
