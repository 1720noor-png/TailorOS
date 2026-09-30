import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
export default function ColorPaletteGen() {
  const [base, setBase] = useState('#3182ce')
  const shades = [0.9,0.7,0.5,0.3,0.1].map(f => {
    const r=parseInt(base.slice(1,3),16),g=parseInt(base.slice(3,5),16),b=parseInt(base.slice(5,7),16)
    const mix=(c,t,fac)=>Math.round(c+(t-c)*fac)
    const lr=mix(r,255,f),lg=mix(g,255,f),lb=mix(b,255,f)
    const dr=mix(r,0,f),dg=mix(g,0,f),db=mix(b,0,f)
    return {light:'#'+[lr,lg,lb].map(x=>x.toString(16).padStart(2,'0')).join(''),dark:'#'+[dr,dg,db].map(x=>x.toString(16).padStart(2,'0')).join('')}
  })
  const all = shades.map(s=>s.light).concat([base]).concat(shades.map(s=>s.dark).reverse())
  return (
    <div>
      <Field label="Base Color"><input type="color" value={base} onChange={e=>setBase(e.target.value)} /></Field>
      <div style={{display:'flex',borderRadius:8,overflow:'hidden',marginTop:12}}>
        {all.map((c,i) => <div key={i} style={{flex:1,height:60,background:c}} title={c} />)}
      </div>
      <div className="out" role="status" style={{marginTop:8}}>
        <p>{all.join(', ')}</p>
        <CopyBtn text={all.join(', ')} />
      </div>
      <p className="hint">Pick a base color to generate tints and shades.</p>
    </div>
  )
}
