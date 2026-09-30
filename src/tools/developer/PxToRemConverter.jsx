import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function PxToRemConverter() {
  const [base, setBase] = useState('16')
  const [px, setPx] = useState('24')

  const baseNum = parseFloat(base) || 16
  const pxNum = parseFloat(px) || 0
  const remNum = (pxNum / baseNum).toFixed(4).replace(/\.?0+$/, '')

  return (
    <div>
      <div className="row">
        <Field label="Pixels (px)">
          <input type="number" step="any" value={px} onChange={e => setPx(e.target.value)} placeholder="24" />
        </Field>
        <Field label="Base Font Size (px)">
          <input type="number" step="any" value={base} onChange={e => setBase(e.target.value)} placeholder="16" />
        </Field>
      </div>
      <div className="out" role="status">
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{remNum} rem</p>
        <p style={{ color: '#666', fontSize: '0.85rem' }}>CSS: <code>font-size: {remNum}rem;</code></p>
        <CopyBtn text={`${remNum}rem`} />
      </div>
      <p className="hint">Convert pixel units to rem values based on your root font size.</p>
    </div>
  )
}
