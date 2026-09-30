import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function BreakEvenPointCalculator() {
  const [fixed, setFixed] = useState('')
  const [priceEach, setPriceEach] = useState('')
  const [costEach, setCostEach] = useState('')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const F = Number(fixed), P = Number(priceEach), C = Number(costEach)
    if (!(F >= 0 && P > 0 && C >= 0)) { setOut(null); return setErr('Enter fixed costs (≥0), price per unit (>0) and variable cost per unit (≥0).') }
    if (C >= P) { setOut(null); return setErr('Variable cost per unit must be less than price per unit, or you can never break even.') }
    const contribution = P - C
    const units = F / contribution
    const revenue = units * P
    setErr('')
    setOut({ units: Math.ceil(units), revenue: revenue.toFixed(2), contribution: contribution.toFixed(2) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Fixed costs ($)"><input type="number" min="0" value={fixed} onChange={(e) => setFixed(e.target.value)} /></Field>
        <Field label="Price per unit ($)"><input type="number" min="0" step="0.01" value={priceEach} onChange={(e) => setPriceEach(e.target.value)} /></Field>
        <Field label="Variable cost per unit ($)"><input type="number" min="0" step="0.01" value={costEach} onChange={(e) => setCostEach(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate break-even</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Break-even point: <strong>{out.units} units</strong> (<strong>${out.revenue}</strong> in revenue)<br /><small>Contribution margin per unit: ${out.contribution}</small></p>}
    </div>
  )
}
