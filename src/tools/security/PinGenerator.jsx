import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
import { randInt } from '../../utils/random.js'

export default function PinGenerator() {
  const [length, setLength] = useState('6')
  const [count, setCount] = useState('5')
  const [avoidRepeats, setAvoidRepeats] = useState(true)
  const [list, setList] = useState([])

  const genOne = (len) => {
    let tries = 0
    while (tries < 200) {
      const digits = Array.from({ length: len }, () => randInt(0, 9))
      const s = digits.join('')
      const hasRepeat = /(\d)\1\1/.test(s)
      const seq = '0123456789'.includes(s) || '9876543210'.includes(s)
      if (!avoidRepeats || (!hasRepeat && !seq)) return s
      tries++
    }
    return Array.from({ length: len }, () => randInt(0, 9)).join('')
  }
  const generate = () => {
    const len = Math.min(12, Math.max(4, Number(length) || 6))
    const n = Math.min(50, Math.max(1, Number(count) || 1))
    setList(Array.from({ length: n }, () => genOne(len)))
  }
  const text = list.join('\n')
  return (
    <div>
      <div className="row">
        <Field label="PIN length"><input type="number" min="4" max="12" value={length} onChange={(e) => setLength(e.target.value)} /></Field>
        <Field label="How many"><input type="number" min="1" max="50" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
      </div>
      <label className="check"><input type="checkbox" checked={avoidRepeats} onChange={(e) => setAvoidRepeats(e.target.checked)} /> Avoid obvious patterns (repeats, runs like 1234)</label>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      {list.length > 0 && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{text}</pre>
        <CopyBtn text={text} label="Copy all" />
      </div>}
      <p className="hint">Generated locally with the browser's secure random generator. A PIN is weaker than a password — avoid reusing it elsewhere.</p>
    </div>
  )
}
