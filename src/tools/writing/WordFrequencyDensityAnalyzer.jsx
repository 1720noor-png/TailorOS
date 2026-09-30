import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function WordFrequencyDensityAnalyzer() {
  const [text, setText] = useState('Search engine optimization is vital for modern websites. Optimization helps content rank higher on search engines.')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      if (!text.trim()) return setErr('Paste text to analyze.')
      setErr('')
      const words = text.toLowerCase().match(/\b[a-z0-9]+\b/g) || []
      const total = words.length
      const counts = {}
      words.forEach(w => { if (w.length > 2) counts[w] = (counts[w] || 0) + 1 })
      const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5)
      const topStr = sorted.map(([w, c]) => `"${w}": ${c}x (${((c/total)*100).toFixed(1)}%)`).join(', ')
      setRes({ val: `Total Words: ${total} | Top Keywords: ${topStr}`, copyText: `Total Words: ${total}. Top Keywords: ${topStr}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setText('Search engine optimization is vital for modern websites. Optimization helps content rank higher on search engines.'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Paste Text / Content">
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