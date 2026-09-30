import { useState } from 'react'

export default function CodeExplainer() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [analysis, setAnalysis] = useState(null)

  const analyzeCode = () => {
    if (!code.trim()) return

    const lines = code.split('\n')
    const cleanCode = code.trim()

    const detectedConcepts = new Set()
    const lineExplanations = []
    const potentialIssues = []
    const suggestions = []

    // 1. Feature detection
    if (/\b(function|def|const|var|let|class|public|private)\b/.test(cleanCode)) {
      detectedConcepts.add('Functions & Methods')
    }
    if (/\b(for|while|do)\b|\.forEach\(|\.map\(/.test(cleanCode)) {
      detectedConcepts.add('Loops & Iteration')
    }
    if (/\b(if|else|switch|case)\b|\?.*:/.test(cleanCode)) {
      detectedConcepts.add('Control Flow & Conditionals')
    }
    if (/\[.*\]|Array|vector|List|dict|Map|Set/.test(cleanCode)) {
      detectedConcepts.add('Data Structures & Collections')
    }
    if (/\b(try|catch|finally|throw|raise|except)\b/.test(cleanCode)) {
      detectedConcepts.add('Error & Exception Handling')
    }
    if (/\b(async|await|Promise|Future|thread)\b/.test(cleanCode)) {
      detectedConcepts.add('Asynchronous / Concurrent Execution')
    }

    // 2. Line breakdown
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*')) return

      const lineNum = index + 1

      if (/for\s*\(|while\s*\(|def\s+|function\s+/.test(trimmed)) {
        lineExplanations.push({ line: lineNum, code: trimmed, explanation: 'Defines code block or loop iteration declaration.' })
      } else if (/if\s*\(|else if|else/.test(trimmed)) {
        lineExplanations.push({ line: lineNum, code: trimmed, explanation: 'Evaluates conditional branch logic.' })
      } else if (/return\b/.test(trimmed)) {
        lineExplanations.push({ line: lineNum, code: trimmed, explanation: 'Returns computed result or exits function.' })
      } else if (trimmed.length > 5) {
        lineExplanations.push({ line: lineNum, code: trimmed, explanation: 'Executes statement or assignment.' })
      }
    })

    // 3. Issue scanning
    if (/var\s+/.test(cleanCode) && language === 'javascript') {
      potentialIssues.push('Uses legacy `var` keyword. Consider using `const` or `let` for block scope safety.')
    }
    if (/==[^=]/.test(cleanCode) && language === 'javascript') {
      potentialIssues.push('Uses loose equality (`==`). Use strict equality (`===`) to avoid type coercion bugs.')
    }
    if (/console\.log/.test(cleanCode)) {
      suggestions.push('Remove or wrap debug `console.log` statements before deploying to production.')
    }

    setAnalysis({
      language: language.toUpperCase(),
      lineCount: lines.length,
      concepts: Array.from(detectedConcepts),
      explanations: lineExplanations.slice(0, 10),
      issues: potentialIssues,
      suggestions
    })
  }

  return (
    <div className="panel">
      <h2>Code Explainer & AST Inspector</h2>
      <p className="hint">Inspect source code structures, detect features, line breakdowns, and potential bugs locally in your browser.</p>

      <div className="row">
        <div className="field">
          <span>Programming Language</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript / TypeScript</option>
            <option value="python">Python</option>
            <option value="cpp">C / C++</option>
            <option value="java">Java</option>
            <option value="php">PHP</option>
            <option value="sql">SQL</option>
          </select>
        </div>
      </div>

      <div className="field">
        <span>Source Code</span>
        <textarea rows={8} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste code snippet to analyze..." />
      </div>

      <div className="actions">
        <button className="btn" disabled={!code.trim()} onClick={analyzeCode}>Analyze Code Structure</button>
      </div>

      {analysis && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <h3>Code Structure Analysis ({analysis.language})</h3>
          <p>Total Lines: <strong>{analysis.lineCount}</strong></p>

          <h4>Detected Concepts & Syntax Features</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0 1rem' }}>
            {analysis.concepts.map((c, i) => (
              <span key={i} style={{ background: 'var(--brand)', color: 'var(--brandfg)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                {c}
              </span>
            ))}
          </div>

          {analysis.issues.length > 0 && (
            <div>
              <h4>Potential Code Quality Warnings</h4>
              <ul className="items">
                {analysis.issues.map((iss, i) => (
                  <li key={i} className="item" style={{ borderLeft: '4px solid var(--bad)' }}>
                    <span>⚠️ {iss}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h4>Line-by-Line Execution Breakdown</h4>
          <ul className="items">
            {analysis.explanations.map((exp, i) => (
              <li key={i} className="item">
                <span>Line {exp.line}: <code>{exp.code}</code></span>
                <span className="hint">{exp.explanation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
