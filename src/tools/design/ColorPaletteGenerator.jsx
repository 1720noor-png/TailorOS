import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) h = s = 0
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return [h * 360, s * 100, l * 100]
}
const hsl = (h, s, l) => `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`

export default function ColorPaletteGenerator() {
  const [base, setBase] = useState('#4f46e5')
  const [h, s] = hexToHsl(base)
  const shades = [95, 85, 70, 55, 40, 25, 15].map((l) => hsl(h, s, l))
  const complementary = hsl((h + 180) % 360, s, 50)
  const analogous = [hsl((h + 30) % 360, s, 50), hsl((h - 30 + 360) % 360, s, 50)]
  const triadic = [hsl((h + 120) % 360, s, 50), hsl((h + 240) % 360, s, 50)]
  const Swatch = ({ color }) => <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '4px', gap: 4 }}>
    <div style={{ width: 56, height: 56, borderRadius: 8, background: color, border: '1px solid rgba(0,0,0,.1)' }} />
    <code style={{ fontSize: '.72rem' }}>{color}</code>
  </div>
  return (
    <div>
      <Field label="Base color"><input type="color" value={base} onChange={(e) => setBase(e.target.value)} style={{ width: 60, height: 40 }} /></Field>
      <div className="out">
        <p><strong>Shades</strong></p>
        <div>{shades.map((c) => <Swatch key={c} color={c} />)}</div>
        <p><strong>Complementary</strong></p>
        <div><Swatch color={complementary} /></div>
        <p><strong>Analogous</strong></p>
        <div>{analogous.map((c) => <Swatch key={c} color={c} />)}</div>
        <p><strong>Triadic</strong></p>
        <div>{triadic.map((c) => <Swatch key={c} color={c} />)}</div>
        <CopyBtn text={[...shades, complementary, ...analogous, ...triadic].join(', ')} label="Copy all colors" />
      </div>
      <p className="hint">Generated from your base color's hue and saturation using standard color-wheel relationships.</p>
    </div>
  )
}
