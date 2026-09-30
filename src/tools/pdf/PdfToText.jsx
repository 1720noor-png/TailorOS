import { useState } from 'react'

export default function PdfToText() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setText('')
      setError('')
    }
  }

  const extractText = async () => {
    if (!file) {
      setError('Please select a PDF file first.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const buffer = await file.arrayBuffer()
      // Plain text extraction from PDF stream or web PDF parser
      const decoder = new TextDecoder('utf-8')
      const raw = decoder.decode(buffer)

      // Simple regex extraction for standard digital PDF text streams
      const textMatches = []
      const streamRegex = /BT[\s\S]*?ET/g
      let match
      while ((match = streamRegex.exec(raw)) !== null) {
        const streamBlock = match[0]
        const tjMatches = streamBlock.match(/\((.*?)\)\s*Tj|\[(.*?)\]\s*TJ/g)
        if (tjMatches) {
          tjMatches.forEach((t) => {
            const cleaned = t.replace(/^[\(\[]|[\)\]]\s*T[jJ]$/g, '').replace(/\\([()])/g, '$1')
            if (cleaned.trim()) textMatches.push(cleaned)
          })
        }
      }

      const extracted = textMatches.join(' ').replace(/\s+/g, ' ').trim()

      if (!extracted) {
        setText('Note: No digital text stream could be extracted. If this is a scanned document or image-only PDF, please use our Image → Text (OCR) tool to extract text from images.')
      } else {
        setText(extracted)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to extract text from PDF file.')
    } finally {
      setLoading(false)
    }
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
  }

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name || 'document'}.txt`
    a.click()
  }

  return (
    <div className="panel">
      <h2>PDF to Text Converter</h2>
      <p className="hint">Extract digital text contents from PDF documents directly in your browser. (Note: For scanned PDFs, use Image → Text OCR).</p>

      <div className="field">
        <span>Select PDF File</span>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      {error && <div className="msg error">{error}</div>}

      <div className="actions">
        <button className="btn" disabled={!file || loading} onClick={extractText}>
          {loading ? 'Extracting Text...' : 'Extract Text'}
        </button>
      </div>

      {text && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Extracted Text</h3>
            <div className="actions">
              <button className="btn ghost" onClick={copyText}>Copy</button>
              <button className="btn ghost" onClick={downloadText}>Download .txt</button>
            </div>
          </div>
          <textarea rows={10} readOnly value={text} style={{ marginTop: '0.5rem', width: '100%' }} />
        </div>
      )}
    </div>
  )
}
