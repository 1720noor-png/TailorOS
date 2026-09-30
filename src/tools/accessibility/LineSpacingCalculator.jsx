import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function LineSpacingCalculator() {
  const [fontSizePx, setFontSizePx] = useState(16)
  const [ratio, setRatio] = useState(1.5) // 1.5 WCAG recommendation

  const fs = Number(fontSizePx) || 16
  const r = Number(ratio) || 1.5

  const lineHeightsPx = Math.round(fs * r * 10) / 10
  const paragraphSpacingPx = Math.round(fs * r * 1.2 * 10) / 10

  const cssSnippet = `/* Accessible Typography Spacing */
.body-text {
  font-size: ${fs}px;
  line-height: ${r}; /* ${lineHeightsPx}px */
  margin-bottom: ${paragraphSpacingPx}px;
}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Font Size (px)">
          <input type="number" min="10" max="48" value={fontSizePx} onChange={(e) => setFontSizePx(e.target.value)} />
        </Field>
        <Field label="Line Height Ratio (Unitless)">
          <select value={ratio} onChange={(e) => setRatio(Number(e.target.value))}>
            <option value={1.2}>1.2 (Tight - Headings only)</option>
            <option value={1.4}>1.4 (Standard UI Text)</option>
            <option value={1.5}>1.5 (WCAG Recommended Body)</option>
            <option value={1.618}>1.618 (Golden Ratio)</option>
            <option value={1.8}>1.8 (Loose / High Contrast)</option>
          </select>
        </Field>
      </div>

      <div className="out">
        <div>Line Height: <strong>{lineHeightsPx} px</strong> (ratio: <strong>{r}</strong>)</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Recommended Paragraph Margin-Bottom: <strong>{paragraphSpacingPx} px</strong> (1.5x to 2x font-size)
        </div>
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '1.2rem',
          marginTop: '1.2rem',
        }}
      >
        <p style={{ fontSize: `${fs}px`, lineHeight: r, margin: `0 0 ${paragraphSpacingPx}px 0` }}>
          Paragraph 1: Good line-height ensures that text lines do not overlap visually. Reading requires contrast between lines so the human eye can easily track from the end of one line to the beginning of the next.
        </p>
        <p style={{ fontSize: `${fs}px`, lineHeight: r, margin: 0 }}>
          Paragraph 2: WCAG 2.1 Success Criterion 1.4.12 recommends a line height of at least 1.5 times the font size for body copy.
        </p>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={cssSnippet} label="Copy CSS Spacing Rules" />
        <button type="button" className="btn ghost" onClick={() => download('line-spacing.css', cssSnippet)}>
          Download CSS (.css)
        </button>
      </div>
    </div>
  )
}
