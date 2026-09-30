import { useState } from 'react'
import { createWorker } from 'tesseract.js'

export default function ImageToText() {
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState('')
  const [error, setError] = useState('')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        setImageSrc(evt.target.result)
        setExtractedText('')
        setError('')
        setProgress(0)
        setStatus('')
      }
      reader.readAsDataURL(file)
    }
  }

  const runOcr = async () => {
    if (!imageSrc) return
    setLoading(true)
    setError('')
    setExtractedText('')
    setStatus('Initializing OCR engine...')
    setProgress(10)

    try {
      // Pass logger in options per Tesseract.js v5 requirements
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setStatus('Recognizing text in image...')
            setProgress(Math.round(m.progress * 100))
          } else {
            setStatus(m.status)
          }
        }
      })

      const ret = await worker.recognize(imageSrc)
      setExtractedText(ret.data.text)
      await worker.terminate()
    } catch (err) {
      console.error(err)
      setError('OCR processing failed. Please check the image and try again.')
    } finally {
      setLoading(false)
      setStatus('')
    }
  }

  return (
    <div className="panel">
      <h2>Image to Text (OCR)</h2>
      <p className="hint">Extract printed text from images, photos, and scanned documents using optical character recognition (OCR).</p>

      <div className="field">
        <span>Upload Image with Text</span>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {imageSrc && (
        <>
          <div style={{ margin: '1rem 0' }}>
            <img src={imageSrc} alt="Input" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid var(--line)' }} />
          </div>

          {loading && (
            <div style={{ margin: '1rem 0' }}>
              <div className="meter">
                <span style={{ width: `${progress}%` }} />
              </div>
              <p className="hint">{status} ({progress}%)</p>
            </div>
          )}

          {error && <div className="msg error">{error}</div>}

          <div className="actions">
            <button className="btn" disabled={loading} onClick={runOcr}>
              {loading ? 'Processing OCR...' : 'Extract Text (OCR)'}
            </button>
          </div>

          {extractedText && (
            <div className="out" style={{ marginTop: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Extracted Text</h3>
                <button className="btn ghost" onClick={() => navigator.clipboard.writeText(extractedText)}>Copy Text</button>
              </div>
              <textarea rows={8} readOnly value={extractedText} style={{ marginTop: '0.5rem', width: '100%' }} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
