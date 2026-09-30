import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function VehicleMaintenancePlanner() {
  const [items, setItems] = useState([
    { id: 1, service: 'Engine Oil & Filter Change', interval: ' Every 8,000 km / 6 Months', estCost: 75, status: 'Due Soon' },
    { id: 2, name: 'Tire Rotation & Balance', interval: 'Every 10,000 km', estCost: 50, status: 'OK' },
    { id: 3, name: 'Brake Fluid Flush', interval: 'Every 2 Years', estCost: 140, status: 'OK' },
    { id: 4, name: 'Cabin & Engine Air Filters', interval: 'Every 20,000 km', estCost: 60, status: 'Due Soon' },
  ])

  const [service, setService] = useState('')
  const [interval, setInterval] = useState('')
  const [cost, setCost] = useState('')

  const addItem = (e) => {
    e.preventDefault()
    if (!service.trim()) return
    setItems((prev) => [
      ...prev,
      { id: Date.now(), service: service.trim(), interval: interval.trim() || 'Annual', estCost: Number(cost) || 0, status: 'Due Soon' },
    ])
    setService('')
    setInterval('')
    setCost('')
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const totalCost = items.reduce((acc, curr) => acc + curr.estCost, 0)

  const fmt = (n) => '$' + n.toFixed(2)

  const reportText = `Vehicle Maintenance Cost Plan
------------------------------------------------
Total Maintenance Budgeted: ${fmt(totalCost)}

Service Checklist:
${items.map((i) => `• ${i.service} (${i.interval}): ${fmt(i.estCost)} [Status: ${i.status}]`).join('\n')}`

  return (
    <div className="tool-body">
      <form onSubmit={addItem} className="row" style={{ marginBottom: '1.2rem' }}>
        <Field label="Service / Maintenance Task">
          <input type="text" placeholder="e.g. Spark Plugs Replacement" value={service} onChange={(e) => setService(e.target.value)} />
        </Field>
        <Field label="Service Interval">
          <input type="text" placeholder="e.g. Every 50,000 km" value={interval} onChange={(e) => setInterval(e.target.value)} />
        </Field>
        <Field label="Est. Cost ($)">
          <input type="number" min="0" placeholder="150" value={cost} onChange={(e) => setCost(e.target.value)} />
        </Field>
        <div style={{ display: 'flex', alignItems: 'end', marginBottom: '0.8rem' }}>
          <button type="submit" className="btn">
            ➕ Add Task
          </button>
        </div>
      </form>

      <div className="out">
        <div>Total Planned Maintenance Costs: <strong>{fmt(totalCost)}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Scheduled Service Items: {items.length}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Service Item</th>
              <th>Recommended Interval</th>
              <th>Estimated Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td><strong>{i.service}</strong></td>
                <td>{i.interval}</td>
                <td>{fmt(i.estCost)}</td>
                <td>
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}
                    onClick={() => removeItem(i.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Maintenance Plan" />
        <button type="button" className="btn ghost" onClick={() => download('vehicle-maintenance-plan.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
