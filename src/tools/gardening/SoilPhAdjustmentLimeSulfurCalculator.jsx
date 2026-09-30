import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SoilPhAdjustmentLimeSulfurCalculator() {
  const [areaSqft, setAreaSqft] = useState('200')
  const [currentPh, setCurrentPh] = useState('5.5')
  const [targetPh, setTargetPh] = useState('6.5')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const area = parseFloat(areaSqft), cur = parseFloat(currentPh), tgt = parseFloat(targetPh)
      if (isNaN(area) || isNaN(cur) || isNaN(tgt) || area <= 0 || cur < 3 || tgt > 9) return setErr('Enter valid area and pH values.')
      setErr('')
      const diff = tgt - cur
      if (Math.abs(diff) < 0.1) return setRes({ val: 'Soil pH is already at target level!', copyText: 'No adjustment needed.' })
      if (diff > 0) {
        const lbsLimePer1000 = diff * 30
        const totalLime = (area / 1000) * lbsLimePer1000
        setRes({ val: `Add approx. ${totalLime.toFixed(1)} lbs of Agricultural Lime to raise pH from ${cur} to ${tgt}.`, copyText: `Add ${totalLime.toFixed(1)} lbs Agricultural Lime for ${area} sq ft garden.` })
      } else {
        const lbsSulfurPer1000 = Math.abs(diff) * 10
        const totalSulfur = (area / 1000) * lbsSulfurPer1000
        setRes({ val: `Add approx. ${totalSulfur.toFixed(1)} lbs of Elemental Sulfur to lower pH from ${cur} to ${tgt}.`, copyText: `Add ${totalSulfur.toFixed(1)} lbs Elemental Sulfur for ${area} sq ft garden.` })
      }
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAreaSqft('200'); setCurrentPh('5.5'); setTargetPh('6.5'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Garden Area (Square Feet)">
          <input type="number"  value={areaSqft} onChange={(e) => setAreaSqft(e.target.value)} placeholder="" />
        </Field>
        <Field label="Current Soil pH">
          <input type="number" step="0.1" value={currentPh} onChange={(e) => setCurrentPh(e.target.value)} placeholder="" />
        </Field>
        <Field label="Target Soil pH">
          <input type="number" step="0.1" value={targetPh} onChange={(e) => setTargetPh(e.target.value)} placeholder="" />
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