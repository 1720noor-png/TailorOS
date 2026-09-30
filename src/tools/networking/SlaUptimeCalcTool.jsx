import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function SlaUptimeCalcTool() {
  const [slaPct, setSlaPct] = useState('99.9')
  const [customPct, setCustomPct] = useState('')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const presets = [
    { label: '99.0% ("Two Nines")', val: '99.0' },
    { label: '99.5%', val: '99.5' },
    { label: '99.9% ("Three Nines")', val: '99.9' },
    { label: '99.95% (High Availability)', val: '99.95' },
    { label: '99.99% ("Four Nines")', val: '99.99' },
    { label: '99.999% ("Five Nines")', val: '99.999' }
  ]

  const formatSeconds = (totalSeconds) => {
    if (totalSeconds < 1) return `${(totalSeconds * 1000).toFixed(0)} ms`
    if (totalSeconds < 60) return `${totalSeconds.toFixed(1)} seconds`
    const mins = Math.floor(totalSeconds / 60)
    const secs = Math.floor(totalSeconds % 60)
    if (mins < 60) return `${mins}m ${secs}s`
    const hours = Math.floor(mins / 60)
    const remMins = mins % 60
    if (hours < 24) return `${hours}h ${remMins}m ${secs}s`
    const days = Math.floor(hours / 24)
    const remHours = hours % 24
    return `${days}d ${remHours}h ${remMins}m`
  }

  const calc = (targetVal) => {
    try {
      const valStr = targetVal || customPct || slaPct
      const pct = parseFloat(valStr)
      if (isNaN(pct) || pct <= 0 || pct >= 100) return setErr('SLA percentage must be greater than 0 and less than 100.')
      setErr('')

      const downtimeRatio = (100 - pct) / 100

      const secondsInDay = 86400
      const secondsInWeek = secondsInDay * 7
      const secondsInMonth = secondsInDay * 30.4375 // Average month
      const secondsInQuarter = secondsInDay * 91.25
      const secondsInYear = secondsInDay * 365.2425

      const dayDown = secondsInDay * downtimeRatio
      const weekDown = secondsInWeek * downtimeRatio
      const monthDown = secondsInMonth * downtimeRatio
      const quarterDown = secondsInQuarter * downtimeRatio
      const yearDown = secondsInYear * downtimeRatio

      setRes({
        pct: pct.toFixed(pct % 1 === 0 ? 1 : (pct.toString().split('.')[1]?.length || 2)),
        day: formatSeconds(dayDown),
        week: formatSeconds(weekDown),
        month: formatSeconds(monthDown),
        quarter: formatSeconds(quarterDown),
        year: formatSeconds(yearDown),
        copyText: `SLA ${pct}% Permissible Downtime: Daily: ${formatSeconds(dayDown)} | Weekly: ${formatSeconds(weekDown)} | Monthly: ${formatSeconds(monthDown)} | Quarterly: ${formatSeconds(quarterDown)} | Yearly: ${formatSeconds(yearDown)}`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const selectPreset = (p) => {
    setSlaPct(p)
    setCustomPct('')
    calc(p)
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Convert Service Level Agreement (SLA) availability percentages into allowable downtime budgets across daily, weekly, monthly, and annual operational windows.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Popular SLA Tiers:</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {presets.map(p => (
            <button key={p.val} type="button" className={`btn ${slaPct === p.val && !customPct ? '' : 'ghost'}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }} onClick={() => selectPreset(p.val)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Custom SLA Target Percentage (%)">
          <input type="number" step="0.001" min="0.001" max="99.9999" value={customPct || slaPct} onChange={(e) => { setCustomPct(e.target.value); setSlaPct(e.target.value) }} placeholder="e.g. 99.95" />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={() => calc()}>Calculate Downtime Budget</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#0f172a' }}>
            Allowable Downtime for <strong>{res.pct}% Availability</strong>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Per Day</span>
              <strong style={{ fontSize: '1.15rem', color: '#e11d48' }}>{res.day}</strong>
            </div>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Per Week</span>
              <strong style={{ fontSize: '1.15rem', color: '#ea580c' }}>{res.week}</strong>
            </div>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Per Month (30d)</span>
              <strong style={{ fontSize: '1.15rem', color: '#d97706' }}>{res.month}</strong>
            </div>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Per Quarter</span>
              <strong style={{ fontSize: '1.15rem', color: '#4f46e5' }}>{res.quarter}</strong>
            </div>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Per Year (365d)</span>
              <strong style={{ fontSize: '1.15rem', color: '#0284c7' }}>{res.year}</strong>
            </div>
          </div>

          <CopyBtn text={res.copyText} label="Copy SLA Specifications" />
        </div>
      )}
    </div>
  )
}
