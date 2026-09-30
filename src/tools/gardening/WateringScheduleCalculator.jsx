import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const BASE = { 'Succulent / Cactus': 14, 'Herbs': 3, 'Leafy vegetables': 2, 'Tomatoes / Peppers': 3, 'Flowering annuals': 3, 'Houseplant (tropical)': 5, 'Shrub / Perennial (established)': 7 }
const POT_FACTOR = { 'Small pot (< 6in)': 0.7, 'Medium pot (6-12in)': 1, 'Large pot (> 12in)': 1.4, 'In-ground bed': 1.6 }
const SEASON_FACTOR = { 'Summer / hot': 0.7, 'Spring / Fall': 1, 'Winter / cool': 1.6 }

export default function WateringScheduleCalculator() {
  const [plant, setPlant] = useState('Herbs')
  const [pot, setPot] = useState('Medium pot (6-12in)')
  const [season, setSeason] = useState('Spring / Fall')
  const [indoor, setIndoor] = useState('Outdoor')
  const [out, setOut] = useState(null)

  const calc = () => {
    let days = BASE[plant] * POT_FACTOR[pot] * SEASON_FACTOR[season]
    if (indoor === 'Indoor') days *= 1.3
    days = Math.max(1, Math.round(days))
    const next = new Date()
    next.setDate(next.getDate() + days)
    setOut({ days, next: next.toLocaleDateString() })
  }

  return (
    <div>
      <div className="row">
        <Field label="Plant type"><select value={plant} onChange={(e) => setPlant(e.target.value)}>{Object.keys(BASE).map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Container"><select value={pot} onChange={(e) => setPot(e.target.value)}>{Object.keys(POT_FACTOR).map((p) => <option key={p}>{p}</option>)}</select></Field>
      </div>
      <div className="row">
        <Field label="Season / climate"><select value={season} onChange={(e) => setSeason(e.target.value)}>{Object.keys(SEASON_FACTOR).map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Location"><select value={indoor} onChange={(e) => setIndoor(e.target.value)}><option>Outdoor</option><option>Indoor</option></select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate schedule</button></div>
      {out && <p className="out" role="status">Water roughly every <strong>{out.days} day{out.days === 1 ? '' : 's'}</strong>. <br />Next watering: <strong>{out.next}</strong></p>}
      <Msg kind="status">This is a general guideline — always check that the top inch of soil is actually dry before watering.</Msg>
    </div>
  )
}
