import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const toTime = (min) => { min = ((min % 1440) + 1440) % 1440; const h = Math.floor(min / 60); const m = Math.round(min % 60); const ampm = h >= 12 ? 'PM' : 'AM'; const h12 = h % 12 === 0 ? 12 : h % 12; return `${h12}:${String(m).padStart(2, '0')} ${ampm}` }

export default function GoldenHourCalculator() {
  const [sunrise, setSunrise] = useState('06:30')
  const [sunset, setSunset] = useState('19:45')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    if (!sunrise || !sunset) { setOut(null); return setErr('Enter both sunrise and sunset time for your location and date.') }
    const sr = toMin(sunrise), ss = toMin(sunset)
    setErr('')
    setOut({
      morningBlue: [toTime(sr - 40), toTime(sr - 5)],
      morningGolden: [toTime(sr), toTime(sr + 60)],
      eveningGolden: [toTime(ss - 60), toTime(ss)],
      eveningBlue: [toTime(ss + 5), toTime(ss + 40)],
    })
  }

  return (
    <div>
      <div className="row">
        <Field label="Sunrise time"><input type="time" value={sunrise} onChange={(e) => setSunrise(e.target.value)} /></Field>
        <Field label="Sunset time"><input type="time" value={sunset} onChange={(e) => setSunset(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate windows</button></div>
      <Msg>{err}</Msg>
      {out && (
        <div className="out" role="status">
          <p>Morning blue hour: <strong>{out.morningBlue[0]} – {out.morningBlue[1]}</strong></p>
          <p>Morning golden hour: <strong>{out.morningGolden[0]} – {out.morningGolden[1]}</strong></p>
          <p>Evening golden hour: <strong>{out.eveningGolden[0]} – {out.eveningGolden[1]}</strong></p>
          <p>Evening blue hour: <strong>{out.eveningBlue[0]} – {out.eveningBlue[1]}</strong></p>
        </div>
      )}
      <Msg kind="status">Look up today's sunrise/sunset for your location, then paste them in — windows shift with season and latitude.</Msg>
    </div>
  )
}
