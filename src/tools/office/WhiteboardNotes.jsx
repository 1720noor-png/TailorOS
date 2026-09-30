import { useState, useRef } from 'react'
export default function WhiteboardNotes() {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(3)
  const getCtx = () => canvasRef.current?.getContext('2d')
  const startDraw = e => {
    const ctx = getCtx(); if (!ctx) return
    const rect = canvasRef.current.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setDrawing(true)
  }
  const draw = e => {
    if (!drawing) return
    const ctx = getCtx(); if (!ctx) return
    const rect = canvasRef.current.getBoundingClientRect()
    ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.strokeStyle = color
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }
  const stopDraw = () => setDrawing(false)
  const clear = () => { const ctx = getCtx(); if(ctx) ctx.clearRect(0,0,600,400) }
  return (
    <div>
      <div className="row">
        <label>Color: <input type="color" value={color} onChange={e=>setColor(e.target.value)} /></label>
        <label>Size: <input type="range" min="1" max="20" value={size} onChange={e=>setSize(Number(e.target.value))} /> {size}px</label>
        <button className="btn ghost" onClick={clear}>Clear</button>
      </div>
      <canvas ref={canvasRef} width={600} height={400} style={{border:'1px solid #e2e8f0',borderRadius:8,cursor:'crosshair',width:'100%',maxWidth:600}} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} />
      <p className="hint">Click and drag to draw. Useful for quick sketches.</p>
    </div>
  )
}
