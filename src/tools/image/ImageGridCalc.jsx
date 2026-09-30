import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function ImageGridCalc() {
  const [total, setTotal] = useState('')
  const [columns, setColumns] = useState('')
  const [imgWidth, setImgWidth] = useState('')
  const [gap, setGap] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const calculate = () => {
    setErr(''); setResult(null)
    const t=parseInt(total),c=parseInt(columns)||4,w=parseInt(imgWidth)||300,g=parseInt(gap)||0
    if(!t){setErr('Enter total images.');return}
    const rows=Math.ceil(t/c),gridW=c*w+(c-1)*g,gridH=rows*w+(rows-1)*g
    setResult({rows,gridW,gridH,last:t%c||c})
  }
  return (
    <div>
      <div className="row">
        <Field label="Total Images"><input type="number" value={total} onChange={e=>setTotal(e.target.value)} placeholder="12" /></Field>
        <Field label="Columns"><input type="number" value={columns} onChange={e=>setColumns(e.target.value)} placeholder="4" /></Field>
        <Field label="Image Width (px)"><input type="number" value={imgWidth} onChange={e=>setImgWidth(e.target.value)} placeholder="300" /></Field>
        <Field label="Gap (px)"><input type="number" value={gap} onChange={e=>setGap(e.target.value)} placeholder="8" /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Calculate</button></div>
      <Msg>{err}</Msg>
      {result && <div className="out" role="status"><p><strong>Grid:</strong> {columns} columns × {result.rows} rows</p><p><strong>Total size:</strong> {result.gridW} × {result.gridH} px</p><p><strong>Last row:</strong> {result.last} images</p></div>}
      <p className="hint">Calculate grid layout dimensions.</p>
    </div>
  )
}
