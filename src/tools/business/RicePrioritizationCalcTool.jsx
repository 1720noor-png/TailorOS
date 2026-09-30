import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function RicePrioritizationCalcTool() {
  const [items, setItems] = useState([
    { id: 1, name: 'AI Auto-Complete Search', reach: 5000, impact: 3, confidence: 80, effort: 2 },
    { id: 2, name: 'Mobile Push Notifications', reach: 2000, impact: 2, confidence: 90, effort: 1 },
    { id: 3, name: 'Export to Google Sheets', reach: 1200, impact: 1, confidence: 70, effort: 0.5 }
  ])
  const [name, setName] = useState('')
  const [reach, setReach] = useState('1000')
  const [impact, setImpact] = useState('2') // 3=Massive, 2=High, 1=Medium, 0.5=Low, 0.25=Minimal
  const [confidence, setConfidence] = useState('80') // %
  const [effort, setEffort] = useState('1') // Person-months
  const [err, setErr] = useState('')

  const calculateScore = (r, i, c, e) => {
    if (e <= 0) return 0
    return ((r * i * (c / 100)) / e).toFixed(1)
  }

  const addItem = () => {
    if (!name.trim()) return setErr('Please enter feature/initiative name.')
    const r = parseFloat(reach)
    const i = parseFloat(impact)
    const c = parseFloat(confidence)
    const e = parseFloat(effort)

    if (isNaN(r) || r <= 0) return setErr('Reach must be a positive number.')
    if (isNaN(c) || c <= 0 || c > 100) return setErr('Confidence must be between 1% and 100%.')
    if (isNaN(e) || e <= 0) return setErr('Effort must be greater than 0.')
    setErr('')

    setItems([...items, { id: Date.now(), name: name.trim(), reach: r, impact: i, confidence: c, effort: e }])
    setName('')
    setReach('1000')
    setEffort('1')
  }

  const removeItem = (id) => {
    setItems(items.filter(it => it.id !== id))
  }

  const sortedItems = [...items].sort((a, b) => {
    const scoreA = (a.reach * a.impact * (a.confidence / 100)) / a.effort
    const scoreB = (b.reach * b.impact * (b.confidence / 100)) / b.effort
    return scoreB - scoreA
  })

  const copyText = sortedItems.map((it, idx) => {
    const score = calculateScore(it.reach, it.impact, it.confidence, it.effort)
    return `${idx + 1}. ${it.name} - RICE Score: ${score} (Reach: ${it.reach}, Impact: ${it.impact}, Conf: ${it.confidence}%, Effort: ${it.effort}m)`
  }).join('\n')

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Score and rank product backlog features, strategic bets, and engineering projects using the quantitative RICE framework (Reach × Impact × Confidence / Effort).
      </p>

      <div style={{ padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)', marginBottom: '1.25rem' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>Add Feature / Project to Evaluation</h4>
        <div className="row">
          <Field label="Feature / Initiative Name">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Redesign Checkout Flow" />
          </Field>
          <Field label="Reach (Users / Month)">
            <input type="number" min="1" value={reach} onChange={(e) => setReach(e.target.value)} />
          </Field>
        </div>

        <div className="row" style={{ marginTop: '0.75rem' }}>
          <Field label="Impact Level">
            <select value={impact} onChange={(e) => setImpact(e.target.value)}>
              <option value="3">3.0 - Massive Impact</option>
              <option value="2">2.0 - High Impact</option>
              <option value="1">1.0 - Medium Impact</option>
              <option value="0.5">0.5 - Low Impact</option>
              <option value="0.25">0.25 - Minimal Impact</option>
            </select>
          </Field>
          <Field label="Confidence (%)">
            <select value={confidence} onChange={(e) => setConfidence(e.target.value)}>
              <option value="100">100% - High (Supported by user research & data)</option>
              <option value="80">80% - Medium (Solid qualitative evidence)</option>
              <option value="50">50% - Low (Intuition / Educated guess)</option>
            </select>
          </Field>
          <Field label="Effort (Person-Months / Sprints)">
            <input type="number" step="0.5" min="0.1" value={effort} onChange={(e) => setEffort(e.target.value)} />
          </Field>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={addItem}>+ Add to RICE Table</button>
        </div>
        <Msg>{err}</Msg>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Prioritized Backlog (Highest RICE First)</h3>
          <CopyBtn text={copyText} label="Copy Ranked Backlog" />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Rank</th>
                <th style={{ padding: '0.5rem' }}>Initiative</th>
                <th style={{ padding: '0.5rem' }}>Reach</th>
                <th style={{ padding: '0.5rem' }}>Impact</th>
                <th style={{ padding: '0.5rem' }}>Confidence</th>
                <th style={{ padding: '0.5rem' }}>Effort</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>RICE Score</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((it, idx) => {
                const score = calculateScore(it.reach, it.impact, it.confidence, it.effort)
                return (
                  <tr key={it.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 'bold', color: '#64748b' }}>#{idx + 1}</td>
                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>{it.name}</td>
                    <td style={{ padding: '0.5rem' }}>{it.reach.toLocaleString()}</td>
                    <td style={{ padding: '0.5rem' }}>{it.impact}x</td>
                    <td style={{ padding: '0.5rem' }}>{it.confidence}%</td>
                    <td style={{ padding: '0.5rem' }}>{it.effort} mo</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '1rem', fontWeight: 'bold', color: '#0284c7' }}>{score}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <button type="button" onClick={() => removeItem(it.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>✕ Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
