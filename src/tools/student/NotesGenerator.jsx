import { useState } from 'react'

export default function NotesGenerator() {
  const [topic, setTopic] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [notes, setNotes] = useState('')

  const generateNotes = () => {
    if (!topic.trim() && !sourceText.trim()) return

    let result = `# Study Notes: ${topic || 'Key Concepts'}\n\n`
    result += `**Date:** ${new Date().toLocaleDateString()}\n\n---\n\n`

    if (sourceText.trim()) {
      const sentences = sourceText.match(/[^.!?]+[.!?]+/g) || [sourceText]
      result += `## Executive Summary\n`
      result += `${sentences.slice(0, 3).join(' ')}\n\n`

      result += `## Key Takeaways & Bullet Points\n`
      sentences.forEach((s) => {
        if (s.trim().length > 15) {
          result += `• ${s.trim()}\n`
        }
      })
      result += '\n'
    } else {
      result += `## 1. Core Definition & Overview\n`
      result += `• Write key definition for ${topic}...\n`
      result += `• Main significance and applications...\n\n`

      result += `## 2. Key Formulas & Principles\n`
      result += `• Principle 1: ...\n`
      result += `• Principle 2: ...\n\n`

      result += `## 3. Important Terms & Glossary\n`
      result += `• Term A: Explanation...\n`
      result += `• Term B: Explanation...\n`
    }

    setNotes(result)
  }

  return (
    <div className="panel">
      <h2>Study Notes Generator</h2>
      <p className="hint">Transform lecture passages, topics, or textbook chapters into structured revision notes.</p>

      <div className="field">
        <span>Subject / Topic Title</span>
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Photosynthesis, Newton's Laws" />
      </div>

      <div className="field">
        <span>Textbook / Lecture Source Text (Optional)</span>
        <textarea rows={6} value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Paste lecture notes or chapter text..." />
      </div>

      <div className="actions">
        <button className="btn" disabled={!topic.trim() && !sourceText.trim()} onClick={generateNotes}>
          Generate Revision Notes
        </button>
      </div>

      {notes && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3>Structured Notes</h3>
            <button className="btn ghost" onClick={() => navigator.clipboard.writeText(notes)}>Copy Notes</button>
          </div>
          <div className="doc">{notes}</div>
        </div>
      )}
    </div>
  )
}
