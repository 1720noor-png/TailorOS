import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function CurtainFabricCalculator() {
  const [trackW, setTrackW] = useState('60')
  const [drop, setDrop] = useState('84')
  const [fullness, setFullness] = useState('2')
  const [fabricW, setFabricW] = useState('54')
  const [hem, setHem] = useState('10')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const tw = Number(trackW), d = Number(drop), f = Number(fullness), fw = Number(fabricW), h = Number(hem) || 0
    if (!(tw > 0 && d > 0 && f > 0 && fw > 0)) { setOut(null); return setErr('Enter track width, drop, fullness ratio and fabric width greater than 0.') }
    const totalFlatWidth = tw * f
    const widthsNeeded = Math.ceil(totalFlatWidth / fw)
    const dropWithHem = d + h
    const totalLengthIn = widthsNeeded * dropWithHem
    const yards = totalLengthIn / 36
    setErr('')
    setOut({ widths: widthsNeeded, yards: yards.toFixed(2), yardsRound: Math.ceil(yards * 4) / 4 })
  }

  return (
    <div>
      <div className="row">
        <Field label="Track/rod width (in)"><input type="number" min="0" value={trackW} onChange={(e) => setTrackW(e.target.value)} /></Field>
        <Field label="Drop / length (in)"><input type="number" min="0" value={drop} onChange={(e) => setDrop(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Fullness ratio (2-2.5 typical)"><input type="number" min="1" step="0.1" value={fullness} onChange={(e) => setFullness(e.target.value)} /></Field>
        <Field label="Fabric width (in)"><input type="number" min="0" value={fabricW} onChange={(e) => setFabricW(e.target.value)} /></Field>
        <Field label="Hem + heading allowance (in)"><input type="number" min="0" value={hem} onChange={(e) => setHem(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate fabric needed</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">You'll need <strong>{out.widths}</strong> fabric width{out.widths === 1 ? '' : 's'}, about <strong>{out.yards} yards</strong> total — round up to <strong>{out.yardsRound} yards</strong> when buying.</p>}
    </div>
  )
}
