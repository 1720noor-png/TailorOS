import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function TypeScaleGenerator() {
  const [baseSize, setBaseSize] = useState(16)
  const [ratio, setRatio] = useState(1.25) // Major Third default

  const b = Number(baseSize) || 16
  const r = Number(ratio) || 1.25

  const steps = [
    { label: 'xs', p: -2 },
    { label: 'sm', p: -1 },
    { label: 'base', p: 0 },
    { label: 'lg', p: 1 },
    { label: 'xl', p: 2 },
    { label: '2xl', p: 3 },
    { label: '3xl', p: 4 },
    { label: '4xl', p: 5 },
    { label: '5xl', p: 6 },
  ].map((item) => {
    const px = Math.round(b * Math.pow(r, item.p) * 100) / 100
    const rem = Math.round((px / b) * 1000) / 1000
    return { ...item, px, rem }
  })

  const cssSnippet = `:root {
  --font-ratio: ${r};
  --text-xs: ${steps[0].rem}rem; /* ${steps[0].px}px */
  --text-sm: ${steps[1].rem}rem; /* ${steps[1].px}px */
  --text-base: ${steps[2].rem}rem; /* ${steps[2].px}px */
  --text-lg: ${steps[3].rem}rem; /* ${steps[3].px}px */
  --text-xl: ${steps[4].rem}rem; /* ${steps[4].px}px */
  --text-2xl: ${steps[5].rem}rem; /* ${steps[5].px}px */
  --text-3xl: ${steps[6].rem}rem; /* ${steps[6].px}px */
  --text-4xl: ${steps[7].rem}rem; /* ${steps[7].px}px */
  --text-5xl: ${steps[8].rem}rem; /* ${steps[8].px}px */
}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Base Font Size (px)">
          <input type="number" min="8" max="32" value={baseSize} onChange={(e) => setBaseSize(e.target.value)} />
        </Field>
        <Field label="Modular Ratio Scale">
          <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
            <option value="1.067">Minor Second (1.067)</option>
            <option value="1.125">Major Second (1.125)</option>
            <option value="1.2">Minor Third (1.200)</option>
            <option value="1.25">Major Third (1.250)</option>
            <option value="1.333">Perfect Fourth (1.333)</option>
            <option value="1.414">Augmented Fourth (1.414)</option>
            <option value="1.5">Perfect Fifth (1.500)</option>
            <option value="1.618">Golden Ratio (1.618)</option>
          </select>
        </Field>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Token</th>
              <th>Rem Value</th>
              <th>Px Value</th>
              <th>Visual Preview</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s) => (
              <tr key={s.label} className={s.label === 'base' ? 'best' : ''}>
                <td><code>--text-{s.label}</code></td>
                <td>{s.rem} rem</td>
                <td>{s.px} px</td>
                <td style={{ fontSize: `${s.px}px`, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  Sample Type Scale
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="out" style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Generated CSS Custom Properties:</div>
        <pre className="hl">{cssSnippet}</pre>
      </div>

      <div className="actions">
        <CopyBtn text={cssSnippet} label="Copy CSS Variables" />
        <button type="button" className="btn ghost" onClick={() => download('type-scale.css', cssSnippet)}>
          Download CSS (.css)
        </button>
      </div>
    </div>
  )
}
