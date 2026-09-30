import { useState, useRef } from 'react'
export default function NoiseColorGen() {
  const [playing, setPlaying] = useState(false)
  const [type, setType] = useState('white')
  const ctxRef = useRef(null)
  const nodeRef = useRef(null)
  const start = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const bufferSize = 4096
    const node = ctx.createScriptProcessor(bufferSize, 1, 1)
    node.onaudioprocess = e => {
      const out = e.outputBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        let sample = Math.random() * 2 - 1
        if (type === 'pink') sample *= 0.5
        if (type === 'brown') sample *= 0.3
        out[i] = sample
      }
    }
    node.connect(ctx.destination)
    ctxRef.current = ctx; nodeRef.current = node; setPlaying(true)
  }
  const stop = () => {
    if (nodeRef.current) nodeRef.current.disconnect()
    if (ctxRef.current) ctxRef.current.close()
    setPlaying(false)
  }
  return (
    <div>
      <div className="row">
        {['white','pink','brown'].map(t => (
          <label key={t} style={{padding:'4px 8px'}}><input type="radio" name="noise" checked={type===t} onChange={()=>setType(t)} /> {t.charAt(0).toUpperCase()+t.slice(1)} Noise</label>
        ))}
      </div>
      <div className="actions">
        {!playing ? <button className="btn" onClick={start}>▶ Play</button> : <button className="btn" onClick={stop}>⏹ Stop</button>}
      </div>
      <p className="hint">Generates noise for focus or sleep. Uses Web Audio API.</p>
    </div>
  )
}
