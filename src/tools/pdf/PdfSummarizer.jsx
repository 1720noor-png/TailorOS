import { useState } from 'react'

export default function PdfSummarizer() {
  const [file, setFile] = useState(null)
  const [ratio, setRatio] = useState(0.3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summaryData, setSummaryData] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setSummaryData(null)
      setError('')
    }
  }

  const summarizePdf = async () => {
    if (!file) {
      setError('Please select a PDF file first.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const buffer = await file.arrayBuffer()
      const decoder = new TextDecoder('utf-8')
      const raw = decoder.decode(buffer)

      const textMatches = []
      const streamRegex = /BT[\s\S]*?ET/g
      let match
      while ((match = streamRegex.exec(raw)) !== null) {
        const tjMatches = match[0].match(/\((.*?)\)\s*Tj|\[(.*?)\]\s*TJ/g)
        if (tjMatches) {
          tjMatches.forEach((t) => {
            const cleaned = t.replace(/^[\(\[]|[\)\]]\s*T[jJ]$/g, '').replace(/\\([()])/g, '$1')
            if (cleaned.trim()) textMatches.push(cleaned)
          })
        }
      }
      const text = textMatches.join(' ').replace(/\s+/g, ' ').trim()

      if (!text) {
        setError('No text could be extracted from this PDF. Scanned PDFs require Image OCR.')
        return
      }

      // Frequency based summarizer algorithm
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
      const wordCount = text.split(/\s+/).filter(Boolean).length

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
    } catch (err) {
      console.error(err)
      setError('Error processing PDF for summarization.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>PDF Summarizer</h2>
      <p className="hint">Extract and summarize long PDF documents automatically into key executive points and summary text.</p>

      <div className="field">
        <span>Select PDF File</span>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      <div className="field">
        <span>Summary Length</span>
        <select value={ratio} onChange={(e) => setRatio(parseFloat(e.target.value))}>
          <option value={0.15}>Short (15% length)</option>
          <option value={0.3}>Standard (30% length)</option>
          <option value={0.5}>Detailed (50% length)</option>
        </select>
      </div>

      {error && <div className="msg error">{error}</div>}

      <div className="actions">
        <button className="btn" disabled={!file || loading} onClick={summarizePdf}>
          {loading ? 'Summarizing PDF...' : 'Summarize PDF'}
        </button>
      </div>

      {summaryData && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <div className="row" style={{ marginBottom: '1rem' }}>
            <div>Original Words: <strong>{summaryData.stats.originalWords}</strong></div>
            <div>Summary Words: <strong>{summaryData.stats.summaryWords}</strong></div>
            <div>Reading Time: <strong>~{summaryData.stats.readingTime} min</strong></div>
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
