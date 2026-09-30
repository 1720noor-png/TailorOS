import { useState } from 'react'
import { Field, CopyBtn, Msg } from '../../components/ui.jsx'
export default function RandomNumberGen() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [unique, setUnique] = useState(false)
  const [result, setResult] = useState('')
  const [err, setErr] = useState('')
  const generate = () => {
    setErr(''); setResult('')
    const lo = parseInt(min), hi = parseInt(max), n = parseInt(count) || 1
    if (isNaN(lo) || isNaN(hi) || lo >= hi) { setErr('Min must be less than max.'); return }
    if (unique && n > hi - lo + 1) { setErr('Cannot generate that many unique numbers in range.'); return }
    const nums = []
    if (unique) {
      const pool = Array.from({length: hi - lo + 1}, (_, i) => lo + i)
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]] }
      nums.push(...pool.slice(0, n))
    } else {
      for (let i = 0; i < n; i++) nums.push(Math.floor(Math.random() * (hi - lo + 1)) + lo)
    }
    setResult(nums.join(', '))
  }
  return (
    <div>
      <div className="row">
        <Field label="Min"><input type="number" value={min} onChange={e => setMin(e.target.value)} /></Field>
        <Field label="Max"><input type="number" value={max} onChange={e => setMax(e.target.value)} /></Field>
        <Field label="Count"><input type="number" min="1" value={count} onChange={e => setCount(e.target.value)} /></Field>
      </div>
      <label style={{display:'block',margin:'8px 0'}}><input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} /> Unique numbers only</label>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p style={{fontSize:'1.2rem',fontWeight:'bold'}}>{result}</p><CopyBtn text={result} /></div>}
      <p className="hint">Generate random numbers in any range.</p>
    </div>
  )
}
