import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function VoltageDividerCalculator() {
  const [mode, setMode] = useState('Solve Vout')
  const [vin, setVin] = useState('12')
  const [r1, setR1] = useState('1000')
  const [r2, setR2] = useState('1000')
  const [vout, setVout] = useState('5')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const Vin = Number(vin)
    if (!(Vin > 0)) { setOut(null); return setErr('Enter Vin greater than 0.') }
    if (mode === 'Solve Vout') {
      const R1 = Number(r1), R2 = Number(r2)
      if (!(R1 >= 0 && R2 > 0)) { setOut(null); return setErr('Enter R1 (≥0) and R2 (>0) in ohms.') }
      setErr(''); setOut({ label: 'Vout', value: (Vin * R2 / (R1 + R2)).toFixed(3) + ' V' })
    } else {
      const R1 = Number(r1), Vo = Number(vout)
      if (!(R1 >= 0 && Vo > 0 && Vo < Vin)) { setOut(null); return setErr('Enter R1 (≥0) and a target Vout that is greater than 0 and less than Vin.') }
      const R2 = (R1 * Vo) / (Vin - Vo)
      setErr(''); setOut({ label: 'Required R2', value: R2.toFixed(1) + ' Ω' })
    }
  }

  return (
    <div>
      <Field label="What to solve for"><select value={mode} onChange={(e) => setMode(e.target.value)}><option>Solve Vout</option><option>Solve R2</option></select></Field>
      <div className="row">
        <Field label="Vin (V)"><input type="number" min="0" step="0.01" value={vin} onChange={(e) => setVin(e.target.value)} /></Field>
        <Field label="R1 (Ω)"><input type="number" min="0" value={r1} onChange={(e) => setR1(e.target.value)} /></Field>
        {mode === 'Solve Vout'
          ? <Field label="R2 (Ω)"><input type="number" min="0" value={r2} onChange={(e) => setR2(e.target.value)} /></Field>
          : <Field label="Target Vout (V)"><input type="number" min="0" step="0.01" value={vout} onChange={(e) => setVout(e.target.value)} /></Field>}
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">{out.label}: <strong>{out.value}</strong></p>}
    </div>
  )
}
