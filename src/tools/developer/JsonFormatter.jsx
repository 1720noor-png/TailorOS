import { useState } from 'react'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'
export default function JsonFormatter() {
  const [src, setSrc] = useState('')
  const [ind, setInd] = useState('2')
  const [out, setOut] = useState('')
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const run = (min) => {
    setOut(''); setOk('')
    if (!src.trim()) return setErr('Paste some JSON first.')
    try {
      const v = JSON.parse(src)
      setOut(JSON.stringify(v, null, min ? 0 : ind === 'tab' ? '\t' : Number(ind)))
      setErr(''); setOk('Valid JSON')
    } catch (e) { setErr('Invalid JSON: ' + e.message) }
  }
  const reset = () => { setSrc(''); setOut(''); setOk(''); setErr('') }
  return (
    <div>
      <Field label="JSON input"><textarea rows="8" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck="false" placeholder='{"name":"ToolHub"}' /></Field>
      <div className="actions">
        <Field label="Indent"><select value={ind} onChange={(e) => setInd(e.target.value)}><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tab</option></select></Field>
        <button className="btn" onClick={() => run(false)}>Format</button>
        <button className="btn" onClick={() => run(true)}>Minify</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg><Msg kind="ok">{ok}</Msg>
      {out && <><Field label="Output"><textarea rows="8" readOnly value={out} /></Field>
        <div className="actions"><CopyBtn text={out} /><button className="btn ghost" onClick={() => download('formatted.json', out, 'application/json')}>Download</button></div></>}
    </div>
  )
}
