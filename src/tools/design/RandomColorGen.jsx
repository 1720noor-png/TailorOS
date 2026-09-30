import { useState } from 'react'
import { CopyBtn } from '../../components/ui.jsx'
export default function RandomColorGen() {
  const [colors, setColors] = useState([])
  const generate = () => {
    const newColors = Array.from({length: 5}, () => {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
      return { hex, rgb: r+', '+g+', '+b }
    })
    setColors(newColors)
  }
  return (
    <div>
      <div className="actions"><button className="btn" onClick={generate}>Generate Palette</button></div>
      {colors.length > 0 && <div className="out" role="status">
        <div style={{display:'flex',borderRadius:8,overflow:'hidden',marginBottom:12}}>
          {colors.map((c,i) => <div key={i} style={{flex:1,height:80,background:c.hex}} />)}
        </div>
        {colors.map((c,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <div style={{width:24,height:24,borderRadius:4,background:c.hex,border:'1px solid #ddd'}} />
            <code>{c.hex}</code>
            <code style={{color:'#888'}}>rgb({c.rgb})</code>
            <CopyBtn text={c.hex} />
          </div>
        ))}
      </div>}
      <p className="hint">Generate random 5-color palettes.</p>
    </div>
  )
}
