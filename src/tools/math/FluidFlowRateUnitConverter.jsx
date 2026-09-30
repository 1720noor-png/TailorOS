import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function FluidFlowRateUnitConverter() {
  const [val, setVal] = useState('10')
  const [fromUnit, setFromUnit] = useState('gpm')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const v = parseFloat(val); if (isNaN(v) || v < 0) return setErr('Enter valid flow rate.'); setErr('')
      let gpm = 0
      if (fromUnit === 'gpm') gpm = v
      else if (fromUnit === 'lpm') gpm = v * 0.264172
      else if (fromUnit === 'cfs') gpm = v * 448.831
      const lpm = gpm / 0.264172, cfs = gpm / 448.831
      setRes({ val: `${gpm.toFixed(2)} GPM | ${lpm.toFixed(2)} LPM | ${cfs.toFixed(4)} CFS`, copyText: `${gpm.toFixed(2)} GPM = ${lpm.toFixed(2)} LPM` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setVal('10'); setFromUnit('gpm'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="From Unit">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            <option value="gpm">Gallons/Min (GPM)</option>
            <option value="lpm">Liters/Min (LPM)</option>
            <option value="cfs">Cubic Ft/Sec (CFS)</option>
          </select>
        </Field>
        
        <Field label="Flow Rate Value">
          <input type="number"  value={val} onChange={(e) => setVal(e.target.value)} placeholder="" />
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