import { useState } from 'react'

export default function TextSummarizer() {
  const [text, setText] = useState('')
  const [ratio, setRatio] = useState(0.3)
  const [summaryData, setSummaryData] = useState(null)

  const summarize = () => {
    if (!text.trim()) return

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length

    if (sentences.length <= 2) {
      setSummaryData({
        summary: text,
        keyPoints: [text],
        stats: { originalWords: wordCount, summaryWords: wordCount, readingTime: Math.ceil(wordCount / 200) }
      })
      return
    }

    const words = text.toLowerCase().match(/\b[a-z0-9]+\b/g) || []
    const stopWords = new Set(['the','is','at','which','on','a','an','and','or','in','of','to','for','with','that','this','by','from','as','it','be','are','was','were','have','has','had'])
    const freq = {}
    words.forEach((w) => {
      if (!stopWords.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1
    })

    const scored = sentences.map((s, idx) => {
      const sWords = s.toLowerCase().match(/\b[a-z0-9]+\b/g) || []
      let score = 0
      sWords.forEach((w) => { if (freq[w]) score += freq[w] })
      if (idx === 0) score *= 1.2
      return { sentence: s.trim(), score: score / (sWords.length || 1), idx }
    })

    const targetCount = Math.max(1, Math.ceil(sentences.length * ratio))
    const selected = scored.sort((a, b) => b.score - a.score).slice(0, targetCount).sort((a, b) => a.idx - b.idx)

    const summaryText = selected.map((s) => s.sentence).join(' ')
    const summaryWords = summaryText.split(/\s+/).filter(Boolean).length

    setSummaryData({
      summary: summaryText,
      keyPoints: selected.slice(0, 5).map((s) => s.sentence),
      stats: { originalWords: wordCount, summaryWords, readingTime: Math.ceil(wordCount / 200) }
    })
  }

  return (
    <div className="panel">
      <h2>Text Summarizer</h2>
      <p className="hint">Summarize articles, paragraphs, or notes into key bullet points and brief summaries.</p>

      <div className="field">
        <span>Paste Text to Summarize</span>
        <textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here..." />
      </div>

      <div className="field">
        <span>Target Summary Length</span>
        <select value={ratio} onChange={(e) => setRatio(parseFloat(e.target.value))}>
          <option value={0.15}>Short (15%)</option>
          <option value={0.3}>Standard (30%)</option>
          <option value={0.5}>Detailed (50%)</option>
        </select>
      </div>

      <div className="actions">
        <button className="btn" disabled={!text.trim()} onClick={summarize}>Summarize Text</button>
      </div>

      {summaryData && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <div className="row" style={{ marginBottom: '1rem' }}>
            <div>Original Words: <strong>{summaryData.stats.originalWords}</strong></div>
            <div>Summary Words: <strong>{summaryData.stats.summaryWords}</strong></div>
            <div>Estimated Reading Time: <strong>~{summaryData.stats.readingTime} min</strong></div>
          </div>

          <h3>Key Bullet Points</h3>
          <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.2rem' }}>
            {summaryData.keyPoints.map((pt, i) => (
              <li key={i} style={{ marginBottom: '0.4rem' }}>{pt}</li>
            ))}
          </ul>

          <h3>Summary Text</h3>
          <div className="doc">{summaryData.summary}</div>
        </div>
      )}
    </div>
  )
}
