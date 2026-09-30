import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function BpmDelayTimeLfoCalculator() {
  const [bpm, setBpm] = useState('120')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const b = parseFloat(bpm)
      if (isNaN(b) || b <= 0 || b > 300) return setErr('Enter valid BPM (1-300).')
      setErr('')
      const quarterMs = 60000 / b
      const eighthMs = quarterMs / 2
      const sixteenthMs = quarterMs / 4
      const tripletEighthMs = (60000 / b) * (2 / 3)
      const dottedEighthMs = eighthMs * 1.5
      const lfoHz = b / 60
      setRes({ val: `1/4 Note: ${quarterMs.toFixed(1)} ms | 1/8 Note: ${eighthMs.toFixed(1)} ms | Dotted 1/8: ${dottedEighthMs.toFixed(1)} ms | 1/16 Note: ${sixteenthMs.toFixed(1)} ms | LFO Hz: ${lfoHz.toFixed(2)} Hz`, copyText: `1/4: ${quarterMs.toFixed(1)}ms, 1/8: ${eighthMs.toFixed(1)}ms, Dotted 1/8: ${dottedEighthMs.toFixed(1)}ms` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setBpm('120'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Tempo (BPM)">
          <input type="number"  value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="" />
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