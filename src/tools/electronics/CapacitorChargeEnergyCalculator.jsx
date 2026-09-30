import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CapacitorChargeEnergyCalculator() {
  const [capMicroF, setCapMicroF] = useState('100')
  const [volts, setVolts] = useState('25')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const c = parseFloat(capMicroF) / 1e6, v = parseFloat(volts); if (isNaN(c) || isNaN(v) || c <= 0 || v <= 0) return setErr('Enter valid positive capacitance and voltage.'); setErr('')
      const chargeCoulombs = c * v
      const energyJoules = 0.5 * c * v * v
      const energyMilliJoules = energyJoules * 1000
      setRes({ val: `Stored Energy: ${energyMilliJoules.toFixed(2)} mJ (${energyJoules.toFixed(6)} J) | Charge: ${(chargeCoulombs*1000).toFixed(2)} mC`, copyText: `Energy: ${energyMilliJoules.toFixed(2)} mJ, Charge: ${(chargeCoulombs*1000).toFixed(2)} mC` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setCapMicroF('100'); setVolts('25'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Capacitance (µF)">
          <input type="number"  value={capMicroF} onChange={(e) => setCapMicroF(e.target.value)} placeholder="" />
        </Field>
        <Field label="Voltage (V)">
          <input type="number"  value={volts} onChange={(e) => setVolts(e.target.value)} placeholder="" />
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