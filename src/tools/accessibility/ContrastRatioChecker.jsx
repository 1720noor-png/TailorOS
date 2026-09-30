import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function ContrastRatioChecker() {
  const [fgColor, setFgColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#0b5fff')

  // Calculate relative luminance for WCAG contrast
  const getLuminance = (hex) => {
    let c = hex.replace('#', '')
    if (c.length === 3) c = c.split('').map((x) => x + x).join('')
    const rgb = [
      parseInt(c.substring(0, 2), 16) / 255,
      parseInt(c.substring(2, 4), 16) / 255,
      parseInt(c.substring(4, 6), 16) / 255,
    ].map((val) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)))

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }

  const lum1 = getLuminance(fgColor)
  const lum2 = getLuminance(bgColor)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  const ratio = (lighter + 0.05) / (darker + 0.05)

  const formattedRatio = ratio.toFixed(2)

  // WCAG Criteria
  const aaNormal = ratio >= 4.5
  const aaLarge = ratio >= 3.0
  const aaaNormal = ratio >= 7.0
  const aaaLarge = ratio >= 4.5

  const reportText = `WCAG Color Contrast Assessment
-------------------------------------------
Foreground Color: ${fgColor}
Background Color: ${bgColor}

Calculated Contrast Ratio: ${formattedRatio}:1

WCAG Compliance Results:
• Level AA (Normal Text - 4.5:1): ${aaNormal ? 'PASS ✓' : 'FAIL ✗'}
• Level AA (Large Text - 3.0:1): ${aaLarge ? 'PASS ✓' : 'FAIL ✗'}
• Level AAA (Normal Text - 7.0:1): ${aaaNormal ? 'PASS ✓' : 'FAIL ✗'}
• Level AAA (Large Text - 4.5:1): ${aaaLarge ? 'PASS ✓' : 'FAIL ✗'}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Foreground / Text Color">
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
        </Field>
        <Field label="Background Color">
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </Field>
      </div>

      <div
        style={{
          background: bgColor,
          color: fgColor,
          padding: '2rem 1.5rem',
          borderRadius: '12px',
          margin: '1.2rem 0',
          border: '1px solid var(--line)',
          textAlign: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Live Contrast Text Preview
        </div>
        <div style={{ fontSize: '0.95rem' }}>
          The quick brown fox jumps over the lazy dog. (16px Normal Body Text)
        </div>
      </div>

      <div className="out">
        <div>Contrast Ratio: <strong>{formattedRatio} : 1</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          {aaNormal ? (
            <span className="good">✓ Meets WCAG AA Normal Text Standard (≥ 4.5:1)</span>
          ) : (
            <span className="bad">✗ Fails WCAG AA Normal Text Standard (Requires 4.5:1 minimum)</span>
          )}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>WCAG Conformance Level</th>
              <th>Required Ratio</th>
              <th>Result Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Level AA — Normal Text (&lt; 18pt)</td>
              <td>4.5 : 1</td>
              <td className={aaNormal ? 'good' : 'bad'}>
                <strong>{aaNormal ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
            </tr>
            <tr>
              <td>Level AA — Large Text (≥ 18pt or 14pt bold)</td>
              <td>3.0 : 1</td>
              <td className={aaLarge ? 'good' : 'bad'}>
                <strong>{aaLarge ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
            </tr>
            <tr>
              <td>Level AAA — Normal Text (&lt; 18pt)</td>
              <td>7.0 : 1</td>
              <td className={aaaNormal ? 'good' : 'bad'}>
                <strong>{aaaNormal ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
            </tr>
            <tr>
              <td>Level AAA — Large Text (≥ 18pt or 14pt bold)</td>
              <td>4.5 : 1</td>
              <td className={aaaLarge ? 'good' : 'bad'}>
                <strong>{aaaLarge ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Assessment Report" />
        <button type="button" className="btn ghost" onClick={() => download('contrast-assessment.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
