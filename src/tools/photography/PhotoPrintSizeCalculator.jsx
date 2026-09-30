import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function PhotoPrintSizeCalculator() {
  const [pw, setPw] = useState('4000')
  const [ph, setPh] = useState('3000')
  const [dpi, setDpi] = useState('300')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    const w = Number(pw), h = Number(ph), d = Number(dpi)
    if (!(w > 0 && h > 0 && d > 0)) { setOut(null); return setErr('Enter pixel width, height and a target DPI greater than 0.') }
    setErr('')
    setOut({
      inW: (w / d).toFixed(1), inH: (h / d).toFixed(1),
      cmW: ((w / d) * 2.54).toFixed(1), cmH: ((h / d) * 2.54).toFixed(1),
      dpi150W: (w / 150).toFixed(1), dpi150H: (h / 150).toFixed(1),
    })
  }

  return (
    <div>
      <div className="row">
        <Field label="Image width (px)"><input type="number" min="1" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        <Field label="Image height (px)"><input type="number" min="1" value={ph} onChange={(e) => setPh(e.target.value)} /></Field>
        <Field label="Target DPI"><input type="number" min="1" value={dpi} onChange={(e) => setDpi(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate max print size</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          At {dpi} DPI: <strong>{out.inW}in × {out.inH}in</strong> ({out.cmW}cm × {out.cmH}cm)<br />
          <small>At 150 DPI (typical for large posters viewed from a distance): {out.dpi150W}in × {out.dpi150H}in</small>
        </p>
      )}
    </div>
  )
}
