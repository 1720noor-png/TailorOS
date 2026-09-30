import { useState } from 'react'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'
import { list } from '../../utils/text.js'
const year = new Date().getFullYear()
const groups = (s) => [
  ['Questions', [`how to ${s}`, `what is ${s}`, `why ${s}`, `is ${s} worth it`, `how does ${s} work`, `best way to ${s}`]],
  ['Informational', [`${s} guide`, `${s} tips`, `${s} tutorial`, `${s} examples`, `${s} checklist`, `${s} ideas`, `${s} for beginners`, `${s} ${year}`]],
  ['Commercial', [`best ${s}`, `top ${s}`, `${s} reviews`, `${s} alternatives`, `${s} comparison`, `affordable ${s}`, `${s} pricing`, `${s} cost`]],
  ['Transactional', [`buy ${s}`, `${s} near me`, `${s} online`, `${s} services`, `${s} discount`, `${s} free trial`, `hire ${s}`]],
]
export default function KeywordGenerator() {
  const [seed, setSeed] = useState('')
  const [mods, setMods] = useState('')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const gen = () => {
    setRes(null)
    const s = seed.trim().toLowerCase().replace(/\s+/g, ' ')
    if (s.length < 2 || s.length > 80) return setErr('Enter a seed keyword of 2 to 80 characters.')
    const g = groups(s), m = list(mods.toLowerCase())
    if (m.length) g.push(['Audience / location', m.flatMap((x) => [`${s} for ${x}`, `best ${s} for ${x}`, `${s} ${x}`, `${x} ${s}`])])
    const seen = new Set([s])
    const out = g.map(([n, ks]) => [n, ks.filter((k) => !seen.has(k) && seen.add(k))]).filter(([, ks]) => ks.length)
    setErr(''); setRes(out)
  }
  const all = res ? res.flatMap(([, k]) => k) : []
  return (
    <div>
      <div className="row">
        <Field label="Seed keyword *"><input value={seed} onChange={(e) => setSeed(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && gen()} placeholder="meal prep" /></Field>
        <Field label="Audiences or places (optional, comma separated)"><input value={mods} onChange={(e) => setMods(e.target.value)} placeholder="students, london" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={gen}>Generate keyword ideas</button><button className="btn ghost" onClick={() => { setSeed(''); setMods(''); setRes(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {res && <div className="out">
        <p><strong>{all.length} keyword ideas</strong> <small>built from common search patterns. These are ideas only: no search volume, difficulty or ranking data is shown, so check them in a keyword research tool before choosing.</small></p>
        {res.map(([n, ks]) => <div key={n}><h3>{n}</h3><p>{ks.join(' · ')}</p></div>)}
        <div className="actions"><CopyBtn text={all.join('\n')} label="Copy all" /><button className="btn ghost" onClick={() => download('keyword-ideas.csv', ['keyword,type', ...res.flatMap(([n, ks]) => ks.map((k) => `"${k.replace(/"/g, '""')}",${n}`))].join('\n'), 'text/csv')}>Download CSV</button></div>
      </div>}
    </div>
  )
}
