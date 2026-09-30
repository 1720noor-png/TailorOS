import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const PITCH_FACTOR = { '3/12': 1.031, '4/12': 1.054, '5/12': 1.083, '6/12': 1.118, '7/12': 1.158, '8/12': 1.202, '9/12': 1.25, '10/12': 1.302, '12/12': 1.414 }

export default function RoofingSquareCalculator() {
  const [footprint, setFootprint] = useState('1500')
  const [pitch, setPitch] = useState('6/12')
  const [waste, setWaste] = useState('10')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const fp = Number(footprint), w = Number(waste) || 0
    if (!(fp > 0)) { setOut(null); return setErr('Enter a roof footprint area greater than 0.') }
    const roofArea = fp * PITCH_FACTOR[pitch]
    const withWaste = roofArea * (1 + w / 100)
    const squares = withWaste / 100
    setErr('')
    setOut({ area: withWaste.toFixed(0), squares: Math.ceil(squares * 10) / 10, bundles: Math.ceil((squares * 3)) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Building footprint (sq ft)"><input type="number" min="0" value={footprint} onChange={(e) => setFootprint(e.target.value)} /></Field>
        <Field label="Roof pitch"><select value={pitch} onChange={(e) => setPitch(e.target.value)}>{Object.keys(PITCH_FACTOR).map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Waste allowance (%)"><input type="number" min="0" value={waste} onChange={(e) => setWaste(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate squares needed</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Roof surface area: <strong>{out.area} sq ft</strong><br />That's about <strong>{out.squares} roofing squares</strong> (~{out.bundles} bundles of shingles at 3 bundles/square).</p>}
      <Msg kind="status">A roofing square = 100 sq ft. The pitch factor converts flat footprint area to actual sloped roof area.</Msg>
    </div>
  )
}
