import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
export default function BoxShadowGen() {
  const [x, setX] = useState('4')
  const [y, setY] = useState('4')
  const [blur, setBlur] = useState('10')
  const [spread, setSpread] = useState('0')
  const [color, setColor] = useState('#00000033')
  const shadow = x+'px '+y+'px '+blur+'px '+spread+'px '+color
  const css = 'box-shadow: '+shadow+';'
  return (
    <div>
      <div className="row">
        <Field label="X"><input type="number" value={x} onChange={e=>setX(e.target.value)} /></Field>
        <Field label="Y"><input type="number" value={y} onChange={e=>setY(e.target.value)} /></Field>
        <Field label="Blur"><input type="number" value={blur} onChange={e=>setBlur(e.target.value)} /></Field>
        <Field label="Spread"><input type="number" value={spread} onChange={e=>setSpread(e.target.value)} /></Field>
        <Field label="Color"><input type="text" value={color} onChange={e=>setColor(e.target.value)} /></Field>
      </div>
      <div style={{width:'100%',height:80,display:'flex',alignItems:'center',justifyContent:'center',marginTop:12}}>
        <div style={{width:120,height:60,borderRadius:8,background:'white',boxShadow:shadow}} />
      </div>
      <div className="out" role="status"><code>{css}</code><CopyBtn text={css} /></div>
      <p className="hint">Adjust values to preview the shadow.</p>
    </div>
  )
}
