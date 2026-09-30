import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function HardwoodBoardFeetCalculator() {
  const [thicknessIn, setThicknessIn] = useState('2')
  const [widthIn, setWidthIn] = useState('6')
  const [lengthFt, setLengthFt] = useState('8')
  const [quantity, setQuantity] = useState('10')
  const [pricePerBf, setPricePerBf] = useState('4.50')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const t = parseFloat(thicknessIn), w = parseFloat(widthIn), l = parseFloat(lengthFt), q = parseFloat(quantity), p = parseFloat(pricePerBf)
      if (isNaN(t) || isNaN(w) || isNaN(l) || isNaN(q) || t <= 0 || w <= 0 || l <= 0 || q <= 0) return setErr('Enter valid lumber dimensions.')
      setErr('')
      const bfPerPiece = (t * w * l) / 12
      const totalBf = bfPerPiece * q
      const totalCost = totalBf * (p || 0)
      setRes({ val: `Total Volume: ${totalBf.toFixed(2)} Board Feet (${bfPerPiece.toFixed(2)} BF/piece) | Total Cost: $${totalCost.toFixed(2)}`, copyText: `Lumber: ${totalBf.toFixed(2)} Board Feet. Total Cost: $${totalCost.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setThicknessIn('2'); setWidthIn('6'); setLengthFt('8'); setQuantity('10'); setPricePerBf('4.50'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Thickness (Inches)">
          <input type="number"  value={thicknessIn} onChange={(e) => setThicknessIn(e.target.value)} placeholder="" />
        </Field>
        <Field label="Width (Inches)">
          <input type="number"  value={widthIn} onChange={(e) => setWidthIn(e.target.value)} placeholder="" />
        </Field>
        <Field label="Length (Feet)">
          <input type="number"  value={lengthFt} onChange={(e) => setLengthFt(e.target.value)} placeholder="" />
        </Field>
        <Field label="Quantity / Pieces">
          <input type="number"  value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="" />
        </Field>
        <Field label="Price per Board Foot ($)">
          <input type="number" step="0.1" value={pricePerBf} onChange={(e) => setPricePerBf(e.target.value)} placeholder="" />
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