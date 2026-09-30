import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function ColorBlindnessSimulator() {
  const [baseColor, setBaseColor] = useState('#0b5fff')

  // Hex to RGB
  const hexToRgb = (hex) => {
    let c = hex.replace('#', '')
    if (c.length === 3) c = c.split('').map((x) => x + x).join('')
    const num = parseInt(c, 16) || 0
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
  }

  const rgbToHex = (r, g, b) =>
    '#' +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'))
      .join('')

  const [r, g, b] = hexToRgb(baseColor)

  // Simulation Matrices (Approximate linear transformations)
  // Protanopia (Red-Blind)
  const protanR = 0.56667 * r + 0.43333 * g + 0.0 * b
  const protanG = 0.55833 * r + 0.44167 * g + 0.0 * b
  const protanB = 0.0 * r + 0.24167 * g + 0.75833 * b
  const protanHex = rgbToHex(protanR, protanG, protanB)

  // Deuteranopia (Green-Blind)
  const deutanR = 0.625 * r + 0.375 * g + 0.0 * b
  const deutanG = 0.7 * r + 0.3 * g + 0.0 * b
  const deutanB = 0.0 * r + 0.3 * g + 0.7 * b
  const deutanHex = rgbToHex(deutanR, deutanG, deutanB)

  // Tritanopia (Blue-Blind)
  const tritanR = 0.95 * r + 0.05 * g + 0.0 * b
  const tritanG = 0.0 * r + 0.43333 * g + 0.56667 * b
  const tritanB = 0.0 * r + 0.475 * g + 0.525 * b
  const tritanHex = rgbToHex(tritanR, tritanG, tritanB)

  // Achromatopsia (Monochromacy / Grayscale)
  const gray = 0.299 * r + 0.587 * g + 0.114 * b
  const achroHex = rgbToHex(gray, gray, gray)

  const simulations = [
    { type: 'Normal Trichromacy', name: 'Standard Vision', hex: baseColor },
    { type: 'Protanopia', name: 'Red-Blind Vision (~1% males)', hex: protanHex },
    { type: 'Deuteranopia', name: 'Green-Blind Vision (~5% males)', hex: deutanHex },
    { type: 'Tritanopia', name: 'Blue-Blind Vision (&lt;1% population)', hex: tritanHex },
    { type: 'Achromatopsia', name: 'Monochromacy / Total Color Blindness', hex: achroHex },
  ]

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Choose Base Palette Color">
          <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Base Hex: <strong>{baseColor}</strong> (RGB: {r}, {g}, {b})</div>
      </div>

      <div className="grid" style={{ marginTop: '1.2rem' }}>
        {simulations.map((s) => (
          <div
            key={s.type}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '1rem',
            }}
          >
            <div
              style={{
                height: '80px',
                background: s.hex,
                borderRadius: '8px',
                marginBottom: '0.6rem',
                border: '1px solid var(--line)',
              }}
            />
            <h4 style={{ margin: '0 0 0.2rem' }}>{s.type}</h4>
            <div className="hint" style={{ marginBottom: '0.4rem' }}>{s.name}</div>
            <code>{s.hex.toUpperCase()}</code>
          </div>
        ))}
      </div>

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn
          text={`Color Simulation Breakdown for ${baseColor}:\n${simulations.map((s) => `• ${s.type}: ${s.hex.toUpperCase()}`).join('\n')}`}
          label="Copy Simulation Data"
        />
      </div>
    </div>
  )
}
