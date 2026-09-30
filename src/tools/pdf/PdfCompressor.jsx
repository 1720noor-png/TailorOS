import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

export default function PdfCompressor() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
      setError('')
    }
  }

  const compressPdf = async () => {
    if (!file) {
      setError('Please select a PDF file first.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const origSize = file.size
      const buffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
      
      // Save with object stream compression
      const pdfBytes = await pdf.save({ useObjectStreams: true })
      const newSize = pdfBytes.length
      const savings = Math.max(0, origSize - newSize)
      const percent = origSize > 0 ? ((savings / origSize) * 100).toFixed(1) : 0

      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setResult({
        origSize,
        newSize,
        savings,
        percent,
        url,
        isSmaller: newSize < origSize
      })
    } catch (err) {
      console.error(err)
      setError('Could not process this PDF file. Please ensure it is not password protected.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>PDF Compressor</h2>
      <p className="hint">Optimize PDF structure and remove redundant data streams locally in your browser.</p>

      <div className="field">
        <span>Select PDF File</span>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      {error && <div className="msg error">{error}</div>}

      <div className="actions">
        <button className="btn" disabled={!file || loading} onClick={compressPdf}>
          {loading ? 'Optimizing PDF...' : 'Compress & Optimize'}
        </button>
      </div>

      {result && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <h3>Compression Results</h3>
          <p>Original Size: <strong>{(result.origSize / 1024).toFixed(1)} KB</strong></p>
          <p>Optimized Size: <strong>{(result.newSize / 1024).toFixed(1)} KB</strong></p>
          {result.isSmaller ? (
            <div className="msg ok">
              Saved {(result.savings / 1024).toFixed(1)} KB ({result.percent}% reduction)!
            </div>
          ) : (
            <div className="msg" style={{ border: '1px solid var(--line)' }}>
              This PDF is already highly compressed or contains high-resolution embedded images.
            </div>
          )}

          <div className="actions" style={{ marginTop: '1rem' }}>
            <a className="btn" href={result.url} download={`compressed-${file.name}`}>
              Download Compressed PDF
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
