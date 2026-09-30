import { useState, useRef } from 'react'

export default function BackgroundRemover() {
  const [imageSrc, setImageSrc] = useState(null)
  const [keyColor, setKeyColor] = useState('#ffffff')
  const [tolerance, setTolerance] = useState(35)
  const [replaceColor, setReplaceColor] = useState('transparent')
  const [processedUrl, setProcessedUrl] = useState(null)
  const canvasRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        setImageSrc(evt.target.result)
        setProcessedUrl(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBackground = () => {
    if (!imageSrc) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      // Draw original
      ctx.drawImage(img, 0, 0)

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data

      // Parse target key color hex
      const rKey = parseInt(keyColor.slice(1, 3), 16)
      const gKey = parseInt(keyColor.slice(3, 5), 16)
      const bKey = parseInt(keyColor.slice(5, 7), 16)

      let rRep = 0, gRep = 0, bRep = 0, aRep = 0
      if (replaceColor !== 'transparent') {
        rRep = parseInt(replaceColor.slice(1, 3), 16)
        gRep = parseInt(replaceColor.slice(3, 5), 16)
        bRep = parseInt(replaceColor.slice(5, 7), 16)
        aRep = 255
      }

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Color distance formula
        const dist = Math.sqrt((r - rKey) ** 2 + (g - gKey) ** 2 + (b - bKey) ** 2)

        if (dist <= tolerance) {
          data[i] = rRep
          data[i + 1] = gRep
          data[i + 2] = bRep
          data[i + 3] = aRep
        }
      }

      ctx.putImageData(imgData, 0, 0)
      setProcessedUrl(canvas.toDataURL('image/png'))
    }
    img.src = imageSrc
  }

  return (
    <div className="panel">
      <h2>Background Remover</h2>
      <p className="hint">Remove or replace background colors in images locally using browser canvas rendering.</p>

      <div className="field">
        <span>Upload Image</span>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {imageSrc && (
        <>
          <div className="row" style={{ marginTop: '1rem' }}>
            <div className="field">
              <span>Background Color to Remove</span>
              <input type="color" value={keyColor} onChange={(e) => setKeyColor(e.target.value)} />
            </div>

            <div className="field">
              <span>Color Threshold / Tolerance ({tolerance})</span>
              <input type="range" min={5} max={100} value={tolerance} onChange={(e) => setTolerance(parseInt(e.target.value))} />
            </div>

            <div className="field">
              <span>Replacement Background</span>
              <select value={replaceColor} onChange={(e) => setReplaceColor(e.target.value)}>
                <option value="transparent">Transparent (PNG)</option>
                <option value="#ffffff">White</option>
                <option value="#000000">Black</option>
                <option value="#0b5fff">Brand Blue</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button className="btn" onClick={removeBackground}>Remove / Replace Background</button>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className="row" style={{ marginTop: '1.5rem' }}>
            <div>
              <h3>Original Image</h3>
              <img src={imageSrc} alt="Original" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--line)' }} />
            </div>

            {processedUrl && (
              <div>
                <h3>Processed Result</h3>
                <img src={processedUrl} alt="Result" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--line)', background: 'checkerboard' }} />
                <div className="actions" style={{ marginTop: '0.8rem' }}>
                  <a className="btn" href={processedUrl} download="background-removed.png">Download Result (PNG)</a>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
