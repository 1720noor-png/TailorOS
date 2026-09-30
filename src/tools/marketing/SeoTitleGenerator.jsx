import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { tc } from '../../utils/text.js'
const year = new Date().getFullYear()
export default function SeoTitleGenerator() {
  const [kw, setKw] = useState('')
  const [kind, setKind] = useState('topic')
  const [brand, setBrand] = useState('')
  const [num, setNum] = useState(7)
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const gen = () => {
    setRes(null)
    const k = kw.trim().replace(/\s+/g, ' '), N = Number(num)
    if (k.length < 2 || k.length > 80) return setErr('Enter a topic or keyword of 2 to 80 characters.')
    if (!Number.isInteger(N) || N < 2 || N > 50) return setErr('Number must be a whole number from 2 to 50.')
    const T = tc(k)
    const base = kind === 'topic'
      ? [`${T}: The Ultimate Guide`, `${T} Explained: What You Need to Know`, `Best ${T} in ${year}: Top Picks & Tips`, `${N} ${T} Tips That Actually Work`, `${T} for Beginners: A Simple Guide`, `${T} Checklist: Everything You Need`, `${N} ${T} Mistakes to Avoid`, `Is ${T} Worth It? Pros, Cons & Costs`]
      : [`How to ${k}: Step-by-Step Guide`, `${N} Easy Ways to ${tc(k)}`, `How to ${k} in ${year} (Beginner-Friendly)`, `The Fastest Way to ${T}`, `${N} Mistakes to Avoid When You ${T}`, `How to ${k}: Tips, Tools & Common Mistakes`]
    const b = brand.trim()
    setErr(''); setRes(base.map((t) => (b && (t + ' | ' + b).length <= 60 ? `${t} | ${b}` : t)))
  }
  const badge = (n) => (n <= 60 ? 'good length' : n <= 70 ? 'may be truncated' : 'likely too long')
  return (
    <div>
      <div className="row"><Field label="Topic or keyword *"><input value={kw} onChange={(e) => setKw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && gen()} placeholder={kind === 'topic' ? 'meal prep' : 'meal prep on a budget'} /></Field>
        <Field label="Keyword type"><select value={kind} onChange={(e) => setKind(e.target.value)}><option value="topic">Topic (noun): “meal prep”</option><option value="action">Action (verb): “meal prep on a budget”</option></select></Field></div>
      <div className="row"><Field label="Brand (optional, added if it fits)"><input value={brand} onChange={(e) => setBrand(e.target.value)} /></Field><Field label="Number for list titles"><input type="number" min="2" max="50" value={num} onChange={(e) => setNum(e.target.value)} /></Field></div>
      <div className="actions"><button className="btn" onClick={gen}>Generate titles</button><button className="btn ghost" onClick={() => { setKw(''); setBrand(''); setNum(7); setRes(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {res && <div>{res.map((t) => <div className="item" key={t}><div>{t}<br /><small>{t.length} characters · {badge(t.length)}</small></div><CopyBtn text={t} /></div>)}
        <p className="hint">Title ideas from proven patterns, generated locally. Pick the one that matches the page’s real content; no ranking or click-through data is used.</p></div>}
    </div>
  )
}
