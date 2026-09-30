import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const CROPS = {
  'Tomatoes': { start: 6, transplant: 2 },
  'Peppers': { start: 8, transplant: 2 },
  'Broccoli / Cabbage': { start: 6, transplant: 2 },
  'Lettuce': { start: 4, transplant: 2 },
  'Cucumbers / Squash': { start: 3, transplant: 2 },
  'Basil': { start: 6, transplant: 1 },
  'Marigolds': { start: 6, transplant: 1 },
}

export default function SeedStartingDateCalculator() {
  const [frost, setFrost] = useState('')
  const [crop, setCrop] = useState('Tomatoes')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    if (!frost) { setOut(null); return setErr('Enter your expected last spring frost date.') }
    const f = new Date(frost + 'T00:00:00')
    if (isNaN(f)) { setOut(null); return setErr('Enter a valid date.') }
    const { start, transplant } = CROPS[crop]
    const seedDate = new Date(f); seedDate.setDate(seedDate.getDate() - start * 7)
    const transDate = new Date(f); transDate.setDate(transDate.getDate() - transplant * 7)
    setErr('')
    setOut({ seed: seedDate.toLocaleDateString(), trans: transDate.toLocaleDateString() })
  }

  return (
    <div>
      <div className="row">
        <Field label="Expected last spring frost date"><input type="date" value={frost} onChange={(e) => setFrost(e.target.value)} /></Field>
        <Field label="Crop"><select value={crop} onChange={(e) => setCrop(e.target.value)}>{Object.keys(CROPS).map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate dates</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Start seeds indoors around <strong>{out.seed}</strong>.<br />Plan to transplant outdoors around <strong>{out.trans}</strong> (after your frost date, once seedlings are hardened off).</p>}
    </div>
  )
}
