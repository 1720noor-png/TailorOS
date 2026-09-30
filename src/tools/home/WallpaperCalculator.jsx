import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function WallpaperCalculator() {
  const [perimeter, setPerimeter] = useState('')
  const [height, setHeight] = useState('')
  const [rollW, setRollW] = useState('21')
  const [rollL, setRollL] = useState('33')
  const [repeat, setRepeat] = useState('0')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const p = Number(perimeter), h = Number(height), rw = Number(rollW), rl = Number(rollL), rep = Number(repeat) || 0
    if (!(p > 0 && h > 0 && rw > 0 && rl > 0)) { setOut(null); return setErr('Enter room perimeter, wall height and roll dimensions greater than 0.') }
    const stripsNeeded = Math.ceil((p * 12) / rw)
    const stripLenIn = (h * 12) + rep
    const stripsPerRoll = Math.max(1, Math.floor((rl * 12) / stripLenIn))
    const rolls = Math.ceil(stripsNeeded / stripsPerRoll)
    setErr('')
    setOut({ stripsNeeded, stripsPerRoll, rolls })
  }

  return (
    <div>
      <div className="row">
        <Field label="Room perimeter (ft)"><input type="number" min="0" value={perimeter} onChange={(e) => setPerimeter(e.target.value)} /></Field>
        <Field label="Wall height (ft)"><input type="number" min="0" value={height} onChange={(e) => setHeight(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Roll width (in)"><input type="number" min="1" value={rollW} onChange={(e) => setRollW(e.target.value)} /></Field>
        <Field label="Roll length (ft)"><input type="number" min="1" value={rollL} onChange={(e) => setRollL(e.target.value)} /></Field>
        <Field label="Pattern repeat (in, optional)"><input type="number" min="0" value={repeat} onChange={(e) => setRepeat(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate rolls needed</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">You'll need <strong>{out.stripsNeeded} strips</strong> ({out.stripsPerRoll} strips per roll), which is about <strong>{out.rolls} roll{out.rolls === 1 ? '' : 's'}</strong>.<br /><small>Buy one extra roll for pattern matching and mistakes.</small></p>}
    </div>
  )
}
