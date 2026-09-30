import { useState } from 'react'
import { useStored } from '../../components/hooks.js'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'
import { parseOptions, pickOne, shuffle } from '../../utils/random.js'

export default function RandomDecisionMaker() {
  const [text, setText] = useStored('toolhub.decision', '')
  const [remove, setRemove] = useState(false)
  const [result, setResult] = useState(null) // {kind, value}
  const [history, setHistory] = useState([])
  const [err, setErr] = useState('')
  const opts = parseOptions(text)
  const check = () => {
    if (opts.length < 2) { setErr('Enter at least two different options, one per line.'); return false }
    if (opts.length > 200) { setErr('Please use 200 options or fewer.'); return false }
    setErr(''); return true
  }
  const pick = () => {
    if (!check()) return
    const w = pickOne(opts)
    setResult({ kind: 'pick', value: w }); setHistory([w, ...history].slice(0, 10))
    if (remove) setText(opts.filter((o) => o !== w).join('\n'))
  }
  const order = () => { if (check()) setResult({ kind: 'order', value: shuffle(opts) }) }
  const reset = () => { setText(''); setResult(null); setHistory([]); setErr('') }
  return (
    <div>
      <Field label="Options (one per line)"><textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={'Pizza\nSushi\nBiryani'} spellCheck="false" /></Field>
      <p className="hint">{opts.length} option{opts.length === 1 ? '' : 's'} (duplicates and blank lines are ignored)</p>
      <label className="check"><input type="checkbox" checked={remove} onChange={(e) => setRemove(e.target.checked)} /> Remove the winner from the list after picking</label>
      <div className="actions">
        <button className="btn" onClick={pick}>Pick one</button>
        <button className="btn ghost" onClick={order}>Shuffle into a random order</button>
        <button className="btn ghost" onClick={reset}>Clear all</button>
      </div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status">
        {result.kind === 'pick' ? <><p>The choice is:</p><p className="pick">{result.value}</p><CopyBtn text={result.value} /></>
          : <><p>Random order:</p><ol>{result.value.map((v) => <li key={v}>{v}</li>)}</ol><CopyBtn text={result.value.map((v, i) => `${i + 1}. ${v}`).join('\n')} label="Copy order" /></>}
      </div>}
      {history.length > 0 && <p className="hint">Recent picks: {history.join(' · ')}</p>}
      <p className="hint">Uses your browser’s secure random generator, so every option has an equal chance. Your options are saved in this browser only.</p>
    </div>
  )
}
