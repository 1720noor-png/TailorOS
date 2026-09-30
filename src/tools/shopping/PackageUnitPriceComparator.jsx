import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PackageUnitPriceComparator() {
  const [p1, setP1] = useState('')
  const [q1, setQ1] = useState('')
  const [p2, setP2] = useState('')
  const [q2, setQ2] = useState('')
  const [unit, setUnit] = useState('oz')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    const v_p1 = parseFloat(p1), v_q1 = parseFloat(q1)
    const v_p2 = parseFloat(p2), v_q2 = parseFloat(q2)
    if (isNaN(v_p1) || isNaN(v_q1) || isNaN(v_p2) || isNaN(v_q2) || v_q1 <= 0 || v_q2 <= 0) {
      return setErr('Enter valid positive prices and quantities.')
    }
    setErr('')
    const u1 = v_p1 / v_q1
    const u2 = v_p2 / v_q2
    const diffPct = Math.abs((u1 - u2) / Math.max(u1, u2)) * 100
    const winner = u1 < u2 ? 'Option 1' : u2 < u1 ? 'Option 2' : 'Both options are equal'
    setRes({ u1: u1.toFixed(4), u2: u2.toFixed(4), winner, diffPct: diffPct.toFixed(1) })
  }

  const reset = () => { setP1(''); setQ1(''); setP2(''); setQ2(''); setRes(null); setErr('') }

  return (
    <div>
      <Field label="Unit of Measurement">
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="oz">Ounces (oz)</option>
          <option value="g">Grams (g)</option>
          <option value="kg">Kilograms (kg)</option>
          <option value="lbs">Pounds (lbs)</option>
          <option value="ml">Milliliters (ml)</option>
          <option value="L">Liters (L)</option>
          <option value="items">Units / Pieces</option>
        </select>
      </Field>
      <div className="row" style={{ marginTop: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3>Option 1</h3>
          <Field label="Price ($)"><input type="number" step="0.01" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="e.g. 4.99" /></Field>
          <Field label={`Quantity (${unit})`}><input type="number" step="any" value={q1} onChange={(e) => setQ1(e.target.value)} placeholder="e.g. 16" /></Field>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Option 2</h3>
          <Field label="Price ($)"><input type="number" step="0.01" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="e.g. 8.49" /></Field>
          <Field label={`Quantity (${unit})`}><input type="number" step="any" value={q2} onChange={(e) => setQ2(e.target.value)} placeholder="e.g. 32" /></Field>
        </div>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Compare Options</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          <p><strong>🏆 Better Value: {res.winner}</strong> ({res.diffPct}% cheaper)</p>
          <p>Option 1: ${res.u1} per {unit}</p>
          <p>Option 2: ${res.u2} per {unit}</p>
          <CopyBtn text={`Option 1: \$${res.u1}/${unit} vs Option 2: \$${res.u2}/${unit}. Best deal: ${res.winner}`} />
        </div>
      )}
    </div>
  )
}