import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
export default function ColorBlindnessSim() {
  const [color, setColor] = useState('#e74c3c')
  const hex2rgb = h => [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]
  const rgb2hex = (r,g,b) => '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')
  const [r,g,b] = hex2rgb(color)
  const sims = [
    {name:'Normal',c:color},
    {name:'Protanopia',c:rgb2hex(0.567*r+0.433*g,0.558*r+0.442*g,0.242*g+0.758*b)},
    {name:'Deuteranopia',c:rgb2hex(0.625*r+0.375*g,0.7*r+0.3*g,0.3*g+0.7*b)},
    {name:'Tritanopia',c:rgb2hex(0.95*r+0.05*g,0.433*g+0.567*b,0.475*g+0.525*b)},
    {name:'Achromatopsia',c:(() => {const l=Math.round(0.299*r+0.587*g+0.114*b);return rgb2hex(l,l,l)})()},
  ]
  return (
    <div>
      <Field label="Pick a Color"><input type="color" value={color} onChange={e=>setColor(e.target.value)} /></Field>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:8,marginTop:12}}>
        {sims.map(s => (
          <div key={s.name} style={{textAlign:'center'}}>
            <div style={{width:'100%',height:60,background:s.c,borderRadius:8}} />
            <p style={{fontSize:'.8rem',marginTop:4}}>{s.name}</p>
            <p style={{fontSize:'.75rem',color:'#888'}}>{s.c}</p>
          </div>
        ))}
      </div>
      <p className="hint">Approximate simulation of color vision deficiencies.</p>
    </div>
  )
}
