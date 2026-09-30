import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'
export default function BraSizeConverter() {
  const [band, setBand] = useState('34')
  const [cup, setCup] = useState('C')
  const [result, setResult] = useState(null)
  const calculate = () => {
    const b = parseInt(band) || 34
    const cups = ['AA','A','B','C','D','DD','DDD','F','G','H']
    const cupIdx = cups.indexOf(cup.toUpperCase())
    if (cupIdx === -1) { setResult(null); return }
    const ukBand = b, usBand = b
    const euBand = Math.round(b * 2.54 / 5) * 5
    const frBand = euBand + 15
    setResult({us:usBand+cup.toUpperCase(),uk:ukBand+cup.toUpperCase(),eu:euBand+(cups[cupIdx]||cup),fr:frBand+(cups[cupIdx]||cup)})
  }
  return (
    <div>
      <div className="row">
        <Field label="Band Size"><input type="number" value={band} onChange={e=>setBand(e.target.value)} placeholder="34" /></Field>
        <Field label="Cup Size"><input value={cup} onChange={e=>setCup(e.target.value)} placeholder="C" style={{width:60}} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calculate}>Convert</button></div>
      {result && <div className="out" role="status">
        <p><strong>US:</strong> {result.us}</p>
        <p><strong>UK:</strong> {result.uk}</p>
        <p><strong>EU:</strong> {result.eu}</p>
        <p><strong>FR:</strong> {result.fr}</p>
      </div>}
      <p className="hint">Approximate conversions. Try on for best fit.</p>
    </div>
  )
}
