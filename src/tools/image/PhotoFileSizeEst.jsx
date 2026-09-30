import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function PhotoFileSizeEst() {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [depth, setDepth] = useState('')
  const [compression, setCompression] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const w=parseInt(width),h=parseInt(height),bd=parseInt(depth)||24,comp=parseInt(compression)||90
    if(!w||!h){setErr('Enter dimensions.');return}
    const raw=w*h*bd/8
    const compressed=raw*(1-comp/100)
    const fmt=b=>b>1048576?(b/1048576).toFixed(1)+' MB':b>1024?(b/1024).toFixed(0)+' KB':b+' B'
    setResult({raw:fmt(raw),compressed:fmt(compressed),pixels:(w*h/1000000).toFixed(1)+'MP'})
  }
  return (
    <div>
      <div className="row">
        <Field label="Width (px)"><input type="number" value={width} onChange={e=>setWidth(e.target.value)} placeholder="4000" /></Field>
        <Field label="Height (px)"><input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="3000" /></Field>
        <Field label="Bit Depth"><input type="number" value={depth} onChange={e=>setDepth(e.target.value)} placeholder="24" /></Field>
        <Field label="Compression %"><input type="number" value={compression} onChange={e=>setCompression(e.target.value)} placeholder="90" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Uncompressed:</strong> {result.raw}</p><p><strong>Estimated compressed:</strong> {result.compressed}</p><p><strong>Resolution:</strong> {result.pixels}</p></div>}
      <p className="hint">Estimate based on dimensions and compression.</p>
    </div>
  )
}
