import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
export default function ContrastPairGen() {
  const [bg, setBg] = useState('#1a202c')
  const [fg, setFg] = useState('#ffffff')
  const lum = hex => {
    const [r,g,b] = [hex.slice(1,3),hex.slice(3,5),hex.slice(5,7)].map(h => {
      const v = parseInt(h, 16) / 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const l1 = lum(bg), l2 = lum(fg)
  const ratio = ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2)
  const aa = ratio >= 4.5, aaa = ratio >= 7, aaLarge = ratio >= 3
  return (
    <div>
      <div className="row">
        <Field label="Background"><input type="color" value={bg} onChange={e=>setBg(e.target.value)} /></Field>
        <Field label="Foreground"><input type="color" value={fg} onChange={e=>setFg(e.target.value)} /></Field>
      </div>
      <div style={{background:bg,color:fg,padding:20,borderRadius:8,textAlign:'center',marginTop:12}}>
        <p style={{fontSize:'1.5rem',fontWeight:'bold'}}>Sample Text</p>
        <p>The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div className="out" role="status">
        <p><strong>Contrast Ratio:</strong> {ratio}:1</p>
        <p>WCAG AA (normal): {aa ? '✅ Pass' : '❌ Fail'}</p>
        <p>WCAG AA (large): {aaLarge ? '✅ Pass' : '❌ Fail'}</p>
        <p>WCAG AAA: {aaa ? '✅ Pass' : '❌ Fail'}</p>
      </div>
      <p className="hint">Aim for 4.5:1 or higher for normal text.</p>
    </div>
  )
}
