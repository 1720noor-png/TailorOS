import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
const px = (s, font) => { const c = document.createElement('canvas').getContext('2d'); c.font = font; return c.measureText(s).width }
const fit = (s, font, max) => { if (px(s, font) <= max) return s; let e = s.length; while (e > 0 && px(s.slice(0, e).trimEnd() + '…', font) > max) e--; return s.slice(0, e).trimEnd() + '…' }
export default function SerpPreview() {
  const [t, setT] = useState('')
  const [u, setU] = useState('')
  const [d, setD] = useState('')
  const [mobile, setMobile] = useState(false)
  let host = '', crumbs = '', uerr = ''
  if (u.trim()) { try { const x = new URL(u.trim()); if (!/^https?:$/.test(x.protocol)) throw 0; host = x.origin; crumbs = x.pathname.split('/').filter(Boolean).join(' › ') } catch { uerr = 'Enter a full URL starting with http:// or https://' } }
  const tt = t.trim(), dd = d.trim()
  const tp = tt ? Math.round(px(tt, '20px Arial')) : 0
  const title = tt ? fit(tt, '20px Arial', mobile ? 920 : 600) : ''
  const desc = dd.length > (mobile ? 120 : 160) ? dd.slice(0, mobile ? 120 : 160).trimEnd() + '…' : dd
  const tmsg = !tt ? '' : t.length > 60 || tp > 600 ? 'Likely to be truncated on desktop.' : tt.length < 30 ? 'Quite short; consider adding detail.' : 'Good length.'
  const dmsg = !dd ? '' : dd.length > 160 ? 'Likely to be truncated.' : dd.length < 70 ? 'Quite short; 70–160 characters works well.' : 'Good length.'
  return (
    <div>
      <Field label={`Page title (${tt.length} characters, about ${tp}px)`}><input value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <Field label="Page URL"><input type="url" value={u} onChange={(e) => setU(e.target.value)} placeholder="https://example.com/blog/post" /></Field>
      <Field label={`Meta description (${dd.length} characters)`}><textarea rows="3" value={d} onChange={(e) => setD(e.target.value)} /></Field>
      <div className="actions"><label className="check"><input type="checkbox" checked={mobile} onChange={(e) => setMobile(e.target.checked)} /> Mobile preview</label><button className="btn ghost" onClick={() => { setT(''); setU(''); setD('') }}>Reset</button></div>
      <Msg>{uerr}</Msg>
      {tt || dd || host ? <div className="serp" style={{ maxWidth: mobile ? 380 : 660 }}>
        <div className="u">{host ? <>{host.replace(/^https?:\/\//, '')}{crumbs && <span> › {crumbs}</span>}</> : 'example.com'}</div>
        <div className="t">{title || 'Your page title'}</div><div className="d">{desc || 'Your meta description will appear here.'}</div></div>
        : <div className="empty"><p>Enter a title, URL and description to see the preview.</p></div>}
      {(tmsg || dmsg) && <p className="hint">Title: {tmsg} Description: {dmsg}</p>}
      <p className="hint">This is an estimate based on typical desktop and mobile limits. It is not live Google data, and Google may rewrite titles and descriptions.</p>
    </div>
  )
}
