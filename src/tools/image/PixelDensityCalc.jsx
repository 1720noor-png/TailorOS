import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function PixelDensityCalc() {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [diagonal, setDiagonal] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const w=parseInt(width),h=parseInt(height),d=parseFloat(diagonal)
    if(!w||!h||!d){setErr('Fill all fields.');return}
    const ppi=Math.round(Math.sqrt(w*w+h*h)/d)
    setResult({ppi,megapixels:(w*h/1000000).toFixed(2),ratio:(w/h).toFixed(2)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Width (px)"><input type="number" value={width} onChange={e=>setWidth(e.target.value)} placeholder="2560" /></Field>
        <Field label="Height (px)"><input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="1440" /></Field>
        <Field label="Screen Diagonal (inches)"><input type="number" value={diagonal} onChange={e=>setDiagonal(e.target.value)} placeholder="27" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>PPI:</strong> {result.ppi}</p><p><strong>Megapixels:</strong> {result.megapixels}</p><p><strong>Aspect:</strong> {result.ratio}:1</p></div>}
      <p className="hint">Pixels per inch for displays.</p>
    </div>
  )
}
