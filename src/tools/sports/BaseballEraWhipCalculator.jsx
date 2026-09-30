import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function BaseballEraWhipCalculator() {
  const [ip, setIp] = useState('6.2')
  const [er, setEr] = useState('2')
  const [walks, setWalks] = useState('2')
  const [hits, setHits] = useState('5')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const i = parseFloat(ip), e = parseFloat(er), bb = parseFloat(walks), h = parseFloat(hits)
      if (isNaN(i) || isNaN(e) || isNaN(bb) || isNaN(h) || i <= 0 || e < 0 || bb < 0 || h < 0) return setErr('Enter valid pitching stats.')
      setErr('')
      const era = (e * 9) / i
      const whip = (bb + h) / i
      setRes({ val: `ERA: ${era.toFixed(2)} | WHIP: ${whip.toFixed(2)} (${e} ER, ${h} H, ${bb} BB over ${i} IP)`, copyText: `ERA: ${era.toFixed(2)}, WHIP: ${whip.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setIp('6.2'); setEr('2'); setWalks('2'); setHits('5'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Innings Pitched (IP)">
          <input type="number" step="0.1" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="" />
        </Field>
        <Field label="Earned Runs (ER)">
          <input type="number"  value={er} onChange={(e) => setEr(e.target.value)} placeholder="" />
        </Field>
        <Field label="Walks Allowed (BB)">
          <input type="number"  value={walks} onChange={(e) => setWalks(e.target.value)} placeholder="" />
        </Field>
        <Field label="Hits Allowed (H)">
          <input type="number"  value={hits} onChange={(e) => setHits(e.target.value)} placeholder="" />
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