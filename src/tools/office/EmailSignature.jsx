import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { esc } from '../../components/print.js'
const empty = { name: '', title: '', company: '', email: '', phone: '', web: '', li: '', tw: '', other: '' }
export default function EmailSignature() {
  const [f, setF] = useState(empty)
  const [sig, setSig] = useState(null)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const gen = () => {
    setSig(null); setMsg('')
    if (!f.name.trim()) return setErr('Enter your name.')
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return setErr('Enter a valid email address or leave it empty.')
    const badUrl = [['Website', f.web], ['LinkedIn', f.li], ['X / Twitter', f.tw], ['Other link', f.other]].find(([, v]) => v.trim() && !/^https?:\/\/\S+$/i.test(v.trim()))
    if (badUrl) return setErr(`${badUrl[0]} must be a full link starting with http:// or https://`)
    const a = (u, t) => `<a href="${esc(u.trim())}" style="color:#0b5fff;text-decoration:none">${esc(t)}</a>`
    const rows = [`<strong style="font-size:16px">${esc(f.name.trim())}</strong>`, [f.title, f.company].map((x) => x.trim()).filter(Boolean).map(esc).join(' | '),
      f.phone.trim() && `Phone: ${esc(f.phone.trim())}`, f.email.trim() && `Email: ${a('mailto:' + f.email, f.email.trim())}`, f.web.trim() && `Web: ${a(f.web, f.web.trim().replace(/^https?:\/\//i, ''))}`,
      [f.li && a(f.li, 'LinkedIn'), f.tw && a(f.tw, 'X'), f.other && a(f.other, 'Link')].filter(Boolean).join(' · ')].filter(Boolean)
    const html = `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#222"><tr><td>${rows.join('<br>')}</td></tr></table>`
    const doc = new DOMParser().parseFromString(html, 'text/html')
    setErr(''); setSig({ html, text: doc.body.innerText || doc.body.textContent })
  }
  const rich = async () => {
    try { await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([sig.html], { type: 'text/html' }), 'text/plain': new Blob([sig.text], { type: 'text/plain' }) })]); setMsg('Formatted signature copied. Paste it into your email settings.') }
    catch { setMsg('Your browser blocked formatted copy. Use “Copy HTML” instead.') }
  }
  return (
    <div>
      <div className="row"><Field label="Name *"><input value={f.name} onChange={set('name')} /></Field><Field label="Job title"><input value={f.title} onChange={set('title')} /></Field><Field label="Company"><input value={f.company} onChange={set('company')} /></Field></div>
      <div className="row"><Field label="Email"><input type="email" value={f.email} onChange={set('email')} /></Field><Field label="Phone"><input value={f.phone} onChange={set('phone')} /></Field><Field label="Website"><input type="url" value={f.web} onChange={set('web')} placeholder="https://" /></Field></div>
      <div className="row"><Field label="LinkedIn link"><input type="url" value={f.li} onChange={set('li')} placeholder="https://" /></Field><Field label="X / Twitter link"><input type="url" value={f.tw} onChange={set('tw')} placeholder="https://" /></Field><Field label="Other link"><input type="url" value={f.other} onChange={set('other')} placeholder="https://" /></Field></div>
      <div className="actions"><button className="btn" onClick={gen}>Generate signature</button><button className="btn ghost" onClick={() => { setF(empty); setSig(null); setErr(''); setMsg('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {sig && <><div className="paper" dangerouslySetInnerHTML={{ __html: sig.html }} />
        <div className="actions"><button className="btn ghost" onClick={rich}>Copy formatted signature</button><CopyBtn text={sig.html} label="Copy HTML" /><CopyBtn text={sig.text} label="Copy plain text" /></div>
        <Msg kind="ok">{msg}</Msg></>}
    </div>
  )
}
