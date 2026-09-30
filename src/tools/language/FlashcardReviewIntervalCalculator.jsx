import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// simplified SM-2 style spaced repetition
export default function FlashcardReviewIntervalCalculator() {
  const [ease, setEase] = useState('2.5')
  const [interval, setInterval] = useState('1')
  const [quality, setQuality] = useState('4')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    let e = Number(ease), i = Number(interval), q = Number(quality)
    if (!(e >= 1.3 && i >= 0 && q >= 0 && q <= 5)) { setOut(null); return setErr('Enter ease ≥ 1.3, interval ≥ 0 days, and quality of recall from 0-5.') }
    let newEase = e + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if (newEase < 1.3) newEase = 1.3
    let newInterval
    if (q < 3) newInterval = 1
    else if (i === 0) newInterval = 1
    else if (i === 1) newInterval = 6
    else newInterval = Math.round(i * newEase)
    setErr('')
    const next = new Date(); next.setDate(next.getDate() + newInterval)
    setOut({ newEase: newEase.toFixed(2), newInterval, next: next.toLocaleDateString() })
  }

  return (
    <div>
      <div className="row">
        <Field label="Current ease factor"><input type="number" min="1.3" step="0.01" value={ease} onChange={(e) => setEase(e.target.value)} /></Field>
        <Field label="Current interval (days)"><input type="number" min="0" value={interval} onChange={(e) => setInterval(e.target.value)} /></Field>
        <Field label="How well you recalled it (0-5)"><input type="number" min="0" max="5" value={quality} onChange={(e) => setQuality(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate next review</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">New ease factor: <strong>{out.newEase}</strong><br />Next interval: <strong>{out.newInterval} day{out.newInterval === 1 ? '' : 's'}</strong><br />Review again on: <strong>{out.next}</strong></p>}
      <Msg kind="status">Based on the SM-2 spaced repetition algorithm — 5 means perfect recall, 0 means you didn't remember it at all.</Msg>
    </div>
  )
}
