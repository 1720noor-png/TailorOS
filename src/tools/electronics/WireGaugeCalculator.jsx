import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

// AWG -> ohms per 1000 ft (copper, approx)
const AWG_OHMS = { 20: 10.15, 18: 6.385, 16: 4.016, 14: 2.525, 12: 1.588, 10: 0.9989, 8: 0.6282, 6: 0.3951, 4: 0.2485, 2: 0.1563, '1/0': 0.09827 }

export default function WireGaugeCalculator() {
  const [current, setCurrent] = useState('10')
  const [length, setLength] = useState('25')
  const [voltage, setVoltage] = useState('12')
  const [maxDrop, setMaxDrop] = useState('3')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const I = Number(current), L = Number(length), V = Number(voltage), pct = Number(maxDrop)
    if (!(I > 0 && L > 0 && V > 0 && pct > 0)) { setOut(null); return setErr('Enter current, one-way length, voltage and max drop % greater than 0.') }
    const allowedDropVolts = V * (pct / 100)
    // round-trip length in kft
    const kft = (L * 2) / 1000
    let pick = null
    for (const [awg, ohmsPer1000] of Object.entries(AWG_OHMS)) {
      const dropVolts = I * ohmsPer1000 * kft
      if (dropVolts <= allowedDropVolts) { pick = { awg, dropVolts }; break }
    }
    setErr('')
    setOut(pick
      ? { awg: pick.awg, drop: pick.dropVolts.toFixed(2), allowed: allowedDropVolts.toFixed(2) }
      : { awg: null })
  }

  return (
    <div>
      <div className="row">
        <Field label="Current (A)"><input type="number" min="0.1" step="0.1" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
        <Field label="One-way wire length (ft)"><input type="number" min="1" value={length} onChange={(e) => setLength(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="System voltage (V)"><input type="number" min="1" value={voltage} onChange={(e) => setVoltage(e.target.value)} /></Field>
        <Field label="Max acceptable voltage drop (%)"><input type="number" min="0.1" step="0.1" value={maxDrop} onChange={(e) => setMaxDrop(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Recommend gauge</button></div>
      <Msg>{err}</Msg>
      {out && (out.awg
        ? <p className="out" role="status">Recommended: <strong>{out.awg} AWG</strong> copper wire<br /><small>Estimated drop: {out.drop} V (limit {out.allowed} V)</small></p>
        : <p className="out" role="status">Even the thickest gauge in this table exceeds your drop limit — use a shorter run, higher voltage, or cable rated below 1 AWG.</p>)}
      <Msg kind="status">Estimates for stranded copper wire at room temperature — always check local electrical code for the final gauge.</Msg>
    </div>
  )
}
