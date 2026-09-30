import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function BorderRadiusGenerator() {
  const [tl, setTl] = useState('20')
  const [tr, setTr] = useState('20')
  const [br, setBr] = useState('20')
  const [bl, setBl] = useState('20')
  const [unit, setUnit] = useState('px')
  const css = `border-radius: ${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit};`
  const corners = [['Top left', tl, setTl], ['Top right', tr, setTr], ['Bottom right', br, setBr], ['Bottom left', bl, setBl]]
  return (
    <div>
      <div className="row">
        {corners.map(([label, val, setVal]) => (
          <Field key={label} label={label}><input type="number" min="0" max="500" value={val} onChange={(e) => setVal(e.target.value)} /></Field>
        ))}
        <Field label="Unit"><select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="px">px</option><option value="%">%</option></select></Field>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
        <div style={{ width: 160, height: 160, background: 'linear-gradient(135deg, var(--brand, #4f46e5), var(--brand-2, #7c3aed))', borderRadius: `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}` }} />
      </div>
      <div className="out" role="status">
        <pre style={{ font: 'inherit' }}>{css}</pre>
        <CopyBtn text={css} label="Copy CSS" />
      </div>
    </div>
  )
}
