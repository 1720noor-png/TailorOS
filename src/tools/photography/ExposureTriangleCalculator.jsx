import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22]
const SHUTTERS = [1/2000, 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15, 1/8, 1/4, 1/2, 1]
const ISOS = [50, 100, 200, 400, 800, 1600, 3200, 6400]

export default function ExposureTriangleCalculator() {
  const [aperture, setAperture] = useState(5.6)
  const [shutter, setShutter] = useState(1/125)
  const [iso, setIso] = useState(400)
  const [newAperture, setNewAperture] = useState(5.6)
  const [out, setOut] = useState(null)

  const calc = () => {
    // stops change in aperture (f-number): stops = 2*log2(oldF/newF)
    const apStops = 2 * Math.log2(aperture / newAperture)
    // to keep same exposure, shutter speed must change by -apStops stops (opposite direction of light gained)
    const newShutterVal = shutter * Math.pow(2, -apStops)
    setOut({ apStops: apStops.toFixed(2), newShutter: newShutterVal })
  }

  const fmtShutter = (s) => s >= 1 ? `${s.toFixed(1)}s` : `1/${Math.round(1 / s)}s`

  return (
    <div>
      <div className="row">
        <Field label="Current aperture (f/)"><select value={aperture} onChange={(e) => setAperture(Number(e.target.value))}>{APERTURES.map((a) => <option key={a} value={a}>f/{a}</option>)}</select></Field>
        <Field label="Current shutter speed"><select value={shutter} onChange={(e) => setShutter(Number(e.target.value))}>{SHUTTERS.map((s) => <option key={s} value={s}>{fmtShutter(s)}</option>)}</select></Field>
        <Field label="ISO"><select value={iso} onChange={(e) => setIso(Number(e.target.value))}>{ISOS.map((i) => <option key={i} value={i}>{i}</option>)}</select></Field>
      </div>
      <Field label="New aperture (f/)"><select value={newAperture} onChange={(e) => setNewAperture(Number(e.target.value))}>{APERTURES.map((a) => <option key={a} value={a}>f/{a}</option>)}</select></Field>
      <div className="actions"><button className="btn" onClick={calc}>Calculate equivalent exposure</button></div>
      {out && <p className="out" role="status">Changing to f/{newAperture} is a <strong>{out.apStops > 0 ? '+' : ''}{out.apStops} stop</strong> change.<br />To keep the same exposure at ISO {iso}, set your shutter speed to about <strong>{fmtShutter(out.newShutter)}</strong>.</p>}
      <Msg kind="status">Every full stop doubles or halves the light reaching the sensor — this keeps aperture, shutter and ISO balanced.</Msg>
    </div>
  )
}
