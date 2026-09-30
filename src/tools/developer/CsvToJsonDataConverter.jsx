import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CsvToJsonDataConverter() {
  const [csv, setCsv] = useState('name,age,city\nAlice,30,New York\nBob,25,London')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      if (!csv.trim()) return setErr('Paste CSV data.')
      setErr('')
      const lines = csv.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return setErr('CSV requires at least a header line and one data row.')
      const headers = lines[0].split(',').map(h => h.trim())
      const result = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const obj = {}
        headers.forEach((h, idx) => { obj[h] = values[idx] || '' })
        return obj
      })
      const jsonStr = JSON.stringify(result, null, 2)
      setRes({ val: jsonStr, copyText: jsonStr })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setCsv('name,age,city\nAlice,30,New York\nBob,25,London'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Paste CSV Data">
          <input type="text"  value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="" />
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