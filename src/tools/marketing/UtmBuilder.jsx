import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
const empty = { url: '', source: '', medium: '', campaign: '', term: '', content: '' }
export default function UtmBuilder() {
  const [f, setF] = useState(empty)
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const build = () => {
    setOut('')
    let u
    try { u = new URL(f.url.trim()); if (!/^https?:$/.test(u.protocol)) throw 0 } catch { return setErr('Enter a full URL starting with http:// or https://') }
    const miss = ['source', 'medium', 'campaign'].filter((k) => !f[k].trim())
    if (miss.length) return setErr(`Required: ${miss.join(', ')}.`)
    for (const k of Object.keys(empty)) if (k !== 'url' && f[k].trim()) u.searchParams.set('utm_' + k, f[k].trim())
    u.search = u.search.replace(/\+/g, '%20')
    setErr(''); setOut(u.toString())
  }
  const reset = () => { setF(empty); setOut(''); setErr('') }
  return (
    <div>
      <Field label="Destination URL"><input type="url" value={f.url} onChange={set('url')} placeholder="https://example.com/landing" /></Field>
      <div className="row">
        <Field label="Source (required)"><input value={f.source} onChange={set('source')} placeholder="newsletter" /></Field>
        <Field label="Medium (required)"><input value={f.medium} onChange={set('medium')} placeholder="email" /></Field>
        <Field label="Campaign (required)"><input value={f.campaign} onChange={set('campaign')} placeholder="spring_sale" /></Field>
      </div>
      <div className="row">
        <Field label="Term (optional)"><input value={f.term} onChange={set('term')} /></Field>
        <Field label="Content (optional)"><input value={f.content} onChange={set('content')} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={build}>Build link</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out"><code>{out}</code><CopyBtn text={out} /></div>}
    </div>
  )
}
