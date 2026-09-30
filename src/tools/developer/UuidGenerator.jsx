import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

const genUuid = () => (crypto.randomUUID ? crypto.randomUUID() : [1e7] + -1e3 + -4e3 + -8e3 + -1e11)

export default function UuidGenerator() {
  const [count, setCount] = useState('5')
  const [upper, setUpper] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [list, setList] = useState([])

  const generate = () => {
    const n = Math.min(200, Math.max(1, Number(count) || 1))
    const out = Array.from({ length: n }, () => {
      let u = genUuid()
      if (!hyphens) u = u.replace(/-/g, '')
      return upper ? u.toUpperCase() : u
    })
    setList(out)
  }
  const text = list.join('\n')
  return (
    <div>
      <div className="row">
        <Field label="How many"><input type="number" min="1" max="200" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
      </div>
      <label className="check"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
      <label className="check"><input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} /> Include hyphens</label>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      {list.length > 0 && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{text}</pre>
        <div className="actions">
          <CopyBtn text={text} label="Copy all" />
          <button className="btn ghost" onClick={() => download('uuids.txt', text)}>Download .txt</button>
        </div>
      </div>}
      <p className="hint">Generated with the browser's cryptographically secure random number generator (UUID v4).</p>
    </div>
  )
}
