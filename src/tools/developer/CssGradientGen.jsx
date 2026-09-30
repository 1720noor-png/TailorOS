import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
export default function CssGradientGen() {
  const [c1, setC1] = useState('#6366f1')
  const [c2, setC2] = useState('#ec4899')
  const [angle, setAngle] = useState('135')
  const grad = 'linear-gradient('+angle+'deg, '+c1+', '+c2+')'
  const css = 'background: '+grad+';'
  return (
    <div>
      <div className="row">
        <Field label="Color 1"><input type="color" value={c1} onChange={e=>setC1(e.target.value)} /></Field>
        <Field label="Color 2"><input type="color" value={c2} onChange={e=>setC2(e.target.value)} /></Field>
        <Field label="Angle (deg)"><input type="number" min="0" max="360" value={angle} onChange={e=>setAngle(e.target.value)} /></Field>
      </div>
      <div style={{background:grad,height:100,borderRadius:8,marginTop:12}} />
      <div className="out" role="status" style={{marginTop:8}}>
        <code>{css}</code>
        <CopyBtn text={css} />
      </div>
      <p className="hint">Adjust colors and angle to preview.</p>
    </div>
  )
}
