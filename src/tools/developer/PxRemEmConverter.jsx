import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PxRemEmConverter() {
  const [basePx, setBasePx] = useState('16')
  const [targetPx, setTargetPx] = useState('24')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const b = parseFloat(basePx), t = parseFloat(targetPx)
      if (isNaN(b) || isNaN(t) || b <= 0 || t < 0) return setErr('Enter valid positive pixel values.')
      setErr('')
      const rem = t / b
      setRes({ val: `${rem.toFixed(4)}rem (${t}px / ${b}px)`, copyText: `${rem.toFixed(4)}rem` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setBasePx('16'); setTargetPx('24'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Base Root Font Size (px)">
          <input type="number"  value={basePx} onChange={(e) => setBasePx(e.target.value)} placeholder="" />
        </Field>
        <Field label="Target Size (px)">
          <input type="number"  value={targetPx} onChange={(e) => setTargetPx(e.target.value)} placeholder="" />
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