import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function ExposureTriangleIsoApertureTool() {
  const [iso1, setIso1] = useState('100')
  const [f1, setF1] = useState('2.8')
  const [iso2, setIso2] = useState('400')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const i1 = parseFloat(iso1), f = parseFloat(f1), i2 = parseFloat(iso2)
      if (isNaN(i1) || isNaN(f) || isNaN(i2) || i1 <= 0 || f <= 0 || i2 <= 0) return setErr('Enter valid ISO and f-stop.')
      setErr('')
      const isoStops = Math.log2(i2 / i1)
      const newF = f * Math.pow(Math.SQRT2, isoStops / 2)
      setRes({ val: `ISO change: ${isoStops > 0 ? '+':''}${isoStops.toFixed(1)} EV stops. Equivalent f-stop at ISO ${i2}: f/${newF.toFixed(1)}`, copyText: `ISO ${i1} @ f/${f} = ISO ${i2} @ f/${newF.toFixed(1)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setIso1('100'); setF1('2.8'); setIso2('400'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Current ISO">
          <input type="number"  value={iso1} onChange={(e) => setIso1(e.target.value)} placeholder="" />
        </Field>
        <Field label="Current Aperture (f/)">
          <input type="number" step="0.1" value={f1} onChange={(e) => setF1(e.target.value)} placeholder="" />
        </Field>
        <Field label="New Target ISO">
          <input type="number"  value={iso2} onChange={(e) => setIso2(e.target.value)} placeholder="" />
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