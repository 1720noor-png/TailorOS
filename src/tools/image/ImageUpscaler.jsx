import { useState } from 'react'

export default function ImageUpscaler() {
  const [imageSrc, setImageSrc] = useState(null)
  const [scale, setScale] = useState(2)
  const [origDimensions, setOrigDimensions] = useState({ w: 0, h: 0 })
  const [upscaledUrl, setUpscaledUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const img = new Image()
        img.onload = () => {
          setOrigDimensions({ w: img.width, h: img.height })
          setImageSrc(evt.target.result)
          setUpscaledUrl(null)
          setError('')
        }
        img.src = evt.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const upscaleImage = () => {
    if (!imageSrc) return
    setLoading(true)
    setError('')

    const targetW = origDimensions.w * scale
    const targetH = origDimensions.h * scale

    // Max canvas size safety guard (e.g., 4096 x 4096)
    if (targetW > 4096 || targetH > 4096) {
      setError(`Upscaled dimensions (${targetW} × ${targetH} px) exceed browser safe canvas limits (max 4096 px). Please select a smaller scale multiplier.`)
      setLoading(false)
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, targetW, targetH)

      setUpscaledUrl(canvas.toDataURL('image/png'))
      setLoading(false)
    }
    img.src = imageSrc
  }

  return (
    <div className="panel">
      <h2>Image Upscaler</h2>
      <p className="hint">Increase image resolution with high-quality browser scaling algorithms.</p>

      <div className="field">
        <span>Upload Image</span>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {imageSrc && (
        <>
          <p className="hint">Original Dimensions: <strong>{origDimensions.w} × {origDimensions.h} px</strong></p>

          <div className="field">
            <span>Upscale Factor</span>
            <select value={scale} onChange={(e) => setScale(parseInt(e.target.value))}>
              <option value={2}>2x Upscale ({origDimensions.w * 2} × {origDimensions.h * 2} px)</option>
              <option value={3}>3x Upscale ({origDimensions.w * 3} × {origDimensions.h * 3} px)</option>
              <option value={4}>4x Upscale ({origDimensions.w * 4} × {origDimensions.h * 4} px)</option>
            </select>
          </div>

          {error && <div className="msg error">{error}</div>}

          <div className="actions">
            <button className="btn" disabled={loading} onClick={upscaleImage}>
              {loading ? 'Upscaling...' : 'Upscale Image'}
            </button>
          </div>

          {upscaledUrl && (
            <div className="out" style={{ marginTop: '1.2rem' }}>
              <h3>Upscaled Result ({origDimensions.w * scale} × {origDimensions.h * scale} px)</h3>
              <img src={upscaledUrl} alt="Upscaled Result" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid var(--line)' }} />
              <div className="actions" style={{ marginTop: '0.8rem' }}>
                <a className="btn" href={upscaledUrl} download="upscaled-image.png">Download PNG</a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
