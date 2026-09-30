import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function HexToRgbHslConverter() {
  const [hex, setHex] = useState('#0b5fff')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      let clean = hex.trim().replace('#', '')
      if (clean.length === 3) clean = clean.split('').map(c => c + c).join('')
      if (clean.length !== 6) return setErr('Enter a valid 6-character HEX color code.')
      setErr('')
      const r = parseInt(clean.substring(0, 2), 16)
      const g = parseInt(clean.substring(2, 4), 16)
      const b = parseInt(clean.substring(4, 6), 16)
      const rgbStr = `rgb(${r}, ${g}, ${b})`
      
      // HSL
      const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255
      const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm)
      let h = 0, s = 0, l = (max + min) / 2
      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
          case gNorm: h = (bNorm - rNorm) / d + 2; break;
          case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6
      }
      const hslStr = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
      setRes({ val: `RGB: ${rgbStr} | HSL: ${hslStr}`, copyText: `${rgbStr}; ${hslStr};` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setHex('#0b5fff'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="HEX Color Code">
          <input type="text"  value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#0b5fff" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}