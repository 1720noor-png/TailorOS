import { useState } from 'react'
import { CopyBtn } from '../../components/ui.jsx'
export default function BorderRadiusGen() {
  const [tl, setTl] = useState(12)
  const [tr, setTr] = useState(12)
  const [br, setBr] = useState(12)
  const [bl, setBl] = useState(12)
  const css = 'border-radius: '+tl+'px '+tr+'px '+br+'px '+bl+'px;'
  return (
    <div>
      <div className="row">
        {[['Top Left',tl,setTl],['Top Right',tr,setTr],['Bottom Right',br,setBr],['Bottom Left',bl,setBl]].map(([l,v,s]) => (
          <div key={l} className="field"><label>{l}</label><input type="range" min="0" max="100" value={v} onChange={e=>s(Number(e.target.value))} /><span>{v}px</span></div>
        ))}
      </div>
      <div style={{width:200,height:120,background:'var(--accent,#3182ce)',borderRadius:tl+'px '+tr+'px '+br+'px '+bl+'px',margin:'16px auto'}} />
      <div className="out" role="status"><code>{css}</code><CopyBtn text={css} /></div>
      <p className="hint">Adjust each corner independently.</p>
    </div>
  )
}
