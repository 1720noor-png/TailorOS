import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
import { randInt, pickOne } from '../../utils/random.js'

const WORDLIST = ['anchor','breeze','cactus','dolphin','ember','falcon','glacier','harbor','island','jungle','kettle','lantern','meadow','nectar','orbit','pepper','quartz','river','sunset','timber','umbra','violet','willow','yonder','zephyr','amber','blossom','canyon','drift','ember','forest','granite','horizon','ivory','jubilee','knoll','lagoon','marble','nimbus','opal','prairie','quill','ridge','summit','thicket','utopia','valley','whisper','xenon','yarrow']

export default function PassphraseGenerator() {
  const [words, setWords] = useState('4')
  const [sep, setSep] = useState('-')
  const [capitalize, setCapitalize] = useState(true)
  const [addNumber, setAddNumber] = useState(true)
  const [out, setOut] = useState('')

  const generate = () => {
    const n = Math.min(10, Math.max(3, Number(words) || 4))
    let parts = Array.from({ length: n }, () => pickOne(WORDLIST))
    if (capitalize) parts = parts.map((w) => w[0].toUpperCase() + w.slice(1))
    if (addNumber) parts.push(String(randInt(10, 99)))
    setOut(parts.join(sep))
  }
  return (
    <div>
      <div className="row">
        <Field label="Number of words"><input type="number" min="3" max="10" value={words} onChange={(e) => setWords(e.target.value)} /></Field>
        <Field label="Separator"><select value={sep} onChange={(e) => setSep(e.target.value)}>
          <option value="-">Hyphen (-)</option><option value=".">Dot (.)</option><option value=" ">Space</option><option value="">None</option>
        </select></Field>
      </div>
      <label className="check"><input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} /> Capitalize each word</label>
      <label className="check"><input type="checkbox" checked={addNumber} onChange={(e) => setAddNumber(e.target.checked)} /> Add a random number</label>
      <div className="actions"><button className="btn" onClick={generate}>Generate passphrase</button></div>
      {out && <div className="out" role="status">
        <p style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{out}</p>
        <CopyBtn text={out} label="Copy passphrase" />
      </div>}
      <p className="hint">Multi-word passphrases (like "Correct-Horse-Battery-Staple") are long and easy to remember, which makes them hard to brute-force. Generated locally using the browser's secure random generator.</p>
    </div>
  )
}
