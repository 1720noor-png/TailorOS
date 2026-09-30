import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function JsonToCsvExportConverter() {
  const [json, setJson] = useState('[{"name":"Alice","age":30,"city":"New York"},{"name":"Bob","age":25,"city":"London"}]')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      if (!json.trim()) return setErr('Paste JSON array.')
      setErr('')
      const arr = JSON.parse(json)
      if (!Array.isArray(arr) || arr.length === 0) return setErr('JSON must be a non-empty array of objects.')
      const headers = Object.keys(arr[0])
      const csvRows = [headers.join(',')]
      arr.forEach(obj => {
        const values = headers.map(h => JSON.stringify(obj[h] || ''))
        csvRows.push(values.join(','))
      })
      const csvStr = csvRows.join('\n')
      setRes({ val: csvStr, copyText: csvStr })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setJson('[{"name":"Alice","age":30,"city":"New York"},{"name":"Bob","age":25,"city":"London"}]'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Paste JSON Array">
          <input type="text"  value={json} onChange={(e) => setJson(e.target.value)} placeholder="" />
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