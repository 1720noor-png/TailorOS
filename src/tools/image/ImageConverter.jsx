import { useState } from 'react'

export default function ImageConverter() {
  const [imageSrc, setImageSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [targetFormat, setTargetFormat] = useState('image/jpeg')
  const [quality, setQuality] = useState(0.9)
  const [convertedUrl, setConvertedUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name.replace(/\.[^/.]+$/, ''))
      const reader = new FileReader()
      reader.onload = (evt) => {
        setImageSrc(evt.target.result)
        setConvertedUrl(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertImage = () => {
    if (!imageSrc) return
    setLoading(true)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      // Fill white background for JPEG conversions if transparent
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL(targetFormat, quality)
      setConvertedUrl(dataUrl)
      setLoading(false)
    }
    img.src = imageSrc
  }

  const extMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  }

  return (
    <div className="panel">
      <h2>Image Format Converter</h2>
      <p className="hint">Convert images between PNG, JPG, and WebP formats instantly without quality loss.</p>

      <div className="field">
        <span>Upload Image</span>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {imageSrc && (
        <>
          <div className="row" style={{ marginTop: '1rem' }}>
            <div className="field">
              <span>Target Format</span>
              <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/png">PNG (.png)</option>
                <option value="image/webp">WebP (.webp)</option>
              </select>
            </div>

            {targetFormat !== 'image/png' && (
              <div className="field">
                <span>Quality ({Math.round(quality * 100)}%)</span>
                <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} />
              </div>
            )}
          </div>

          <div className="actions">
            <button className="btn" disabled={loading} onClick={convertImage}>
              {loading ? 'Converting...' : 'Convert Format'}
            </button>
          </div>

          {convertedUrl && (
            <div className="out" style={{ marginTop: '1.2rem' }}>
              <h3>Converted Image</h3>
              <img src={convertedUrl} alt="Converted" style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px', border: '1px solid var(--line)' }} />
              <div className="actions" style={{ marginTop: '0.8rem' }}>
                <a className="btn" href={convertedUrl} download={`${fileName || 'converted'}.${extMap[targetFormat]}`}>
                  Download {extMap[targetFormat].toUpperCase()} Image
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
