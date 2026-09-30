import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function QuarterbackPasserRatingCalculator() {
  const [att, setAtt] = useState('35')
  const [cmp, setCmp] = useState('24')
  const [yds, setYds] = useState('285')
  const [td, setTd] = useState('3')
  const [int, setInt] = useState('1')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const a = parseFloat(att), c = parseFloat(cmp), y = parseFloat(yds), t = parseFloat(td), i = parseFloat(int)
      if (isNaN(a) || isNaN(c) || isNaN(y) || isNaN(t) || isNaN(i) || a <= 0 || c > a) return setErr('Enter valid passing stats.')
      setErr('')
      let mmA = ((c / a) - 0.3) * 5
      let mmB = ((y / a) - 3) * 0.25
      let mmC = (t / a) * 20
      let mmD = 2.375 - ((i / a) * 25)
      const cap = (v) => Math.max(0, Math.min(2.375, v))
      mmA = cap(mmA); mmB = cap(mmB); mmC = cap(mmC); mmD = cap(mmD)
      const rating = ((mmA + mmB + mmC + mmD) / 6) * 100
      setRes({ val: `NFL Passer Rating: ${rating.toFixed(1)} / 158.3 max`, copyText: `Passer Rating: ${rating.toFixed(1)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAtt('35'); setCmp('24'); setYds('285'); setTd('3'); setInt('1'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Pass Attempts">
          <input type="number"  value={att} onChange={(e) => setAtt(e.target.value)} placeholder="" />
        </Field>
        <Field label="Pass Completions">
          <input type="number"  value={cmp} onChange={(e) => setCmp(e.target.value)} placeholder="" />
        </Field>
        <Field label="Passing Yards">
          <input type="number"  value={yds} onChange={(e) => setYds(e.target.value)} placeholder="" />
        </Field>
        <Field label="Touchdowns (TD)">
          <input type="number"  value={td} onChange={(e) => setTd(e.target.value)} placeholder="" />
        </Field>
        <Field label="Interceptions (INT)">
          <input type="number"  value={int} onChange={(e) => setInt(e.target.value)} placeholder="" />
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