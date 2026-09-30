import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { esc } from '../../components/print.js'
const init = { title: '', desc: '', kw: '', url: '', img: '', site: '', robots: 'index, follow', type: 'website' }
const isUrl = (u) => { try { return /^https?:$/.test(new URL(u).protocol) } catch { return false } }
export default function MetaTagGenerator() {
  const [f, setF] = useState(init)
  const [out, setOut] = useState('')
  const [warn, setWarn] = useState([])
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const gen = () => {
    setOut(''); setWarn([])
    if (!f.title.trim()) return setErr('Enter a page title.')
    if (!f.desc.trim()) return setErr('Enter a meta description.')
    for (const [n, v] of [['Canonical URL', f.url], ['Image URL', f.img]]) if (v.trim() && !isUrl(v.trim())) return setErr(`${n} must be a full link starting with http:// or https://`)
    const t = f.title.trim(), d = f.desc.trim(), a = esc
    const L = [`<title>${a(t)}</title>`, `<meta name="description" content="${a(d)}">`]
    if (f.kw.trim()) L.push(`<meta name="keywords" content="${a(f.kw.split(',').map((x) => x.trim()).filter(Boolean).join(', '))}">`)
    L.push(`<meta name="robots" content="${a(f.robots)}">`)
    if (f.url.trim()) L.push(`<link rel="canonical" href="${a(f.url.trim())}">`)
    L.push(`<meta property="og:title" content="${a(t)}">`, `<meta property="og:description" content="${a(d)}">`, `<meta property="og:type" content="${a(f.type)}">`)
    if (f.url.trim()) L.push(`<meta property="og:url" content="${a(f.url.trim())}">`)
    if (f.img.trim()) L.push(`<meta property="og:image" content="${a(f.img.trim())}">`)
    if (f.site.trim()) L.push(`<meta property="og:site_name" content="${a(f.site.trim())}">`)
    L.push(`<meta name="twitter:card" content="${f.img.trim() ? 'summary_large_image' : 'summary'}">`)
    const w = []
    if (t.length > 60) w.push(`Title is ${t.length} characters; around 60 or fewer is safer to avoid truncation.`)
    if (d.length > 160) w.push(`Description is ${d.length} characters; around 160 or fewer is safer to avoid truncation.`)
    if (d.length < 70) w.push(`Description is only ${d.length} characters; 70–160 usually reads better.`)
    if (f.kw.trim()) w.push('Note: Google ignores the keywords tag; it is included only if you need it for other systems.')
    setErr(''); setWarn(w); setOut(L.join('\n'))
  }
  return (
    <div>
      <Field label={`Page title * (${f.title.length} characters)`}><input value={f.title} onChange={set('title')} /></Field>
      <Field label={`Meta description * (${f.desc.length} characters)`}><textarea rows="3" value={f.desc} onChange={set('desc')} /></Field>
      <div className="row"><Field label="Keywords (optional, comma separated)"><input value={f.kw} onChange={set('kw')} /></Field><Field label="Canonical / page URL"><input type="url" value={f.url} onChange={set('url')} placeholder="https://example.com/page" /></Field></div>
      <div className="row"><Field label="Social image URL"><input type="url" value={f.img} onChange={set('img')} placeholder="https://example.com/image.jpg" /></Field><Field label="Site name"><input value={f.site} onChange={set('site')} /></Field>
        <Field label="Robots"><select value={f.robots} onChange={set('robots')}>{['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'].map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="Open Graph type"><select value={f.type} onChange={set('type')}><option>website</option><option>article</option></select></Field></div>
      <div className="actions"><button className="btn" onClick={gen}>Generate meta tags</button><button className="btn ghost" onClick={() => { setF(init); setOut(''); setWarn([]); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <><pre className="doc">{out}</pre>{warn.map((w) => <p className="hint" key={w}>{w}</p>)}<div className="actions"><CopyBtn text={out} label="Copy HTML" /></div>
        <p className="hint">Paste inside the &lt;head&gt; of your page. Images should be at least 1200×630 px for best social previews.</p></>}
    </div>
  )
}
