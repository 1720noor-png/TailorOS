import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function CropRatioTool() {
  const [origW, setOrigW] = useState('')
  const [origH, setOrigH] = useState('')
  const [ratioW, setRatioW] = useState('')
  const [ratioH, setRatioH] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const ow=parseInt(origW),oh=parseInt(origH),rw=parseInt(ratioW),rh=parseInt(ratioH)
    if(!ow||!oh||!rw||!rh){setErr('Fill all fields.');return}
    const target=rw/rh,current=ow/oh
    let cw,ch
    if(current>target){ch=oh;cw=Math.round(oh*target)} else {cw=ow;ch=Math.round(ow/target)}
    setResult({width:cw,height:ch,removed:((1-cw*ch/(ow*oh))*100).toFixed(1)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Image Width"><input type="number" value={origW} onChange={e=>setOrigW(e.target.value)} placeholder="4000" /></Field>
        <Field label="Image Height"><input type="number" value={origH} onChange={e=>setOrigH(e.target.value)} placeholder="3000" /></Field>
        <Field label="Target Ratio W"><input type="number" value={ratioW} onChange={e=>setRatioW(e.target.value)} placeholder="16" /></Field>
        <Field label="Target Ratio H"><input type="number" value={ratioH} onChange={e=>setRatioH(e.target.value)} placeholder="9" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Crop to:</strong> {result.width} × {result.height}</p><p><strong>Area removed:</strong> {result.removed}%</p></div>}
      <p className="hint">Calculate crop dimensions for target ratio.</p>
    </div>
  )
}
