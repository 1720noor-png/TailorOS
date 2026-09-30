import { useMemo, useState } from 'react'
import { Field } from '../../components/ui.jsx'

export default function CssUnitConverter() {
  const [value, setValue] = useState('16')
  const [base, setBase] = useState('16')
  const v = Number(value) || 0
  const b = Number(base) || 16
  const px = v
  const results = useMemo(() => ({
    px: px.toFixed(3),
    rem: (px / b).toFixed(4),
    em: (px / b).toFixed(4),
    pt: (px * 0.75).toFixed(3),
    pc: (px * 0.75 / 12).toFixed(4),
    vw_1080: ((px / 1920) * 100).toFixed(4),
  }), [px, b])
  return (
    <div>
      <div className="row">
        <Field label="Value in px"><input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
        <Field label="Root font size (px)"><input type="number" value={base} onChange={(e) => setBase(e.target.value)} /></Field>
      </div>
      <div className="out" role="status">
        <p>rem / em: <strong>{results.rem}</strong></p>
        <p>pt: <strong>{results.pt}</strong></p>
        <p>pc: <strong>{results.pc}</strong></p>
        <p>vw (on a 1920px-wide viewport): <strong>{results.vw_1080}vw</strong></p>
      </div>
      <p className="hint">rem is relative to the root font size; em here assumes the same element font size. Adjust the root size if your project uses a different default.</p>
    </div>
  )
}
