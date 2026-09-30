import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function EnergyWorkUnitConverter() {
  const [val, setVal] = useState('500')
  const [fromUnit, setFromUnit] = useState('kcal')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const v = parseFloat(val)
      if (isNaN(v)) return setErr('Enter valid energy amount.')
      setErr('')
      let joules = 0
      if (fromUnit === 'j') joules = v
      else if (fromUnit === 'kj') joules = v * 1000
      else if (fromUnit === 'cal') joules = v * 4.184
      else if (fromUnit === 'kcal') joules = v * 4184
      else if (fromUnit === 'wh') joules = v * 3600
      else if (fromUnit === 'btu') joules = v * 1055.06

      const kj = joules / 1000
      const kcal = joules / 4184
      const wh = joules / 3600
      const btu = joules / 1055.06

      setRes({ val: `${kj.toFixed(2)} kJ | ${kcal.toFixed(1)} kcal | ${wh.toFixed(2)} Wh | ${btu.toFixed(2)} BTU`, copyText: `${v} ${fromUnit} = ${kcal.toFixed(1)} kcal, ${kj.toFixed(2)} kJ` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setVal('500'); setFromUnit('kcal'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="From Unit">
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            <option value="j">Joules (J)</option>
            <option value="kj">Kilojoules (kJ)</option>
            <option value="cal">Calories (cal)</option>
            <option value="kcal">Kilocalories (kcal / Food Cal)</option>
            <option value="wh">Watt-hours (Wh)</option>
            <option value="btu">BTU</option>
          </select>
        </Field>
        
        <Field label="Energy Amount">
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