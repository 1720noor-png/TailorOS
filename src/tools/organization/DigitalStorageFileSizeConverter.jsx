import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DigitalStorageFileSizeConverter() {
  const [val, setVal] = useState('500')
  const [fromUnit, setFromUnit] = useState('gb')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const v = parseFloat(val); if (isNaN(v) || v < 0) return setErr('Enter valid data amount.')
      setErr('')
      let bytes = 0
      if (fromUnit === 'mb') bytes = v * 1e6
      else if (fromUnit === 'gb') bytes = v * 1e9
      else if (fromUnit === 'tb') bytes = v * 1e12

      const mb = bytes / 1e6
      const gb = bytes / 1e9
      const tb = bytes / 1e12
      const gib = bytes / Math.pow(1024, 3)

      setRes({ val: `${gb.toFixed(2)} GB (${gib.toFixed(2)} GiB binary) | ${mb.toLocaleString()} MB | ${tb.toFixed(4)} TB`, copyText: `${v} ${fromUnit.toUpperCase()} = ${gb.toFixed(2)} GB (${gib.toFixed(2)} GiB)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setVal('500'); setFromUnit('gb'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Unit">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            <option value="mb">Megabytes (MB)</option>
            <option value="gb">Gigabytes (GB)</option>
            <option value="tb">Terabytes (TB)</option>
          </select>
        </Field>
        
        <Field label="Data Amount">
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