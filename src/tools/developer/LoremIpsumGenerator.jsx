import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'
import { shuffle } from '../../utils/random.js'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function sentence() {
  const n = 6 + Math.floor(Math.random() * 10)
  const w = shuffle(WORDS).slice(0, n)
  return w.join(' ').replace(/^./, (c) => c.toUpperCase()) + '.'
}
function paragraph(sentences) { return Array.from({ length: sentences }, sentence).join(' ') }

export default function LoremIpsumGenerator() {
  const [unit, setUnit] = useState('paragraphs')
  const [count, setCount] = useState('3')
  const [startClassic, setStartClassic] = useState(true)
  const [out, setOut] = useState('')

  const generate = () => {
    const n = Math.min(50, Math.max(1, Number(count) || 1))
    let result
    if (unit === 'paragraphs') {
      const paras = Array.from({ length: n }, () => paragraph(4))
      if (startClassic) paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraph(3)
      result = paras.join('\n\n')
    } else if (unit === 'sentences') {
      const arr = Array.from({ length: n }, sentence)
      result = arr.join(' ')
    } else {
      result = shuffle(WORDS.concat(WORDS)).slice(0, n).join(' ')
    }
    setOut(result)
  }
  return (
    <div>
      <div className="row">
        <Field label="Generate"><select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select></Field>
        <Field label="How many"><input type="number" min="1" max="50" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
      </div>
      <label className="check"><input type="checkbox" checked={startClassic} onChange={(e) => setStartClassic(e.target.checked)} /> Start with the classic "Lorem ipsum dolor sit amet…"</label>
      <div className="actions"><button className="btn" onClick={generate}>Generate</button></div>
      {out && <div className="out" role="status">
        <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{out}</pre>
        <div className="actions">
          <CopyBtn text={out} label="Copy text" />
          <button className="btn ghost" onClick={() => download('lorem-ipsum.txt', out)}>Download .txt</button>
        </div>
      </div>}
    </div>
  )
}
