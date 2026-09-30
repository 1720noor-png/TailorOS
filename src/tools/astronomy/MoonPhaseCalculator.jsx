import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function MoonPhaseCalculator() {
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0])

  const targetDate = new Date(dateStr || new Date())

  // Approximate Lunar Cycle Calculation (Synodic Month ~ 29.5305877 days)
  // Reference New Moon: Jan 11, 2024 (11.48 UTC)
  const refNewMoon = new Date('2024-01-11T11:48:00Z')
  const diffTime = targetDate.getTime() - refNewMoon.getTime()
  const diffDays = diffTime / (1000 * 3600 * 24)

  const cycleDays = 29.5305877
  const moonAgeDays = ((diffDays % cycleDays) + cycleDays) % cycleDays

  // Illumination calculation
  const illuminationPct = Math.round((1 - Math.cos((moonAgeDays / cycleDays) * 2 * Math.PI)) * 50)

  let phaseName = ''
  let emoji = '🌑'

  if (moonAgeDays < 1.84566) {
    phaseName = 'New Moon'
    emoji = '🌑'
  } else if (moonAgeDays < 5.53699) {
    phaseName = 'Waxing Crescent'
    emoji = '🌒'
  } else if (moonAgeDays < 9.22831) {
    phaseName = 'First Quarter'
    emoji = '🌓'
  } else if (moonAgeDays < 12.91963) {
    phaseName = 'Waxing Gibbous'
    emoji = '🌔'
  } else if (moonAgeDays < 16.61096) {
    phaseName = 'Full Moon'
    emoji = '🌕'
  } else if (moonAgeDays < 20.30228) {
    phaseName = 'Waning Gibbous'
    emoji = '🌖'
  } else if (moonAgeDays < 23.99361) {
    phaseName = 'Third Quarter'
    emoji = '🌗'
  } else if (moonAgeDays < 27.68493) {
    phaseName = 'Waning Crescent'
    emoji = '🌘'
  } else {
    phaseName = 'New Moon'
    emoji = '🌑'
  }

  const reportText = `Moon Phase Assessment for ${dateStr}
-----------------------------------------------
Phase Name: ${emoji} ${phaseName}
Moon Age in Cycle: ${moonAgeDays.toFixed(1)} / 29.5 days
Illumination Percentage: ${illuminationPct}% illuminated`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Select Calendar Date">
          <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
        </Field>
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '2rem 1rem',
          textAlign: 'center',
          margin: '1.2rem 0',
        }}
      >
        <div style={{ fontSize: '4.5rem', lineHeight: 1 }}>{emoji}</div>
        <h2 style={{ margin: '0.6rem 0 0.2rem' }}>{phaseName}</h2>
        <div className="hint">
          {illuminationPct}% Illuminated | Day {moonAgeDays.toFixed(1)} of 29.5 Day Lunar Cycle
        </div>
      </div>

      <div className="out">
        <div>Moon Phase: <strong>{phaseName} ({emoji})</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Disk Illumination: <strong>{illuminationPct}%</strong> | Synodic Cycle Age: {moonAgeDays.toFixed(1)} days
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Phase Info" />
        <button type="button" className="btn ghost" onClick={() => download('moon-phase-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
