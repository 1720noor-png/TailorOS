import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function TorqueUnitConverterTool() {
  const [val, setVal] = useState('100')
  const [fromUnit, setFromUnit] = useState('nm')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const v = parseFloat(val); if (isNaN(v)) return setErr('Enter valid number.'); setErr('')
      let nm = 0
      if (fromUnit === 'nm') nm = v
      else if (fromUnit === 'ftlb') nm = v * 1.35582
      else if (fromUnit === 'inlb') nm = v * 0.112985
      const ftlb = nm / 1.35582, inlb = nm / 0.112985
      setRes({ val: `${nm.toFixed(2)} N·m | ${ftlb.toFixed(2)} ft-lb | ${inlb.toFixed(1)} in-lb`, copyText: `${nm.toFixed(2)} N·m = ${ftlb.toFixed(2)} ft-lb` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setVal('100'); setFromUnit('nm'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="From Unit">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            <option value="nm">Newton-meters (N·m)</option>
            <option value="ftlb">Foot-pounds (ft-lb)</option>
            <option value="inlb">Inch-pounds (in-lb)</option>
          </select>
        </Field>
        
        <Field label="Torque Value">
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