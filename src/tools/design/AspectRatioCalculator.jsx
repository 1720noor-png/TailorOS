import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function AspectRatioCalculator() {
  const [ratioW, setRatioW] = useState(16)
  const [ratioH, setRatioH] = useState(9)
  const [targetWidth, setTargetWidth] = useState(1920)

  const rw = Number(ratioW) || 1
  const rh = Number(ratioH) || 1
  const tw = Number(targetWidth) || 0

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(Math.round(rw), Math.round(rh)) || 1
  const simpleW = Math.round(rw) / divisor
  const simpleH = Math.round(rh) / divisor

  const calcHeight = tw > 0 ? Math.round((tw * rh) / rw) : 0

  const presets = [
    { name: '16:9 Widescreen Video', w: 16, h: 9, sample: 1920 },
    { name: '4:3 Standard Display', w: 4, h: 3, sample: 1024 },
    { name: '1:1 Square (Instagram Post)', w: 1, h: 1, sample: 1080 },
    { name: '9:16 Vertical Story / TikTok', w: 9, h: 16, sample: 1080 },
    { name: '21:9 Ultrawide Cinema', w: 21, h: 9, sample: 2560 },
  ]

  const cssSnippet = `/* Aspect Ratio Box CSS */
.aspect-box {
  width: ${tw}px;
  height: ${calcHeight}px;
  aspect-ratio: ${simpleW} / ${simpleH};
}`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            className="btn ghost"
            onClick={() => {
              setRatioW(p.w)
              setRatioH(p.h)
              setTargetWidth(p.sample)
            }}
          >
            {p.w}:{p.h} ({p.name})
          </button>
        ))}
      </div>

      <div className="row">
        <Field label="Aspect Width Ratio">
          <input type="number" min="1" value={ratioW} onChange={(e) => setRatioW(e.target.value)} />
        </Field>
        <Field label="Aspect Height Ratio">
          <input type="number" min="1" value={ratioH} onChange={(e) => setRatioH(e.target.value)} />
        </Field>
        <Field label="Target Width (px)">
          <input type="number" min="10" value={targetWidth} onChange={(e) => setTargetWidth(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Target Dimension: <strong>{tw} px × {calcHeight} px</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Simplified Aspect Ratio: <strong>{simpleW}:{simpleH}</strong> | Aspect Percentage: {((rh / rw) * 100).toFixed(2)}%
        </div>
      </div>

      <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '300px',
            height: `${Math.min(220, (220 * rh) / rw)}px`,
            maxHeight: '220px',
            background: 'var(--brand)',
            color: 'var(--brandfg)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.1rem',
            textAlign: 'center',
            padding: '0.5rem',
          }}
        >
          {tw} × {calcHeight} px ({simpleW}:{simpleH})
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={cssSnippet} label="Copy CSS Aspect Ratio" />
        <button type="button" className="btn ghost" onClick={() => download('aspect-ratio.css', cssSnippet)}>
          Download CSS (.css)
        </button>
      </div>
    </div>
  )
}
