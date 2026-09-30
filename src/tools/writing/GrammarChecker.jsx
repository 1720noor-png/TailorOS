import { useState } from 'react'

const MISSPELLINGS = {
  'teh': 'the',
  'recieve': 'receive',
  'seperate': 'separate',
  'definately': 'definitely',
  'occured': 'occurred',
  'alot': 'a lot',
  'tought': 'thought',
  'goverment': 'government',
  'whith': 'with',
  'thier': 'their'
}

export default function GrammarChecker() {
  const [text, setText] = useState('')
  const [issues, setIssues] = useState([])
  const [correctedText, setCorrectedText] = useState('')
  const [checked, setChecked] = useState(false)

  const checkText = () => {
    if (!text.trim()) return

    const foundIssues = []
    let updated = text

    // Rule 1: Double spaces
    if (/ {2,}/.test(updated)) {
      foundIssues.push({
        type: 'spacing',
        message: 'Multiple consecutive spaces detected',
        original: '  ',
        replacement: ' '
      })
      updated = updated.replace(/ {2,}/g, ' ')
    }

    // Rule 2: Repeated words
    const repeatedWordRegex = /\b(\w+)\s+\1\b/gi
    let match
    while ((match = repeatedWordRegex.exec(text)) !== null) {
      foundIssues.push({
        type: 'repetition',
        message: `Repeated word '${match[1]}'`,
        original: match[0],
        replacement: match[1]
      })
    }
    updated = updated.replace(repeatedWordRegex, '$1')

    // Rule 3: Common misspellings
    Object.keys(MISSPELLINGS).forEach((bad) => {
      const regex = new RegExp(`\\b${bad}\\b`, 'gi')
      if (regex.test(text)) {
        foundIssues.push({
          type: 'spelling',
          message: `Possible misspelling '${bad}'`,
          original: bad,
          replacement: MISSPELLINGS[bad]
        })
        updated = updated.replace(regex, MISSPELLINGS[bad])
      }
    })

    // Rule 4: Sentence capitalization
    const sentenceCapRegex = /([.!?]\s+)([a-z])/g
    updated = updated.replace(sentenceCapRegex, (m, p1, p2) => p1 + p2.toUpperCase())

    setIssues(foundIssues)
    setCorrectedText(updated)
    setChecked(true)
  }

  return (
    <div className="panel">
      <h2>Grammar & Spell Checker</h2>
      <p className="hint">Check text for spelling errors, word repetitions, capitalization, and formatting issues.</p>

      <div className="field">
        <span>Enter Text to Check</span>
        <textarea rows={6} value={text} onChange={(e) => { setText(e.target.value); setChecked(false); }} placeholder="Type or paste your text here..." />
      </div>

      <div className="actions">
        <button className="btn" disabled={!text.trim()} onClick={checkText}>Check Grammar & Spelling</button>
      </div>

      {checked && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <h3>Analysis Results</h3>

          {issues.length === 0 ? (
            <div className="msg ok">✅ No major grammar or spelling issues detected!</div>
          ) : (
            <div>
              <p className="hint">Found {issues.length} potential issue(s):</p>
              <ul className="items">
                {issues.map((iss, i) => (
                  <li key={i} className="item">
                    <span>⚠️ {iss.message} (Original: <code>"{iss.original}"</code>)</span>
                    <span style={{ color: 'var(--ok)', fontWeight: 600 }}>Suggested: "{iss.replacement}"</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h4>Corrected Version</h4>
              <button className="btn ghost" onClick={() => navigator.clipboard.writeText(correctedText)}>Copy Corrected</button>
            </div>
            <div className="doc">{correctedText}</div>
          </div>
        </div>
      )}
    </div>
  )
}
