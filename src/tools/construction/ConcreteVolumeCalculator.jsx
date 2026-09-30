import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function ConcreteVolumeCalculator() {
  const [shape, setShape] = useState('Slab (rectangular)')
  const [w, setW] = useState('10')
  const [l, setL] = useState('10')
  const [t, setT] = useState('4')
  const [dia, setDia] = useState('12')
  const [depth, setDepth] = useState('36')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    let cuft = 0
    if (shape === 'Slab (rectangular)') {
      const W = Number(w), L = Number(l), T = Number(t)
      if (!(W > 0 && L > 0 && T > 0)) { setOut(null); return setErr('Enter width, length and thickness greater than 0.') }
      cuft = W * L * (T / 12)
    } else {
      const D = Number(dia), Dp = Number(depth)
      if (!(D > 0 && Dp > 0)) { setOut(null); return setErr('Enter diameter and depth greater than 0.') }
      const r = (D / 12) / 2
      cuft = Math.PI * r * r * (Dp / 12)
    }
    const cuyd = cuft / 27
    const bags80 = cuft / 0.6 // 80lb bag yields ~0.6 cu ft
    setErr('')
    setOut({ cuft: cuft.toFixed(1), cuyd: cuyd.toFixed(2), bags: Math.ceil(bags80) })
  }

  return (
    <div>
      <Field label="Shape"><select value={shape} onChange={(e) => setShape(e.target.value)}><option>Slab (rectangular)</option><option>Post hole (cylindrical)</option></select></Field>
      {shape === 'Slab (rectangular)' ? (
        <div className="row">
          <Field label="Width (ft)"><input type="number" min="0" value={w} onChange={(e) => setW(e.target.value)} /></Field>
          <Field label="Length (ft)"><input type="number" min="0" value={l} onChange={(e) => setL(e.target.value)} /></Field>
          <Field label="Thickness (in)"><input type="number" min="0" value={t} onChange={(e) => setT(e.target.value)} /></Field>
        </div>
      ) : (
        <div className="row">
          <Field label="Diameter (in)"><input type="number" min="0" value={dia} onChange={(e) => setDia(e.target.value)} /></Field>
          <Field label="Depth (in)"><input type="number" min="0" value={depth} onChange={(e) => setDepth(e.target.value)} /></Field>
        </div>
      )}
      <div className="actions"><button className="btn" onClick={calc}>Calculate volume</button></div>
      <Msg>{err}</Msg>
      {out && <p className="out" role="status">Volume: <strong>{out.cuft} cu ft</strong> ({out.cuyd} cu yd)<br />About <strong>{out.bags}</strong> 80 lb bags of ready-mix concrete.</p>}
    </div>
  )
}
