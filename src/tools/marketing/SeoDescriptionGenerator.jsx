import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { cap } from '../../utils/text.js'
const CTAS = ['Learn more', 'Get started', 'Read the guide', 'Shop now', 'Contact us today', 'Try it free']
export default function SeoDescriptionGenerator() {
  const [topic, setTopic] = useState('')
  const [aud, setAud] = useState('')
  const [ben, setBen] = useState('')
  const [brand, setBrand] = useState('')
  const [cta, setCta] = useState(CTAS[0])
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const gen = () => {
    setRes(null)
    const t = topic.trim()
    if (t.length < 2 || t.length > 80) return setErr('Enter a topic of 2 to 80 characters.')
    const a = aud.trim(), b = ben.trim(), br = brand.trim()
    const forA = a ? ` for ${a}` : ''
    setErr(''); setRes([
      `Learn how ${t} can ${b || 'help you get better results'}${forA}. ${cta} today.`,
      `Looking for ${t}${forA}? ${br ? br + ' offers' : 'Discover'} practical advice${b ? ` to ${b}` : ''}. ${cta}.`,
      `${cap(t)} made simple. Explore tips, examples and step-by-step guidance${forA}. ${cta}.`,
      `${br ? br + ': ' : ''}Everything you need to know about ${t}${b ? `, from how to ${b}` : ''}. ${cta} and see the difference.`,
      `Compare options, avoid common mistakes and choose ${t} with confidence${a ? `, built for ${a}` : ''}. ${cta}.`,
    ])
  }
  const note = (n) => (n > 160 ? 'may be cut off in results' : n < 70 ? 'short; add detail' : n >= 120 ? 'good length' : 'acceptable, could be longer')
  return (
    <div>
      <div className="row"><Field label="Topic or page subject *"><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="meal prep" /></Field><Field label="Audience (optional)"><input value={aud} onChange={(e) => setAud(e.target.value)} placeholder="busy students" /></Field></div>
      <div className="row"><Field label="Benefit (optional, completes “to …”)"><input value={ben} onChange={(e) => setBen(e.target.value)} placeholder="save time and money" /></Field><Field label="Brand (optional)"><input value={brand} onChange={(e) => setBrand(e.target.value)} /></Field>
        <Field label="Call to action"><select value={cta} onChange={(e) => setCta(e.target.value)}>{CTAS.map((c) => <option key={c}>{c}</option>)}</select></Field></div>
      <div className="actions"><button className="btn" onClick={gen}>Generate descriptions</button><button className="btn ghost" onClick={() => { setTopic(''); setAud(''); setBen(''); setBrand(''); setRes(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {res && <div>{res.map((d) => <div className="item" key={d}><div>{d}<br /><small>{d.length} characters · {note(d.length)}</small></div><CopyBtn text={d} /></div>)}
        <p className="hint">Aim for roughly 120–160 characters. These are template-based drafts made locally; adjust them so they describe the page accurately.</p></div>}
    </div>
  )
}
