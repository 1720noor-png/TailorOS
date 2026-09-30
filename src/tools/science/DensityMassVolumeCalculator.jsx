import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DensityMassVolumeCalculator() {
  const [v1, setV1] = useState('500')
  const [v2, setV2] = useState('250')
  const [target, setTarget] = useState('d')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const n1 = parseFloat(v1), n2 = parseFloat(v2); if (isNaN(n1) || isNaN(n2) || n1 <= 0 || n2 <= 0) return setErr('Enter positive numbers.'); setErr('')
      let resVal = 0, label = ''
      if (target === 'd') { resVal = n1 / n2; label = 'Density = ' + resVal.toFixed(3) + ' g/cm³' }
      else if (target === 'm') { resVal = n1 * n2; label = 'Mass = ' + resVal.toFixed(2) + ' g' }
      else { resVal = n1 / n2; label = 'Volume = ' + resVal.toFixed(2) + ' cm³' }
      setRes({ val: label, copyText: label })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setV1('500'); setV2('250'); setTarget('d'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Calculate For">
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="d">Density (d)</option>
            <option value="m">Mass (m)</option>
            <option value="v">Volume (v)</option>
          </select>
        </Field>
        
        <Field label="Value 1 (Mass or Density)">
          <input type="number"  value={v1} onChange={(e) => setV1(e.target.value)} placeholder="" />
        </Field>
        <Field label="Value 2 (Volume or Mass)">
          <input type="number"  value={v2} onChange={(e) => setV2(e.target.value)} placeholder="" />
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