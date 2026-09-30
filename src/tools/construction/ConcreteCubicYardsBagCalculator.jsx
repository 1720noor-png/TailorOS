import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function ConcreteCubicYardsBagCalculator() {
  const [lengthFt, setLengthFt] = useState('12')
  const [widthFt, setWidthFt] = useState('10')
  const [depthInches, setDepthInches] = useState('4')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const l = parseFloat(lengthFt), w = parseFloat(widthFt), d = parseFloat(depthInches)
      if (isNaN(l) || isNaN(w) || isNaN(d) || l <= 0 || w <= 0 || d <= 0) return setErr('Enter valid length, width, and depth.')
      setErr('')
      const cubicFt = l * w * (d / 12)
      const cubicYds = cubicFt / 27
      const bags80lb = Math.ceil(cubicFt / 0.6)
      const bags60lb = Math.ceil(cubicFt / 0.45)
      setRes({ val: `${cubicYds.toFixed(2)} Cubic Yards (${cubicFt.toFixed(1)} cu ft) | Requires approx. ${bags80lb} bags (80lb) or ${bags60lb} bags (60lb)`, copyText: `Concrete required: ${cubicYds.toFixed(2)} cu yds (${bags80lb} x 80lb bags)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setLengthFt('12'); setWidthFt('10'); setDepthInches('4'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Slab Length (Feet)">
          <input type="number"  value={lengthFt} onChange={(e) => setLengthFt(e.target.value)} placeholder="" />
        </Field>
        <Field label="Slab Width (Feet)">
          <input type="number"  value={widthFt} onChange={(e) => setWidthFt(e.target.value)} placeholder="" />
        </Field>
        <Field label="Slab Depth (Inches)">
          <input type="number"  value={depthInches} onChange={(e) => setDepthInches(e.target.value)} placeholder="" />
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