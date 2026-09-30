import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function MessageLengthAnalyzer() {
  const [text, setText] = useState(
    'Excited to announce our new product update! We have streamlined the interface, improved load performance by 40%, and added 40 new tools to make your day more productive. Check it out and let us know your feedback!'
  )

  const chars = text.length
  const charsNoSpaces = text.replace(/\s+/g, '').length
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const sentences = text.split(/[.!?]+/).filter(Boolean).length
  const lines = text.split(/\n/).length

  // Reading time (200 wpm) and speaking time (140 wpm)
  const readSecs = Math.ceil((words / 200) * 60)
  const speakSecs = Math.ceil((words / 140) * 60)

  const fmtTime = (secs) => {
    if (secs < 60) return `${secs} sec`
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  // Social Limits
  const limits = [
    { name: 'X / Twitter Post', max: 280, count: chars },
    { name: 'SMS Message (1 Segment)', max: 160, count: chars },
    { name: 'LinkedIn Post Tagline', max: 210, count: chars },
    { name: 'Meta / Instagram Caption', max: 2200, count: chars },
    { name: 'YouTube Video Title', max: 100, count: chars },
  ]

  const reportText = `Message Length Analysis
------------------------------------
Characters (with spaces): ${chars}
Characters (no spaces): ${charsNoSpaces}
Words: ${words}
Sentences: ${sentences}
Lines: ${lines}

Estimated Reading Time: ${fmtTime(readSecs)}
Estimated Speaking Time: ${fmtTime(speakSecs)}

Platform Limits Check:
${limits.map((l) => `• ${l.name}: ${l.count}/${l.max} chars (${l.count <= l.max ? 'OK' : 'EXCEEDED by ' + (l.count - l.max)})`).join('\n')}`

  return (
    <div className="tool-body">
      <Field label="Enter Message or Post Text">
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type message text here..."
        />
      </Field>

      <div className="out">
        <div>Total Length: <strong>{chars} characters</strong> | <strong>{words} words</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Reading Time: <strong>{fmtTime(readSecs)}</strong> | Speaking Time: <strong>{fmtTime(speakSecs)}</strong> | Sentences: {sentences} | Lines: {lines}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Platform / Format</th>
              <th>Char Count / Max Limit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {limits.map((l) => {
              const isOver = l.count > l.max
              return (
                <tr key={l.name} className={isOver ? 'item late' : ''}>
                  <td><strong>{l.name}</strong></td>
                  <td>{l.count} / {l.max} chars</td>
                  <td>
                    {isOver ? (
                      <span className="bad">Exceeded by {l.count - l.max}</span>
                    ) : (
                      <span className="good">✓ Fits limit ({l.max - l.count} left)</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy Analysis Report" />
        <button type="button" className="btn ghost" onClick={() => download('message-analysis.txt', reportText)}>
          Download Report (.txt)
        </button>
      </div>
    </div>
  )
}
