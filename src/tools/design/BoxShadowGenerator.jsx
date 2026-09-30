import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function BoxShadowGenerator() {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(10)
  const [blur, setBlur] = useState(25)
  const [spread, setSpread] = useState(-5)
  const [color, setColor] = useState('#000000')
  const [opacity, setOpacity] = useState(0.25)
  const [inset, setInset] = useState(false)
  const [bgDark, setBgDark] = useState(false)

  // Convert HEX + opacity to RGBA
  const hexToRgba = (hex, op) => {
    let c = hex.replace('#', '')
    if (c.length === 3) c = c.split('').map((x) => x + x).join('')
    const num = parseInt(c, 16) || 0
    const r = (num >> 16) & 255
    const g = (num >> 8) & 255
    const b = num & 255
    return `rgba(${r}, ${g}, ${b}, ${op})`
  }

  const shadowVal = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`
  const cssCode = `box-shadow: ${shadowVal};
-webkit-box-shadow: ${shadowVal};`

  const presets = [
    { name: 'Soft Elevation', x: 0, y: 10, b: 25, s: -5, op: 0.15 },
    { name: 'Hard Drop Shadow', x: 8, y: 8, b: 0, s: 0, op: 0.3 },
    { name: 'Subtle Card Glow', x: 0, y: 4, b: 12, s: 0, op: 0.08 },
    { name: 'Neumorphic Inset', x: 4, y: 4, b: 8, s: 0, op: 0.2, inset: true },
  ]

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            className="btn ghost"
            onClick={() => {
              setOffsetX(p.x)
              setOffsetY(p.y)
              setBlur(p.b)
              setSpread(p.s)
              setOpacity(p.op)
              setInset(!!p.inset)
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="row">
        <Field label={`Horizontal Offset (${offsetX}px)`}>
          <input type="range" min="-50" max="50" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />
        </Field>
        <Field label={`Vertical Offset (${offsetY}px)`}>
          <input type="range" min="-50" max="50" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} />
        </Field>
        <Field label={`Blur Radius (${blur}px)`}>
          <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} />
        </Field>
        <Field label={`Spread Radius (${spread}px)`}>
          <input type="range" min="-50" max="50" value={spread} onChange={(e) => setSpread(Number(e.target.value))} />
        </Field>
        <Field label="Shadow Color">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </Field>
        <Field label={`Opacity (${Math.round(opacity * 100)}%)`}>
          <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
        </Field>
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label className="check">
          <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} />
          Inset Shadow
        </label>
        <label className="check">
          <input type="checkbox" checked={bgDark} onChange={(e) => setBgDark(e.target.checked)} />
          Dark Background Canvas
        </label>
      </div>

      <div
        style={{
          background: bgDark ? '#111827' : '#f3f4f6',
          borderRadius: '12px',
          padding: '3rem 1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background 0.2s ease',
        }}
      >
        <div
          style={{
            width: '200px',
            height: '140px',
            background: bgDark ? '#1f2937' : '#ffffff',
            borderRadius: '12px',
            boxShadow: shadowVal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            color: bgDark ? '#e5e7eb' : '#374151',
          }}
        >
          Box Preview
        </div>
      </div>

      <div className="out" style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Generated CSS Code:</div>
        <code style={{ fontSize: '0.95rem' }}>{cssCode}</code>
      </div>

      <div className="actions">
        <CopyBtn text={cssCode} label="Copy Box Shadow CSS" />
        <button type="button" className="btn ghost" onClick={() => download('box-shadow.css', cssCode)}>
          Download CSS (.css)
        </button>
      </div>
    </div>
  )
}
