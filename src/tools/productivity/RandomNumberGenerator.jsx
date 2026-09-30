import { useState } from 'react'
import { Field, Msg, CopyBtn, download } from '../../components/ui.jsx'
import { num } from '../../utils/calc.js'
import { randomNumbers } from '../../utils/random.js'

export default function RandomNumberGenerator() {
  const [f, setF] = useState({ min: '1', max: '100', count: '1', dec: '0' })
  const [unique, setUnique] = useState(false)
  const [sort, setSort] = useState(false)
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const go = () => {
    setOut(null)
    try {
      const r = randomNumbers({ min: num(f.min), max: num(f.max), count: num(f.count), decimals: num(f.dec), unique, sort })
      setOut(r); setErr('')
    } catch (e) { setErr(e.message) }
  }
  const reset = () => { setF({ min: '1', max: '100', count: '1', dec: '0' }); setUnique(false); setSort(false); setOut(null); setErr('') }
  const text = out ? out.join(', ') : ''
  return (
    <div>
      <div className="row">
        <Field label="Minimum"><input type="number" step="any" value={f.min} onChange={set('min')} /></Field>
        <Field label="Maximum"><input type="number" step="any" value={f.max} onChange={set('max')} /></Field>
        <Field label="How many numbers (1–1000)"><input type="number" min="1" max="1000" step="1" value={f.count} onChange={set('count')} /></Field>
        <Field label="Decimal places (0–6)"><input type="number" min="0" max="6" step="1" value={f.dec} onChange={set('dec')} /></Field>
      </div>
      <label className="check"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> No repeats (unique)</label>
      <label className="check"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} /> Sort ascending</label>
      <div className="actions"><button className="btn" onClick={go}>Generate</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <Msg>{err}</Msg>
      {out && <div className="out" role="status">
        {out.length === 1 ? <p className="pick">{out[0]}</p> : <code>{text}</code>}
        <div className="actions"><CopyBtn text={text} /><button className="btn ghost" onClick={() => download('random-numbers.txt', out.join('\n'))}>Download</button></div>
      </div>}
      <p className="hint">Uses your browser’s secure random generator (crypto.getRandomValues). Both minimum and maximum can be picked. Not suitable for gambling or official draws.</p>
    </div>
  )
}
