import { useMemo, useState } from 'react'
import { Field } from '../../components/ui.jsx'

const LIMITS = [
  ['X (Twitter) post', 280], ['Instagram caption', 2200], ['Facebook post', 63206],
  ['LinkedIn post', 3000], ['TikTok caption', 2200], ['YouTube title', 100], ['Meta description', 160],
]

export default function SocialCharacterCounter() {
  const [text, setText] = useState('')
  const len = text.length
  return (
    <div>
      <Field label="Post text"><textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <p role="status">Characters: <strong>{len}</strong></p>
      <div className="out">
        {LIMITS.map(([label, max]) => {
          const over = len > max
          return <p key={label}>{label}: <strong className={over ? 'bad' : 'good'}>{len}/{max}</strong>{over ? ` — ${len - max} over` : ''}</p>
        })}
      </div>
      <p className="hint">Limits are approximate and can change — always check the platform's current rules for anything critical.</p>
    </div>
  )
}
