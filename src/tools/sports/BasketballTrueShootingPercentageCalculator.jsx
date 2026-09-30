import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function BasketballTrueShootingPercentageCalculator() {
  const [pts, setPts] = useState('28')
  const [fga, setFga] = useState('18')
  const [fta, setFta] = useState('6')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const p = parseFloat(pts), f = parseFloat(fga), ft = parseFloat(fta)
      if (isNaN(p) || isNaN(f) || isNaN(ft) || f < 0 || ft < 0 || (f === 0 && ft === 0)) return setErr('Enter valid scoring stats.')
      setErr('')
      const ts = (p / (2 * (f + 0.44 * ft))) * 100
      setRes({ val: `True Shooting Percentage (TS%): ${ts.toFixed(1)}%`, copyText: `TS%: ${ts.toFixed(1)}%` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setPts('28'); setFga('18'); setFta('6'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Total Points Scored">
          <input type="number"  value={pts} onChange={(e) => setPts(e.target.value)} placeholder="" />
        </Field>
        <Field label="Field Goal Attempts (FGA)">
          <input type="number"  value={fga} onChange={(e) => setFga(e.target.value)} placeholder="" />
        </Field>
        <Field label="Free Throw Attempts (FTA)">
          <input type="number"  value={fta} onChange={(e) => setFta(e.target.value)} placeholder="" />
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