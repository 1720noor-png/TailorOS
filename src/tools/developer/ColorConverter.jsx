import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
const hsl2rgb = (h, s, l) => { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l), k = (n) => (n + h / 30) % 12, f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0), f(8), f(4)].map((x) => Math.round(x * 255)) }
const rgb2hsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2
  let h = 0, s = 0
  if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; if (h < 0) h += 360 }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}
function parse(input) {
  const t = input.trim().toLowerCase()
  let m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(t)
  if (m) { let h = m[1]; if (h.length === 3) h = [...h].map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) }
  m = /^rgb\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)$/.exec(t)
  if (m) { const v = m.slice(1).map(Number); if (v.some((x) => x > 255)) throw new Error('RGB values must be between 0 and 255.'); return v }
  m = /^hsl\(\s*(\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/.exec(t)
  if (m) { const [h, s, l] = m.slice(1).map(Number); if (h > 360 || s > 100 || l > 100) throw new Error('HSL needs hue 0–360 and saturation/lightness 0–100%.'); return hsl2rgb(h, s, l) }
  throw new Error('Unrecognised colour. Try #1e90ff, rgb(30, 144, 255) or hsl(210, 100%, 56%).')
}
export default function ColorConverter() {
  const [v, setV] = useState('')
  const [rgb, setRgb] = useState(null)
  const [err, setErr] = useState('')
  const conv = (val = v) => { setRgb(null); if (!val.trim()) return setErr('Enter a colour value.'); try { setRgb(parse(val)); setErr('') } catch (e) { setErr(e.message) } }
  const hex = rgb && '#' + rgb.map((x) => x.toString(16).padStart(2, '0')).join('')
  const out = rgb && [['HEX', hex], ['RGB', `rgb(${rgb.join(', ')})`], ['HSL', (([h, s, l]) => `hsl(${h}, ${s}%, ${l}%)`)(rgb2hsl(rgb))]]
  return (
    <div>
      <div className="row">
        <Field label="HEX, RGB or HSL value"><input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && conv()} placeholder="#1e90ff" spellCheck="false" /></Field>
        <Field label="Or pick a colour"><input type="color" value={hex || '#1e90ff'} onChange={(e) => { setV(e.target.value); conv(e.target.value) }} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={() => conv()}>Convert</button><button className="btn ghost" onClick={() => { setV(''); setRgb(null); setErr('') }}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status"><div className="swatch" style={{ background: hex }} aria-label={`Preview of ${hex}`} />{out.map(([k, x]) => <p key={k}>{k}: <code style={{ display: 'inline' }}>{x}</code> <CopyBtn text={x} /></p>)}</div>}
    </div>
  )
}
