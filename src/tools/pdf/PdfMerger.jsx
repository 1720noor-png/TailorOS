import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

export default function PdfMerger() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mergedUrl, setMergedUrl] = useState(null)

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files)
    if (selected.length > 0) {
      setFiles((prev) => [...prev, ...selected])
      setMergedUrl(null)
      setError('')
    }
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setMergedUrl(null)
  }

  const moveFile = (index, direction) => {
    const newFiles = [...files]
    const target = index + direction
    if (target < 0 || target >= files.length) return
    const temp = newFiles[index]
    newFiles[index] = newFiles[target]
    newFiles[target] = temp
    setFiles(newFiles)
    setMergedUrl(null)
  }

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const mergedPdf = await PDFDocument.create()
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(buffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setMergedUrl(url)
    } catch (err) {
      console.error(err)
      setError('Failed to merge PDFs. Please make sure all files are valid, non-password-protected PDFs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>PDF Merger</h2>
      <p className="hint">Combine multiple PDF documents into a single PDF file right inside your browser.</p>

      <div className="field">
        <span>Select PDF Files</span>
        <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
      </div>

      {files.length > 0 && (
        <div className="doc" style={{ marginTop: '1rem' }}>
          <h3>Selected Files ({files.length})</h3>
          <ul className="items">
            {files.map((file, idx) => (
              <li key={idx} className="item">
                <span>📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                <div className="actions" style={{ margin: 0 }}>
                  <button className="btn ghost" disabled={idx === 0} onClick={() => moveFile(idx, -1)}>↑</button>
                  <button className="btn ghost" disabled={idx === files.length - 1} onClick={() => moveFile(idx, 1)}>↓</button>
                  <button className="btn ghost" style={{ color: 'var(--bad)' }} onClick={() => removeFile(idx)}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <div className="msg error">{error}</div>}

      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" disabled={files.length < 2 || loading} onClick={mergePdfs}>
          {loading ? 'Merging PDFs...' : 'Merge PDFs'}
        </button>
      </div>

      {mergedUrl && (
        <div className="out" style={{ marginTop: '1rem' }}>
          <strong>✅ PDFs Merged Successfully!</strong>
          <div className="actions" style={{ marginTop: '0.8rem' }}>
            <a className="btn" href={mergedUrl} download="merged-document.pdf">Download Merged PDF</a>
          </div>
        </div>
      )}
    </div>
  )
}
