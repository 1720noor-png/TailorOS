import { useState } from 'react'

export default function AskPdf() {
  const [file, setFile] = useState(null)
  const [pdfText, setPdfText] = useState('')
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setAnswers([])
      setError('')
      setLoading(true)
      try {
        const buffer = await selected.arrayBuffer()
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
        const extracted = textMatches.join(' ').replace(/\s+/g, ' ').trim()
        setPdfText(extracted)
      } catch (err) {
        console.error(err)
        setError('Could not process PDF file.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAsk = (e) => {
    e.preventDefault()
    if (!question.trim()) return
    if (!pdfText) {
      setError('Please upload a PDF with extractable text first.')
      return
    }

    const q = question.toLowerCase().trim()
    const sentences = pdfText.match(/[^.!?]+[.!?]+/g) || [pdfText]
    const keywords = q.split(/\s+/).filter((w) => w.length > 2)

    const matches = sentences.filter((sentence) => {
      const lower = sentence.toLowerCase()
      return keywords.some((kw) => lower.includes(kw))
    })

    const ans = {
      q: question,
      results: matches.slice(0, 5),
      count: matches.length
    }

    setAnswers((prev) => [ans, ...prev])
    setQuestion('')
  }

  return (
    <div className="panel">
      <h2>Ask PDF</h2>
      <p className="hint">Upload a PDF document and search or query relevant passages and answers directly inside your browser.</p>

      <div className="field">
        <span>Select PDF Document</span>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      {loading && <p className="hint">Reading PDF content...</p>}
      {pdfText && <div className="msg ok">Document loaded! ({pdfText.split(/\s+/).length} words ready for query)</div>}
      {error && <div className="msg error">{error}</div>}

      {pdfText && (
        <form onSubmit={handleAsk} style={{ marginTop: '1.2rem' }}>
          <div className="field">
            <span>Ask a question or enter search terms</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What is the total budget or main summary?"
              />
              <button type="submit" className="btn" disabled={!question.trim()}>Ask</button>
            </div>
          </div>
        </form>
      )}

      {answers.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Questions & Answers</h3>
          {answers.map((item, idx) => (
            <div key={idx} className="doc" style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--brand)' }}>Q: {item.q}</strong>
              {item.results.length > 0 ? (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                  {item.results.map((res, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>{res.trim()}</li>
                  ))}
                </ul>
              ) : (
                <p className="hint" style={{ marginTop: '0.4rem' }}>No exact keyword match found in the document for this question.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
