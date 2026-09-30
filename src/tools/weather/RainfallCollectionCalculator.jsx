import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function RainfallCollectionCalculator() {
  const [area, setArea] = useState('1000')
  const [rain, setRain] = useState('1')
  const [unit, setUnit] = useState('US (sq ft, in, gal)')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const a = Number(area), r = Number(rain)
    if (!(a > 0 && r >= 0)) { setOut(null); return setErr('Enter a roof/catchment area greater than 0 and rainfall of 0 or more.') }
    let gallons
    if (unit === 'US (sq ft, in, gal)') {
      gallons = a * (r / 12) * 7.48052
    } else {
      const liters = a * (r / 1000) * 1000
      gallons = liters
    }
    setErr('')
    setOut({ val: gallons.toFixed(0), label: unit === 'US (sq ft, in, gal)' ? 'gallons' : 'liters' })
  }

  const isUS = unit === 'US (sq ft, in, gal)'

  return (
    <div>
      <Field label="Units"><select value={unit} onChange={(e) => setUnit(e.target.value)}><option>US (sq ft, in, gal)</option><option>Metric (sq m, mm, L)</option></select></Field>
      <div className="row">
        <Field label={`Catchment area (${isUS ? 'sq ft' : 'sq m'})`}><input type="number" min="0" value={area} onChange={(e) => setArea(e.target.value)} /></Field>
        <Field label={`Rainfall (${isUS ? 'inches' : 'mm'})`}><input type="number" min="0" step="0.01" value={rain} onChange={(e) => setRain(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate collected water</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">You could collect about <strong>{Number(out.val).toLocaleString()} {out.label}</strong> of water.</p>}
      <Msg kind="status">Assumes 100% collection efficiency — real systems lose some to overflow, evaporation and first-flush diverters.</Msg>
    </div>
  )
}
