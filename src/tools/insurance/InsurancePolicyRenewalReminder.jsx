import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

let n = 0
const blank = () => ({ id: ++n, name: '', renewal: '' })

export default function InsurancePolicyRenewalReminder() {
  const [policies, setPolicies] = useState([
    { ...blank(), name: 'Auto' }, { ...blank(), name: 'Home/Renters' }, { ...blank(), name: 'Life' },
  ])
  const upd = (id, k, v) => setPolicies((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)))

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const withDays = policies.map((p) => {
    if (!p.renewal) return { ...p, days: null }
    const d = new Date(p.renewal + 'T00:00:00')
    const days = Math.round((d - today) / 86400000)
    return { ...p, days }
  }).sort((a, b) => (a.days ?? Infinity) - (b.days ?? Infinity))

  return (
    <div>
      {policies.map((p, i) => (
        <div className="row" key={p.id}>
          <Field label={`Policy ${i + 1}`}><input value={p.name} onChange={(e) => upd(p.id, 'name', e.target.value)} /></Field>
          <Field label="Renewal date"><input type="date" value={p.renewal} onChange={(e) => upd(p.id, 'renewal', e.target.value)} /></Field>
          <button type="button" className="btn ghost" onClick={() => setPolicies((r) => (r.length > 1 ? r.filter((y) => y.id !== p.id) : r))} aria-label={`Remove ${p.name}`}>Remove</button>
        </div>
      ))}
      <div className="actions"><button className="btn ghost" onClick={() => setPolicies((p) => [...p, blank()])}>Add policy</button></div>
      <div className="out" role="status">
        {withDays.filter((p) => p.days !== null).map((p) => (
          <p key={p.id}>
            <strong>{p.name}</strong>: renews {p.renewal}
            {p.days < 0 ? <span style={{ color: 'var(--danger, #c0392b)' }}> — expired {Math.abs(p.days)} days ago</span> : <> — {p.days} days away</>}
          </p>
        ))}
      </div>
    </div>
  )
}
