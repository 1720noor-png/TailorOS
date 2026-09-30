import { useState } from 'react'

const SYNONYM_MAP = {
  'important': ['crucial', 'vital', 'essential', 'significant'],
  'help': ['assist', 'aid', 'support', 'facilitate'],
  'use': ['utilize', 'employ', 'apply', 'leverage'],
  'fast': ['rapid', 'quick', 'swift', 'expeditious'],
  'good': ['excellent', 'superb', 'outstanding', 'beneficial'],
  'bad': ['adverse', 'unfavorable', 'poor', 'substandard'],
  'start': ['initiate', 'commence', 'embark on', 'launch'],
  'change': ['modify', 'alter', 'transform', 'adjust'],
  'show': ['demonstrate', 'display', 'illustrate', 'reveal'],
  'make': ['create', 'produce', 'construct', 'generate'],
  'big': ['substantial', 'considerable', 'extensive', 'sizable'],
  'small': ['compact', 'minor', 'modest', 'limited']
}

export default function Paraphraser() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('standard')
  const [result, setResult] = useState('')

  const paraphrase = () => {
    if (!text.trim()) return

    const words = text.split(/\b/)
    const output = words
      .map((word) => {
        const lower = word.toLowerCase()
        if (SYNONYM_MAP[lower]) {
          const options = SYNONYM_MAP[lower]
          let choice = options[0]
          if (mode === 'creative') choice = options[Math.floor(Math.random() * options.length)]
          if (mode === 'formal') choice = options[options.length - 1]

          if (word[0] === word[0].toUpperCase()) {
            choice = choice.charAt(0).toUpperCase() + choice.slice(1)
          }
          return choice
        }
        return word
      })
      .join('')

    setResult(output)
  }

  return (
    <div className="panel">
      <h2>Paraphrasing Tool</h2>
      <p className="hint">Rewrite sentences and vocabulary using smart synonym replacement modes.</p>

      <div className="field">
        <span>Enter Original Text</span>
        <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste sentences here..." />
      </div>

      <div className="field">
        <span>Paraphrase Mode</span>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="standard">Standard (Balanced synonyms)</option>
          <option value="formal">Formal (Professional vocabulary)</option>
          <option value="creative">Creative (Varied phrasing)</option>
        </select>
      </div>

      <div className="actions">
        <button className="btn" disabled={!text.trim()} onClick={paraphrase}>Paraphrase Text</button>
      </div>

      {result && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3>Paraphrased Result</h3>
            <button className="btn ghost" onClick={() => navigator.clipboard.writeText(result)}>Copy</button>
          </div>
          <div className="doc">{result}</div>
        </div>
      )}
    </div>
  )
}
