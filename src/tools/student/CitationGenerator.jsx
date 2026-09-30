import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
const I = (s) => '\u0001' + s + '\u0002'
const dot = (s) => (/[.?!]$/.test(s) ? s : s + '.')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const empty = { authors: '', title: '', year: '', site: '', publisher: '', container: '', volume: '', issue: '', pages: '', url: '', accessed: '' }
const parse = (txt) => txt.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
  if (l.includes(',')) { const [last, ...r] = l.split(','); return { last: last.trim(), first: r.join(',').trim() } }
  const p = l.split(/\s+/)
  return p.length === 1 ? { last: p[0], first: '' } : { last: p[p.length - 1], first: p.slice(0, -1).join(' ') }
})
const initials = (first) => first.split(/[\s-]+/).filter(Boolean).map((w) => w[0].toUpperCase() + '.').join(' ')
const apaNames = (a) => {
  const n = a.map((x) => (x.first ? `${x.last}, ${initials(x.first)}` : x.last))
  return n.length < 2 ? n[0] || '' : n.length === 2 ? `${n[0]}, & ${n[1]}` : `${n.slice(0, -1).join(', ')}, & ${n[n.length - 1]}`
}
const mlaNames = (a) => {
  if (!a.length) return ''
  const full = (x) => (x.first ? `${x.last}, ${x.first}` : x.last)
  if (a.length === 1) return full(a[0])
  if (a.length === 2) return `${full(a[0])}, and ${a[1].first ? a[1].first + ' ' : ''}${a[1].last}`
  return `${full(a[0])}, et al.`
}
function build(style, type, f) {
  const a = parse(f.authors), y = f.year.trim(), acc = f.accessed ? new Date(f.accessed + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const P = []
  if (style === 'apa') {
    if (a.length) P.push(dot(apaNames(a)))
    P.push(`(${y}).`)
    if (type === 'journal') {
      P.push(dot(f.title.trim()))
      P.push(I(f.container.trim()) + (f.volume ? ', ' + I(f.volume.trim()) : '') + (f.issue ? `(${f.issue.trim()})` : '') + (f.pages ? ', ' + f.pages.trim() : '') + '.')
    } else {
      P.push(dot(I(f.title.trim())))
      if (type === 'website' && f.site.trim()) P.push(dot(f.site.trim()))
      if (f.publisher.trim()) P.push(dot(f.publisher.trim()))
    }
    if (f.url.trim()) P.push(f.url.trim())
  } else {
    if (a.length) P.push(dot(mlaNames(a)))
    if (type === 'book') { P.push(dot(I(f.title.trim()))); P.push([f.publisher.trim(), y].filter(Boolean).join(', ') + '.') }
    else if (type === 'journal') {
      P.push(`“${dot(f.title.trim())}”`)
      P.push([I(f.container.trim()), f.volume && `vol. ${f.volume.trim()}`, f.issue && `no. ${f.issue.trim()}`, y, f.pages && `pp. ${f.pages.trim()}`, f.url.trim()].filter(Boolean).join(', ') + '.')
    } else {
      P.push(`“${dot(f.title.trim())}”`)
      P.push([f.site.trim() && I(f.site.trim()), f.publisher.trim(), y, f.url.trim()].filter(Boolean).join(', ') + '.')
      if (acc) P.push(`Accessed ${acc}.`)
    }
  }
  return P.join(' ')
}
export default function CitationGenerator() {
  const [style, setStyle] = useState('apa')
  const [type, setType] = useState('website')
  const [f, setF] = useState(empty)
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const gen = () => {
    setOut('')
    if (!f.title.trim()) return setErr('Enter the title.')
    if (!/^(\d{4}|n\.d\.)$/.test(f.year.trim())) return setErr('Enter the year as four digits (for example 2024) or n.d.')
    if (type === 'journal' && !f.container.trim()) return setErr('Enter the journal name.')
    if (f.url.trim() && !/^https?:\/\//i.test(f.url.trim())) return setErr('The URL must start with http:// or https://')
    setErr(''); setOut(build(style, type, f))
  }
  const plain = out.replace(/[\u0001\u0002]/g, '')
  const html = esc(out).replace(/\u0001/g, '<em>').replace(/\u0002/g, '</em>')
  const T = (k, label, extra) => <Field label={label}><input value={f[k]} onChange={set(k)} {...extra} /></Field>
  return (
    <div>
      <div className="row">
        <Field label="Style"><select value={style} onChange={(e) => { setStyle(e.target.value); setOut('') }}><option value="apa">APA 7th</option><option value="mla">MLA 9th</option></select></Field>
        <Field label="Source type"><select value={type} onChange={(e) => { setType(e.target.value); setOut('') }}><option value="website">Website</option><option value="book">Book</option><option value="journal">Journal article</option></select></Field>
      </div>
      <Field label="Authors (one per line: “First Last” or “Last, First”; optional)"><textarea rows="3" value={f.authors} onChange={set('authors')} /></Field>
      <div className="row">
        {T('title', 'Title *')}{T('year', 'Year * (or n.d.)')}
        {type === 'website' && T('site', 'Website name')}
        {type === 'journal' && T('container', 'Journal name *')}
        {type !== 'journal' && T('publisher', 'Publisher')}
        {type === 'journal' && <>{T('volume', 'Volume')}{T('issue', 'Issue')}{T('pages', 'Pages')}</>}
        {type !== 'book' && T('url', 'URL or DOI link', { type: 'url' })}
        {type === 'website' && T('accessed', 'Accessed on (MLA)', { type: 'date' })}
      </div>
      <div className="actions"><button className="btn" onClick={gen}>Generate citation</button><button className="btn ghost" onClick={() => { setF(empty); setOut(''); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out"><p dangerouslySetInnerHTML={{ __html: html }} /><CopyBtn text={plain} /></div>}
      <p className="hint">Check the result against your institution’s guide; special cases (editors, translators, more than 20 authors) are not covered.</p>
    </div>
  )
}
