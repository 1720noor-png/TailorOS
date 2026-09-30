import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { list, words, cap, tag } from '../../utils/text.js'
const SUF = ['Tips', 'Ideas', 'Community', 'Daily', 'Goals', 'Inspiration', 'Lovers', 'Hacks', 'Life', 'Journey']
const PLAT = { Instagram: 'Instagram allows up to 30 hashtags; 5–15 is common.', LinkedIn: 'On LinkedIn, 3–5 hashtags is usually enough.', X: 'On X, 1–2 hashtags is usually enough.', TikTok: 'On TikTok, 3–6 relevant hashtags is common.', Facebook: 'On Facebook, 1–3 hashtags is usually enough.' }
export default function HashtagGenerator() {
  const [topics, setTopics] = useState('')
  const [n, setN] = useState(15)
  const [pl, setPl] = useState('Instagram')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const gen = () => {
    setRes(null)
    const ts = list(topics)
    const c = Number(n)
    if (!ts.length) return setErr('Enter at least one topic or keyword.')
    if (!Number.isInteger(c) || c < 1 || c > 30) return setErr('Number of hashtags must be a whole number from 1 to 30.')
    const cand = [
      ...ts.map(tag),
      ...ts.flatMap((t) => (words(t).length > 1 ? words(t).filter((w) => w.length > 3).map((w) => '#' + cap(w)) : [])),
      ...ts.flatMap((a, i) => ts.slice(i + 1).map((b) => tag(a + ' ' + b))),
      ...ts.flatMap((t) => SUF.map((s) => tag(t) + s)),
    ]
    const seen = new Set()
    const out = cand.filter((h) => h.length > 1 && h.length <= 40 && !seen.has(h.toLowerCase()) && seen.add(h.toLowerCase())).slice(0, c)
    setErr(''); setRes(out)
  }
  return (
    <div>
      <Field label="Topics or keywords * (comma or new line separated)"><textarea rows="3" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="meal prep, healthy eating" /></Field>
      <div className="row"><Field label="Number of hashtags"><input type="number" min="1" max="30" value={n} onChange={(e) => setN(e.target.value)} /></Field>
        <Field label="Platform (for guidance)"><select value={pl} onChange={(e) => setPl(e.target.value)}>{Object.keys(PLAT).map((p) => <option key={p}>{p}</option>)}</select></Field></div>
      <div className="actions"><button className="btn" onClick={gen}>Generate hashtags</button><button className="btn ghost" onClick={() => { setTopics(''); setN(15); setRes(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {res && <div className="out"><p>{res.join(' ')}</p><div className="actions"><CopyBtn text={res.join(' ')} label="Copy all" /></div>
        <p className="hint">{res.length} hashtag idea(s) built from your own words. They are not live trending data, so check how each tag is used before posting. {PLAT[pl]}</p></div>}
    </div>
  )
}
