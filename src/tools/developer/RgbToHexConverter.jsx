import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function RgbToHexConverter() {
  const [r, setR] = useState(59)
  const [g, setG] = useState(130)
  const [b, setB] = useState(246)

  const toHex = (c) => {
    const val = Math.min(255, Math.max(0, parseInt(c) || 0))
    const hex = val.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  const hexCode = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()

  return (
    <div>
      <div className="row">
        <Field label="Red (0-255)">
          <input type="number" min="0" max="255" value={r} onChange={e => setR(e.target.value)} />
        </Field>
        <Field label="Green (0-255)">
          <input type="number" min="0" max="255" value={g} onChange={e => setG(e.target.value)} />
        </Field>
        <Field label="Blue (0-255)">
          <input type="number" min="0" max="255" value={b} onChange={e => setB(e.target.value)} />
        </Field>
      </div>
      <div className="out" role="status" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: hexCode, border: '1px solid #ccc' }} />
        <div>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{hexCode}</p>
          <CopyBtn text={hexCode} />
        </div>
      </div>
      <p className="hint">Convert RGB color channels into standard hexadecimal representation.</p>
    </div>
  )
}
