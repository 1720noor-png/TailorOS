import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
const FLAGS = { i: 'ignore case', m: 'multiline', s: 'dot matches newline', u: 'unicode' }
export default function RegexTester() {
  const [pat, setPat] = useState('')
  const [fl, setFl] = useState({ i: false, m: false, s: false, u: false })
  const [txt, setTxt] = useState('')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const run = () => {
    setRes(null)
    if (!pat) return setErr('Enter a pattern.')
    try {
      const re = new RegExp(pat, 'g' + Object.keys(fl).filter((k) => fl[k]).join(''))
      const ms = []
      for (const m of txt.matchAll(re)) { ms.push(m); if (ms.length >= 500) break }
      setErr(''); setRes({ ms, capped: ms.length >= 500 })
    } catch (e) { setErr('Invalid pattern: ' + e.message) }
  }
  const parts = () => {
    const o = []; let p = 0
    for (const m of res.ms) { if (!m[0]) continue; o.push(txt.slice(p, m.index), <mark key={m.index}>{m[0]}</mark>); p = m.index + m[0].length }
    o.push(txt.slice(p)); return o
  }
  const reset = () => { setPat(''); setTxt(''); setRes(null); setErr('') }
  return (
    <div>
      <Field label="Pattern (without slashes)"><input value={pat} onChange={(e) => setPat(e.target.value)} spellCheck="false" placeholder="(\d{4})-(\d{2})" /></Field>
      <div className="checks">{Object.entries(FLAGS).map(([k, l]) => <label className="check" key={k}><input type="checkbox" checked={fl[k]} onChange={(e) => setFl({ ...fl, [k]: e.target.checked })} /> {k} ({l})</label>)}</div>
      <Field label="Test text"><textarea rows="6" value={txt} onChange={(e) => setTxt(e.target.value)} spellCheck="false" /></Field>
      <div className="actions"><button className="btn" onClick={run}>Test</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {res && (res.ms.length ? <div className="out" role="status">
        <p><strong>{res.ms.length}</strong> match{res.ms.length === 1 ? '' : 'es'}{res.capped && ' (showing the first 500)'}</p>
        <pre className="hl">{parts()}</pre>
        <ol>{res.ms.slice(0, 50).map((m, i) => <li key={i}>“{m[0]}” at index {m.index}{m.length > 1 && ` · groups: ${m.slice(1).map((g) => (g === undefined ? 'undefined' : `“${g}”`)).join(', ')}`}</li>)}</ol>
      </div> : <div className="empty"><p>No matches found.</p></div>)}
      <p className="hint">Uses your browser’s JavaScript regex engine. Patterns with heavy backtracking can freeze the tab, so matching runs only when you select Test.</p>
    </div>
  )
}
