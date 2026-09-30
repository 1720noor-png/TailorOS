import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
export default function HashGenerator() {
  const [alg, setAlg] = useState('SHA-256')
  const [txt, setTxt] = useState('')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const run = async () => {
    setOut('')
    if (!txt) return setErr('Enter some text to hash.')
    if (!window.crypto?.subtle) return setErr('Web Crypto needs a secure context (HTTPS or localhost).')
    setBusy(true)
    try {
      const buf = await crypto.subtle.digest(alg, new TextEncoder().encode(txt))
      setOut(Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join(''))
      setErr('')
    } catch (e) { setErr('Hashing failed: ' + e.message) } finally { setBusy(false) }
  }
  const reset = () => { setTxt(''); setOut(''); setErr('') }
  return (
    <div>
      <Field label="Algorithm"><select value={alg} onChange={(e) => setAlg(e.target.value)}>{['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map((a) => <option key={a}>{a}</option>)}</select></Field>
      <Field label="Text"><textarea rows="5" value={txt} onChange={(e) => setTxt(e.target.value)} spellCheck="false" /></Field>
      <div className="actions"><button className="btn" onClick={run} disabled={busy}>{busy ? 'Hashing…' : 'Generate hash'}</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out"><code>{out}</code><CopyBtn text={out} /></div>}
      <p className="hint">Hashed locally with the Web Crypto API. MD5 is not supported by browsers and is not offered. SHA-1 is legacy; prefer SHA-256 or higher.</p>
    </div>
  )
}
