import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DuplicateLineDeduplicator() {
  const [text, setText] = useState('apple\nbanana\napple\norange\nbanana')
  const [sortMode, setSortMode] = useState('none')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      if (!text.trim()) return setErr('Paste text lines.')
      setErr('')
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
      let unique = [...new Set(lines)]
      if (sortMode === 'asc') unique.sort()
      else if (sortMode === 'desc') unique.sort().reverse()
      const out = unique.join('\n')
      setRes({ val: `Removed ${lines.length - unique.length} duplicates. Remaining: ${unique.length} unique lines.\n\n${out}`, copyText: out })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setText('apple\nbanana\napple\norange\nbanana'); setSortMode('none'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        <Field label="Sort Order">
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="none">Keep Original Order</option>
            <option value="asc">Sort A to Z</option>
            <option value="desc">Sort Z to A</option>
          </select>
        </Field>
        
        <Field label="List Items (One per line)">
          <input type="text"  value={text} onChange={(e) => setText(e.target.value)} placeholder="" />
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