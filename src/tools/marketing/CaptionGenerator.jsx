import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { list, tag } from '../../utils/text.js'
const TPL = {
  Friendly: ['Let’s talk about {t}! It’s one of those things that makes a real difference once you get started.', 'Quick reminder: {t} doesn’t have to be complicated. Small steps add up.', 'We’ve been thinking a lot about {t} lately and we’d love to hear your take.'],
  Professional: ['{t}: what matters, what doesn’t, and where to focus first.', 'A practical look at {t} and how it can support better outcomes.', 'Three questions worth asking about {t} before your next decision.'],
  Playful: ['Plot twist: {t} is actually kind of fun once you dive in.', 'Us: “We should sort out {t}.” Also us: finally doing it.', 'Nobody asked, but here is our hot take on {t}.'],
  Inspirational: ['Every big result with {t} starts with one small, brave step.', 'Progress with {t} isn’t about being perfect. It’s about showing up today.', 'Start where you are with {t}. Use what you have. Do what you can.'],
}
const PL = { Instagram: { cta: 'Save this for later and tag someone who needs it.', tags: 5, max: 2200 }, LinkedIn: { cta: 'What has been your experience? Share it in the comments.', tags: 3, max: 3000 }, X: { cta: 'Thoughts? Reply below.', tags: 2, max: 280 }, Facebook: { cta: 'Tell us what you think in the comments.', tags: 2, max: 63206 }, TikTok: { cta: 'Follow for more and share your take in the comments.', tags: 4, max: 2200 } }
export default function CaptionGenerator() {
  const [topic, setTopic] = useState('')
  const [pl, setPl] = useState('Instagram')
  const [tone, setTone] = useState('Friendly')
  const [kw, setKw] = useState('')
  const [cta, setCta] = useState('')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const gen = () => {
    setRes(null)
    const t = topic.trim()
    if (t.length < 2 || t.length > 100) return setErr('Enter a topic of 2 to 100 characters.')
    const P = PL[pl], ks = list(kw)
    const tags = [...new Set([tag(t), ...ks.map(tag)].filter(Boolean))].slice(0, P.tags).join(' ')
    const out = TPL[tone].map((x) => {
      const hook = x.replace('{t}', t)
      const body = pl === 'X' ? `${hook} ${cta.trim() || P.cta} ${tags}` : `${hook}${ks.length ? `\n\nKey points: ${ks.join(' • ')}` : ''}\n\n${cta.trim() || P.cta}\n\n${tags}`
      return body.trim()
    })
    setErr(''); setRes({ out, max: P.max })
  }
  return (
    <div>
      <Field label="Topic *"><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="our new spring menu" /></Field>
      <div className="row"><Field label="Platform"><select value={pl} onChange={(e) => setPl(e.target.value)}>{Object.keys(PL).map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Tone"><select value={tone} onChange={(e) => setTone(e.target.value)}>{Object.keys(TPL).map((p) => <option key={p}>{p}</option>)}</select></Field></div>
      <div className="row"><Field label="Keywords (optional, comma separated)"><input value={kw} onChange={(e) => setKw(e.target.value)} /></Field><Field label="Your own call to action (optional)"><input value={cta} onChange={(e) => setCta(e.target.value)} /></Field></div>
      <div className="actions"><button className="btn" onClick={gen}>Generate captions</button><button className="btn ghost" onClick={() => { setTopic(''); setKw(''); setCta(''); setRes(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {res && <div>{res.out.map((c, i) => <div className="out" key={i}><p style={{ whiteSpace: 'pre-wrap' }}>{c}</p>
        <p className="hint">{c.length} characters{c.length > res.max ? ` (over the ${res.max} limit for ${pl})` : ''}</p><CopyBtn text={c} /></div>)}
        <p className="hint">These are template-based caption drafts built locally, not written by an AI service. Edit them so they sound like you.</p></div>}
    </div>
  )
}
