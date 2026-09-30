import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function CarDepreciationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(35000)
  const [years, setYears] = useState(5)
  const [condition, setCondition] = useState('average') // 'new', 'used'

  const p = Number(purchasePrice) || 0
  const y = Number(years) || 1

  // Depreciation rates: Year 1 = 20%, subsequent yrs = ~12% per year
  const schedule = []
  let currentValue = p

  for (let yr = 1; yr <= Math.min(y, 10); yr++) {
    const rate = yr === 1 ? (condition === 'new' ? 0.20 : 0.12) : 0.12
    const loss = currentValue * rate
    currentValue -= loss
    schedule.push({
      year: yr,
      value: Math.round(currentValue),
      depreciationLoss: Math.round(p - currentValue),
      retainedPct: Math.round((currentValue / p) * 100),
    })
  }

  const finalVal = schedule.length > 0 ? schedule[schedule.length - 1].value : p
  const totalDepreciated = p - finalVal

  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US')

  const reportText = `Car Depreciation Projection Report
-------------------------------------------------
Initial Purchase Price: ${fmt(p)}
Vehicle Status: ${condition.toUpperCase()}
Projection Period: ${years} years

Estimated Value After ${years} Years: ${fmt(finalVal)} (${schedule[schedule.length - 1]?.retainedPct}% retained)
Total Depreciation Loss: ${fmt(totalDepreciated)}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Purchase Price ($)">
          <input type="number" min="1000" max="500000" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
        </Field>
        <Field label="Vehicle Condition at Purchase">
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="new">Brand New Vehicle (-20% Year 1)</option>
            <option value="used">Used / Pre-Owned (-12% Annual)</option>
          </select>
        </Field>
        <Field label="Ownership Horizon (Years)">
          <input type="number" min="1" max="10" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Estimated Value After {years} Yrs: <strong>{fmt(finalVal)}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Total Depreciation Loss: <span className="bad">{fmt(totalDepreciated)}</span> ({100 - (schedule[schedule.length - 1]?.retainedPct || 100)}% value lost)
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Year</th>
              <th>Estimated Resale Value</th>
              <th>Cumulative Value Lost</th>
              <th>Retained Value %</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.year} className={row.year === Number(years) ? 'best' : ''}>
                <td>Year {row.year}</td>
                <td><strong>{fmt(row.value)}</strong></td>
                <td className="bad">{fmt(row.depreciationLoss)}</td>
                <td>{row.retainedPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Depreciation Projection" />
        <button type="button" className="btn ghost" onClick={() => download('car-depreciation.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
