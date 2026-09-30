import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// Circle of confusion (mm) by sensor format
const COC = { 'Full frame': 0.030, 'APS-C': 0.020, 'Micro Four Thirds': 0.015, 'Smartphone (1/2.3in)': 0.005 }

export default function DepthOfFieldCalculator() {
  const [focal, setFocal] = useState('50')
  const [fnum, setFnum] = useState('2.8')
  const [dist, setDist] = useState('3')
  const [format, setFormat] = useState('Full frame')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const f = Number(focal), N = Number(fnum), s = Number(dist) * 1000 // mm
    if (!(f > 0 && N > 0 && s > 0)) { setOut(null); return setErr('Enter focal length, f-number and subject distance greater than 0.') }
    const c = COC[format]
    const hyperfocal = (f * f) / (N * c) + f // mm
    const near = (s * (hyperfocal - f)) / (hyperfocal + s - 2 * f)
    let far
    if (s >= hyperfocal) far = Infinity
    else far = (s * (hyperfocal - f)) / (hyperfocal - s)
    setErr('')
    setOut({
      hyperfocal: (hyperfocal / 1000).toFixed(2),
      near: (near / 1000).toFixed(2),
      far: far === Infinity ? '∞' : (far / 1000).toFixed(2),
      total: far === Infinity ? '∞' : ((far - near) / 1000).toFixed(2),
    })
  }

  return (
    <div>
      <div className="row">
        <Field label="Focal length (mm)"><input type="number" min="1" value={focal} onChange={(e) => setFocal(e.target.value)} /></Field>
        <Field label="Aperture (f-number)"><input type="number" min="0.5" step="0.1" value={fnum} onChange={(e) => setFnum(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Subject distance (m)"><input type="number" min="0.1" step="0.1" value={dist} onChange={(e) => setDist(e.target.value)} /></Field>
        <Field label="Sensor format"><select value={format} onChange={(e) => setFormat(e.target.value)}>{Object.keys(COC).map((f) => <option key={f}>{f}</option>)}</select></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Near limit: <strong>{out.near} m</strong> · Far limit: <strong>{out.far} m</strong><br />Total depth of field: <strong>{out.total} m</strong><br /><small>Hyperfocal distance: {out.hyperfocal} m</small></p>}
    </div>
  )
}
