import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function ImageResizeCalc() {
  const [origW, setOrigW] = useState('')
  const [origH, setOrigH] = useState('')
  const [newW, setNewW] = useState('')
  const [newH, setNewH] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const ow=parseInt(origW),oh=parseInt(origH),nw=parseInt(newW),nh=parseInt(newH)
    if(!ow||!oh){setErr('Enter original dimensions.');return}
    const ratio=ow/oh
    let fw=nw,fh=nh
    if(fw&&!fh)fh=Math.round(fw/ratio)
    else if(fh&&!fw)fw=Math.round(fh*ratio)
    else if(!fw&&!fh){setErr('Enter at least one new dimension.');return}
    setResult({width:fw,height:fh,ratio:ratio.toFixed(4),pct:((fw/ow)*100).toFixed(1)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Original Width"><input type="number" value={origW} onChange={e=>setOrigW(e.target.value)} placeholder="1920" /></Field>
        <Field label="Original Height"><input type="number" value={origH} onChange={e=>setOrigH(e.target.value)} placeholder="1080" /></Field>
        <Field label="New Width"><input type="number" value={newW} onChange={e=>setNewW(e.target.value)} placeholder="800" /></Field>
        <Field label="New Height (or blank)"><input type="number" value={newH} onChange={e=>setNewH(e.target.value)} placeholder="" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>New Size:</strong> {result.width} × {result.height}</p><p><strong>Ratio:</strong> {result.ratio} | <strong>Scale:</strong> {result.pct}%</p></div>}
      <p className="hint">Maintains aspect ratio when one dimension is blank.</p>
    </div>
  )
}
