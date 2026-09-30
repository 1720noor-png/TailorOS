import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DepthOfFieldDofCalculator() {
  const [focalLength, setFocalLength] = useState('50')
  const [aperture, setAperture] = useState('1.8')
  const [distMeters, setDistMeters] = useState('3.0')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const fl = parseFloat(focalLength), f = parseFloat(aperture), d = parseFloat(distMeters) * 1000
      if (isNaN(fl) || isNaN(f) || isNaN(d) || fl <= 0 || f <= 0 || d <= 0) return setErr('Enter valid focal length, f-stop, and distance.')
      setErr('')
      const coc = 0.029
      const H = (fl * fl) / (f * coc)
      const near = (d * (H - fl)) / (H + d - 2 * fl) / 1000
      const far = (d * (H - fl)) / (H - d) / 1000
      const dof = far > 0 ? (far - near).toFixed(2) + ' m' : 'Infinity'
      setRes({ val: `Near Limit: ${near.toFixed(2)} m | Far Limit: ${far > 0 ? far.toFixed(2) + ' m' : 'Infinity'} | Total DOF: ${dof}`, copyText: `DOF @ ${fl}mm f/${f} at ${distMeters}m: Near ${near.toFixed(2)}m, Far ${far > 0 ? far.toFixed(2) + 'm' : 'Infinity'}, Total DOF ${dof}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setFocalLength('50'); setAperture('1.8'); setDistMeters('3.0'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Focal Length (mm)">
          <input type="number"  value={focalLength} onChange={(e) => setFocalLength(e.target.value)} placeholder="" />
        </Field>
        <Field label="Aperture (f/)">
          <input type="number" step="0.1" value={aperture} onChange={(e) => setAperture(e.target.value)} placeholder="" />
        </Field>
        <Field label="Subject Distance (meters)">
          <input type="number" step="0.1" value={distMeters} onChange={(e) => setDistMeters(e.target.value)} placeholder="" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}