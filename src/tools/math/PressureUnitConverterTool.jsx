import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PressureUnitConverterTool() {
  const [val, setVal] = useState('32')
  const [fromUnit, setFromUnit] = useState('psi')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const v = parseFloat(val)
      if (isNaN(v)) return setErr('Enter a valid pressure number.')
      setErr('')
      // Convert to Pa first
      let pa = 0
      if (fromUnit === 'psi') pa = v * 6894.76
      else if (fromUnit === 'bar') pa = v * 100000
      else if (fromUnit === 'pa') pa = v
      else if (fromUnit === 'kpa') pa = v * 1000
      else if (fromUnit === 'atm') pa = v * 101325
      else if (fromUnit === 'mmhg') pa = v * 133.322

      const psi = pa / 6894.76
      const bar = pa / 100000
      const kpa = pa / 1000
      const atm = pa / 101325
      const mmhg = pa / 133.322

      setRes({ val: `PSI: ${psi.toFixed(2)} | Bar: ${bar.toFixed(3)} | kPa: ${kpa.toFixed(2)} | atm: ${atm.toFixed(4)} | mmHg: ${mmhg.toFixed(1)}`, copyText: `${v} ${fromUnit} = ${psi.toFixed(2)} PSI, ${bar.toFixed(3)} bar, ${kpa.toFixed(2)} kPa` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setVal('32'); setFromUnit('psi'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="From Unit">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            <option value="psi">PSI (Pounds / sq in)</option>
            <option value="bar">Bar</option>
            <option value="pa">Pascal (Pa)</option>
            <option value="kpa">Kilopascal (kPa)</option>
            <option value="atm">Atmosphere (atm)</option>
            <option value="mmhg">mmHg (Torr)</option>
          </select>
        </Field>
        
        <Field label="Pressure Value">
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