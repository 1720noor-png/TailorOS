import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function LedResistorValueCalculator() {
  const [vSupply, setVSupply] = useState('5.0')
  const [vLed, setVLed] = useState('2.0')
  const [iLed, setILed] = useState('20')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const vs = parseFloat(vSupply), vl = parseFloat(vLed), il = parseFloat(iLed) / 1000
      if (isNaN(vs) || isNaN(vl) || isNaN(il) || vs <= vl || il <= 0) return setErr('Source voltage must be greater than LED forward voltage.')
      setErr('')
      const rExact = (vs - vl) / il
      const powerW = Math.pow(vs - vl, 2) / rExact
      const e12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000]
      const nearest = e12.reduce((prev, curr) => Math.abs(curr - rExact) < Math.abs(prev - rExact) ? curr : prev)
      setRes({ val: `Exact Resistor: ${rExact.toFixed(1)} Ω | Standard E12 Value: ${nearest} Ω | Power Dissipation: ${(powerW*1000).toFixed(1)} mW (${powerW > 0.25 ? 'Use 1/2W' : 'Use 1/4W'})`, copyText: `Resistor: ${nearest} Ω (Exact: ${rExact.toFixed(1)} Ω)` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setVSupply('5.0'); setVLed('2.0'); setILed('20'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Source Voltage (V)">
          <input type="number" step="0.1" value={vSupply} onChange={(e) => setVSupply(e.target.value)} placeholder="" />
        </Field>
        <Field label="LED Forward Voltage (V)">
          <input type="number" step="0.1" value={vLed} onChange={(e) => setVLed(e.target.value)} placeholder="" />
        </Field>
        <Field label="LED Forward Current (mA)">
          <input type="number"  value={iLed} onChange={(e) => setILed(e.target.value)} placeholder="" />
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