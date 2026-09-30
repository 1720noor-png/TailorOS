import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function Astrophotography500RuleCalculator() {
  const [focalLength, setFocalLength] = useState('24')
  const [cropFactor, setCropFactor] = useState('1.0')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const fl = parseFloat(focalLength), crop = parseFloat(cropFactor)
      if (isNaN(fl) || isNaN(crop) || fl <= 0 || crop <= 0) return setErr('Enter valid focal length and crop factor.')
      setErr('')
      const maxSeconds500 = 500 / (fl * crop)
      const maxSecondsNPF = 300 / (fl * crop) // stricter NPF rule
      setRes({ val: `Max Exposure (500 Rule): ${maxSeconds500.toFixed(1)} seconds | NPF Rule (Sharper): ${maxSecondsNPF.toFixed(1)} seconds`, copyText: `Max Shutter Speed: ${maxSeconds500.toFixed(1)}s (500 Rule)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setFocalLength('24'); setCropFactor('1.0'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Lens Focal Length (mm)">
          <input type="number"  value={focalLength} onChange={(e) => setFocalLength(e.target.value)} placeholder="" />
        </Field>
        <Field label="Sensor Crop Factor (1.0 Full Frame, 1.5 APS-C, 2.0 Micro 4/3)">
          <input type="number" step="0.1" value={cropFactor} onChange={(e) => setCropFactor(e.target.value)} placeholder="" />
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