import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, name: '', amt: '' })

export default function RentalPropertyCashFlowCalculator() {
  const [rent, setRent] = useState('')
  const [expenses, setExpenses] = useState([
    { ...blank(), name: 'Mortgage payment', amt: '' },
    { ...blank(), name: 'Property tax', amt: '' },
    { ...blank(), name: 'Insurance', amt: '' },
    { ...blank(), name: 'HOA fees', amt: '' },
    { ...blank(), name: 'Maintenance reserve', amt: '' },
    { ...blank(), name: 'Property management', amt: '' },
  ])
  const upd = (id, v) => setExpenses((r) => r.map((x) => (x.id === id ? { ...x, amt: v } : x)))

  const totalExpenses = expenses.reduce((a, e) => a + (Number(e.amt) || 0), 0)
  const r = Number(rent) || 0
  const cashFlow = r - totalExpenses

  return (
    <div>
      <Field label="Monthly rental income ($)"><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} /></Field>
      {expenses.map((e) => (
        <div className="row" key={e.id}>
          <Field label={e.name}><input type="number" min="0" value={e.amt} onChange={(ev) => upd(e.id, ev.target.value)} /></Field>
        </div>
      ))}
      <p className="out" role="status">
        Total monthly expenses: <strong>${totalExpenses.toFixed(2)}</strong><br />
        Monthly cash flow: <strong style={{ color: cashFlow >= 0 ? undefined : 'var(--danger, #c0392b)' }}>${cashFlow.toFixed(2)}</strong><br />
        Annual cash flow: <strong>${(cashFlow * 12).toFixed(2)}</strong>
      </p>
    </div>
  )
}
