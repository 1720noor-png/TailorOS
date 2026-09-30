import { useState, useRef, useEffect } from 'react'
import { Field } from '../../components/ui.jsx'
export default function MetronomeTool() {
  const [bpm, setBpm] = useState(120)
  const [playing, setPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const ref = useRef(null)
  const ctxRef = useRef(null)
  useEffect(() => () => { clearInterval(ref.current); if(ctxRef.current)ctxRef.current.close() }, [])
  const start = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    setPlaying(true); setBeat(0)
    const tick = () => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.value = 0.3
      osc.start(); osc.stop(ctx.currentTime + 0.05)
    }
    tick()
    ref.current = setInterval(() => { tick(); setBeat(b => b + 1) }, 60000 / bpm)
  }
  const stop = () => { clearInterval(ref.current); setPlaying(false); if(ctxRef.current){ctxRef.current.close();ctxRef.current=null} }
  return (
    <div>
      <Field label={'BPM: ' + bpm}><input type="range" min="40" max="240" value={bpm} onChange={e => { setBpm(Number(e.target.value)); if(playing){stop();start()} }} /></Field>
      <div className="out" role="status" style={{textAlign:'center'}}>
        <p style={{fontSize:'3rem',fontWeight:'bold'}}>{bpm} BPM</p>
        <p>Beat: {beat}</p>
      </div>
      <div className="actions" style={{justifyContent:'center'}}>
        {!playing ? <button className="btn" onClick={start}>▶ Start</button> : <button className="btn" onClick={stop}>⏹ Stop</button>}
      </div>
      <p className="hint">Web Audio metronome with adjustable tempo.</p>
    </div>
  )
}
