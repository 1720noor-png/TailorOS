import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function SeamAllowanceCalculator() {
  const [finW, setFinW] = useState('')
  const [finH, setFinH] = useState('')
  const [seam, setSeam] = useState('0.5')
  const [sides, setSides] = useState('4')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const w = Number(finW), h = Number(finH), s = Number(seam), n = Number(sides)
    if (!(w > 0 && h > 0 && s >= 0 && n >= 0 && n <= 4)) { setOut(null); return setErr('Enter finished width and height greater than 0, seam allowance ≥ 0, and 0-4 seamed sides.') }
    const cutW = w + 2 * s
    const cutH = h + 2 * s
    setErr('')
    setOut({ cutW: cutW.toFixed(2), cutH: cutH.toFixed(2) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Finished piece width (in)"><input type="number" min="0" step="0.1" value={finW} onChange={(e) => setFinW(e.target.value)} /></Field>
        <Field label="Finished piece height (in)"><input type="number" min="0" step="0.1" value={finH} onChange={(e) => setFinH(e.target.value)} /></Field>
      </div>
      <div className="row">
        <Field label="Seam allowance per edge (in)"><input type="number" min="0" step="0.125" value={seam} onChange={(e) => setSeam(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate cut size</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Cut size (all 4 sides seamed): <strong>{out.cutW}in × {out.cutH}in</strong></p>}
      <Msg kind="status">Assumes seam allowance is added to every edge — trim the amount for any edge that's a fold or won't be seamed.</Msg>
    </div>
  )
}
