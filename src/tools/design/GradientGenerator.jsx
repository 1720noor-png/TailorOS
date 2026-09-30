import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function GradientGenerator() {
  const [type, setType] = useState('linear') // 'linear' or 'radial'
  const [angle, setAngle] = useState(135)
  const [color1, setColor1] = useState('#0b5fff')
  const [stop1, setStop1] = useState(0)
  const [color2, setColor2] = useState('#8a2be2')
  const [stop2, setStop2] = useState(100)

  const gradientExpr =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`
      : `radial-gradient(circle at center, ${color1} ${stop1}%, ${color2} ${stop2}%)`

  const cssCode = `background: ${color1};
background: ${gradientExpr};`

  const presets = [
    { name: 'Ocean Sunset', type: 'linear', angle: 135, c1: '#ff7e5f', s1: 0, c2: '#feb47b', s2: 100 },
    { name: 'Neon Purple', type: 'linear', angle: 90, c1: '#0b5fff', s1: 0, c2: '#8a2be2', s2: 100 },
    { name: 'Emerald Glow', type: 'linear', angle: 45, c1: '#11998e', s1: 0, c2: '#38ef7d', s2: 100 },
    { name: 'Radial Flare', type: 'radial', angle: 0, c1: '#f857a6', s1: 0, c2: '#ff5858', s2: 100 },
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
              setType(p.type)
              setAngle(p.angle)
              setColor1(p.c1)
              setStop1(p.s1)
              setColor2(p.c2)
              setStop2(p.s2)
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="row">
        <Field label="Gradient Type">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="linear">Linear Gradient</option>
            <option value="radial">Radial Gradient</option>
          </select>
        </Field>
        {type === 'linear' && (
          <Field label={`Angle (${angle}°)`}>
            <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
          </Field>
        )}
        <Field label="First Color Stop">
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
        </Field>
        <Field label={`First Stop Position (${stop1}%)`}>
          <input type="range" min="0" max="100" value={stop1} onChange={(e) => setStop1(Number(e.target.value))} />
        </Field>
        <Field label="Second Color Stop">
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
        </Field>
        <Field label={`Second Stop Position (${stop2}%)`}>
          <input type="range" min="0" max="100" value={stop2} onChange={(e) => setStop2(Number(e.target.value))} />
        </Field>
      </div>

      <div
        style={{
          height: '180px',
          borderRadius: '12px',
          background: gradientExpr,
          margin: '1.2rem 0',
          border: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.2rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        Gradient Canvas Preview
      </div>

      <div className="out">
        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>CSS Code Output:</div>
        <code style={{ fontSize: '0.95rem' }}>{cssCode}</code>
      </div>

      <div className="actions">
        <CopyBtn text={cssCode} label="Copy Gradient CSS" />
        <button type="button" className="btn ghost" onClick={() => download('gradient.css', cssCode)}>
          Download CSS (.css)
        </button>
      </div>
    </div>
  )
}
