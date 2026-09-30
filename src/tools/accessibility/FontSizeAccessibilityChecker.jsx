import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function FontSizeAccessibilityChecker() {
  const [sizePx, setSizePx] = useState(16)
  const [unit, setUnit] = useState('px')

  const px = Number(sizePx) || 16
  const rem = (px / 16).toFixed(3)
  const pt = Math.round(px * 0.75)

  // Evaluation
  let statusText = ''
  let statusKind = 'good'

  if (px < 12) {
    statusText = 'Inaccessible / Hard to read (< 12px). Violates accessibility guidelines for mobile & desktop body text.'
    statusKind = 'bad'
  } else if (px < 16) {
    statusText = 'Acceptable for secondary UI captions/labels, but below recommended 16px default body text.'
    statusKind = 'warn'
  } else if (px >= 16 && px <= 24) {
    statusText = 'Optimal body & subheading size for web accessibility.'
    statusKind = 'good'
  } else {
    statusText = 'Large Heading text size. Ensures high visibility.'
    statusKind = 'good'
  }

  return (
    <div className="tool-body">
      <div className="row">
        <Field label={`Font Size (${px}px / ${rem}rem)`}>
          <input
            type="range"
            min="8"
            max="48"
            value={sizePx}
            onChange={(e) => setSizePx(Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="out">
        <div>Equivalent Units: <strong>{px} px</strong> = <strong>{rem} rem</strong> = <strong>{pt} pt</strong></div>
        <div
          style={{
            marginTop: '0.4rem',
            color: statusKind === 'bad' ? 'var(--bad)' : statusKind === 'warn' ? '#d97706' : 'var(--ok)',
            fontWeight: 600,
          }}
        >
          {statusText}
        </div>
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginTop: '1.2rem',
        }}
      >
        <div style={{ fontSize: `${px}px`, lineHeight: 1.4, marginBottom: '0.8rem' }}>
          Interactive Live Text Preview ({px}px)
        </div>
        <p style={{ fontSize: `${px}px`, lineHeight: 1.5, margin: 0 }}>
          Accessibility requires legibility across viewports. Users with low vision rely on sufficient font sizes and responsive scaling.
        </p>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={`Font Size: ${px}px / ${rem}rem / ${pt}pt - Status: ${statusText}`} label="Copy Size Assessment" />
      </div>
    </div>
  )
}
