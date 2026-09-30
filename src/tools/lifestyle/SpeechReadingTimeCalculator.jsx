import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function SpeechReadingTimeCalculator() {
  const [text, setText] = useState(
    'Welcome to ToolHub! In this speech or article presentation, we are demonstrating how quickly and accurately reading time and speaking duration can be calculated. Standard silent reading speed averages around 230 words per minute, whereas conversational presentation speech ranges between 130 and 160 words per minute. Knowing your exact word count helps you deliver well-timed keynotes, YouTube scripts, podcast intros, and university presentations without overrunning your scheduled time slot.'
  )
  const [speechWpm, setSpeechWpm] = useState(150) // average speech speed

  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  const chars = text.length
  const sentences = text.split(/[.!?]+/).filter(Boolean).length
  const paragraphs = text.split(/\n+/).filter(Boolean).length

  // Speeds:
  // Silent Reading: ~230 wpm
  // Slow Speech: ~130 wpm
  // Custom Speech: speechWpm
  // Fast Speech: ~180 wpm
  const formatMinutesSecs = (w, wpm) => {
    if (!w || !wpm) return '0 min 0 sec'
    const totalSecs = Math.round((w / wpm) * 60)
    const m = Math.floor(totalSecs / 60)
    const s = totalSecs % 60
    return `${m} min ${s} sec`
  }

  const reportText = `Text Metrics & Presentation Duration
------------------------------------------------------
Word Count: ${words} words
Character Count: ${chars} characters
Sentences: ${sentences}
Paragraphs: ${paragraphs}

Estimated Times:
• Silent Reading (~230 WPM): ${formatMinutesSecs(words, 230)}
• Slow Presentation (~130 WPM): ${formatMinutesSecs(words, 130)}
• Target Speech Speed (${speechWpm} WPM): ${formatMinutesSecs(words, speechWpm)}
• Fast Keynote (~180 WPM): ${formatMinutesSecs(words, 180)}`

  return (
    <div className="tool-body">
      <Field label="Paste or Type Speech / Script Text">
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
        />
      </Field>

      <div className="row" style={{ marginTop: '0.8rem' }}>
        <Field label={`Target Speech Pace (${speechWpm} WPM)`}>
          <input
            type="range"
            min="100"
            max="250"
            step="5"
            value={speechWpm}
            onChange={(e) => setSpeechWpm(Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="out">
        <div>Target Speech Time: <strong>{formatMinutesSecs(words, speechWpm)}</strong> (at {speechWpm} WPM)</div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Silent Reading Time: <strong>{formatMinutesSecs(words, 230)}</strong> | Words: {words} | Characters: {chars}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Pace Mode</th>
              <th>Words Per Min (WPM)</th>
              <th>Estimated Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Silent Eye Reading</td>
              <td>230 WPM</td>
              <td>{formatMinutesSecs(words, 230)}</td>
            </tr>
            <tr>
              <td>Slow & Deliberate Speech</td>
              <td>130 WPM</td>
              <td>{formatMinutesSecs(words, 130)}</td>
            </tr>
            <tr className="best">
              <td><strong>Target Presentation Pace</strong></td>
              <td><strong>{speechWpm} WPM</strong></td>
              <td><strong>{formatMinutesSecs(words, speechWpm)}</strong></td>
            </tr>
            <tr>
              <td>Fast Keynote / Rapid Speech</td>
              <td>180 WPM</td>
              <td>{formatMinutesSecs(words, 180)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy Speech Metrics" />
        <button type="button" className="btn ghost" onClick={() => download('speech-timing.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
