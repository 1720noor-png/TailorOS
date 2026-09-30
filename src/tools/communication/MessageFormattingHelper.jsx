import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function MessageFormattingHelper() {
  const [inputText, setInputText] = useState(
    'Key Project Updates:\nCompleted sprint goals on time\nOptimized overall API responses\nAdded comprehensive user documentation\nNext Steps:\nSchedule client review session\nPrepare production release notes'
  )
  const [styleMode, setStyleMode] = useState('bullets') // 'bullets', 'numbered', 'paragraphs', 'uppercase', 'clean'

  const lines = inputText
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)

  let formattedResult = ''

  if (styleMode === 'bullets') {
    formattedResult = lines.map((l) => (l.endsWith(':') ? `\n${l}` : `• ${l}`)).join('\n').trim()
  } else if (styleMode === 'numbered') {
    let count = 1
    formattedResult = lines
      .map((l) => {
        if (l.endsWith(':')) {
          count = 1
          return `\n${l}`
        }
        const num = `${count}. ${l}`
        count++
        return num
      })
      .join('\n')
      .trim()
  } else if (styleMode === 'paragraphs') {
    formattedResult = lines.join('\n\n')
  } else if (styleMode === 'uppercase') {
    formattedResult = inputText.toUpperCase()
  } else if (styleMode === 'clean') {
    formattedResult = inputText.replace(/[^\S\r\n]+/g, ' ').replace(/\n\s*\n/g, '\n').trim()
  }

  return (
    <div className="tool-body">
      <Field label="Input Plain Text">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter unformatted text here..."
        />
      </Field>

      <div className="actions" style={{ margin: '0.8rem 0' }}>
        <button
          type="button"
          className={`btn ${styleMode === 'bullets' ? '' : 'ghost'}`}
          onClick={() => setStyleMode('bullets')}
        >
          • Bulleted List
        </button>
        <button
          type="button"
          className={`btn ${styleMode === 'numbered' ? '' : 'ghost'}`}
          onClick={() => setStyleMode('numbered')}
        >
          1. Numbered List
        </button>
        <button
          type="button"
          className={`btn ${styleMode === 'paragraphs' ? '' : 'ghost'}`}
          onClick={() => setStyleMode('paragraphs')}
        >
          Paragraph Spacing
        </button>
        <button
          type="button"
          className={`btn ${styleMode === 'clean' ? '' : 'ghost'}`}
          onClick={() => setStyleMode('clean')}
        >
          Clean Extra Spaces
        </button>
      </div>

      <div className="out">
        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Formatted Output Preview:</div>
        <pre className="hl">{formattedResult}</pre>
      </div>

      <div className="actions">
        <CopyBtn text={formattedResult} label="Copy Formatted Text" />
        <button type="button" className="btn ghost" onClick={() => download('formatted-message.txt', formattedResult)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
