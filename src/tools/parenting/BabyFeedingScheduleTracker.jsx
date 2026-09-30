import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// age in months -> [feedings per day, oz per feeding (approx, formula/expressed milk guideline)]
const GUIDE = [
  { max: 1, freq: 8, oz: '2-3' },
  { max: 2, freq: 7, oz: '4-5' },
  { max: 4, freq: 6, oz: '4-6' },
  { max: 6, freq: 5, oz: '6-7' },
  { max: 12, freq: 4, oz: '6-8' },
]

export default function BabyFeedingScheduleTracker() {
  const [ageM, setAgeM] = useState('2')
  const [wake, setWake] = useState('07:00')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    const a = Number(ageM)
    if (!(a >= 0 && a <= 12)) { setOut(null); return setErr('Enter an age between 0 and 12 months.') }
    const g = GUIDE.find((x) => a <= x.max) || GUIDE[GUIDE.length - 1]
    const [wh, wm] = wake.split(':').map(Number)
    const intervalMin = Math.round(1440 / g.freq)
    const times = []
    let t = wh * 60 + wm
    for (let i = 0; i < g.freq; i++) {
      const mm = ((t % 1440) + 1440) % 1440
      const h = Math.floor(mm / 60), m = mm % 60
      const ampm = h >= 12 ? 'PM' : 'AM'; const h12 = h % 12 === 0 ? 12 : h % 12
      times.push(`${h12}:${String(m).padStart(2, '0')} ${ampm}`)
      t += intervalMin
    }
    setErr(''); setOut({ freq: g.freq, oz: g.oz, times })
  }

  return (
    <div>
      <div className="row">
        <Field label="Baby's age (months)"><input type="number" min="0" max="12" step="0.5" value={ageM} onChange={(e) => setAgeM(e.target.value)} /></Field>
        <Field label="Typical wake-up time"><input type="time" value={wake} onChange={(e) => setWake(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Generate guideline schedule</button></div>
      <Msg>{err}</Msg>
      {out && (
        <div className="out" role="status">
          <p>Typical guideline: about <strong>{out.freq} feedings/day</strong>, <strong>{out.oz} oz</strong> per feeding.</p>
          <p>Suggested feeding times: {out.times.join(', ')}</p>
        </div>
      )}
      <Msg kind="status">General guideline only, not medical advice — follow your pediatrician's guidance and your baby's own hunger cues.</Msg>
    </div>
  )
}
