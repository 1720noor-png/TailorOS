import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'

export default function HexToRgbConverter() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState('rgb(59, 130, 246)')
  const [err, setErr] = useState('')

  const convert = (val) => {
    setHex(val)
    setErr('')
    let clean = val.replace('#', '').trim()
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('')
    }
    if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
      setErr('Enter a valid 3 or 6 digit hex code.')
      return
    }
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    setRgb(`rgb(${r}, ${g}, ${b})`)
  }

  return (
    <div>
      <Field label="HEX Color">
        <input value={hex} onChange={e => convert(e.target.value)} placeholder="#3b82f6" />
      </Field>
      <Msg>{err}</Msg>
      {!err && (
        <div className="out" role="status" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: hex, border: '1px solid #ccc' }} />
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{rgb}</p>
            <CopyBtn text={rgb} />
          </div>
        </div>
      )}
      <p className="hint">Convert hex color values directly to RGB format.</p>
    </div>
  )
}
