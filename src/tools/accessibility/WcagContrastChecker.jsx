import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
export default function WcagContrastChecker() {
  const [fg, setFg] = useState('#333333')
  const [bg, setBg] = useState('#ffffff')
  const lum = hex => {
    const [r,g,b] = [hex.slice(1,3),hex.slice(3,5),hex.slice(5,7)].map(h => {
      const v = parseInt(h, 16) / 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const l1 = lum(fg), l2 = lum(bg)
  const ratio = ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2)
  const aaNorm = ratio >= 4.5, aaLarge = ratio >= 3, aaaNorm = ratio >= 7, aaaLarge = ratio >= 4.5
  return (
    <div>
      <div className="row">
        <Field label="Text Color"><input type="color" value={fg} onChange={e=>setFg(e.target.value)} /></Field>
        <Field label="Background"><input type="color" value={bg} onChange={e=>setBg(e.target.value)} /></Field>
      </div>
      <div style={{background:bg,color:fg,padding:20,borderRadius:8,textAlign:'center',margin:'12px 0'}}>
        <p style={{fontSize:'1.5rem'}}>Sample Text</p>
        <p style={{fontSize:'.9rem'}}>The quick brown fox jumps over the lazy dog</p>
      </div>
      <div className="out" role="status">
        <p style={{fontSize:'1.3rem',fontWeight:'bold'}}>Ratio: {ratio}:1</p>
        <table style={{width:'100%',fontSize:'.9rem',marginTop:8}}>
          <thead><tr><th></th><th>Normal Text</th><th>Large Text</th></tr></thead>
          <tbody>
            <tr><td><strong>AA</strong></td><td>{aaNorm?'✅ Pass':'❌ Fail'}</td><td>{aaLarge?'✅ Pass':'❌ Fail'}</td></tr>
            <tr><td><strong>AAA</strong></td><td>{aaaNorm?'✅ Pass':'❌ Fail'}</td><td>{aaaLarge?'✅ Pass':'❌ Fail'}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="hint">WCAG 2.1 requires 4.5:1 for normal text, 3:1 for large text.</p>
    </div>
  )
}
