import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const SIZES=[{"Platform":"Instagram Post","Width":"1080","Height":"1080"},{"Platform":"Instagram Story","Width":"1080","Height":"1920"},{"Platform":"Facebook Post","Width":"1200","Height":"630"},{"Platform":"Facebook Cover","Width":"820","Height":"312"},{"Platform":"Twitter Post","Width":"1200","Height":"675"},{"Platform":"Twitter Header","Width":"1500","Height":"500"},{"Platform":"LinkedIn Post","Width":"1200","Height":"627"},{"Platform":"LinkedIn Banner","Width":"1128","Height":"191"},{"Platform":"YouTube Thumbnail","Width":"1280","Height":"720"},{"Platform":"Pinterest Pin","Width":"1000","Height":"1500"},{"Platform":"TikTok Video","Width":"1080","Height":"1920"},{"Platform":"OG Image","Width":"1200","Height":"630"}]
export default function ImageSizeReference() {
  const [q, setQ] = useState('')
  const filtered = SIZES.filter(s => !q.trim() || s.Platform.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <Field label="Search Platform"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Instagram" /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th style={{textAlign:'left',padding:'4px 8px'}}>Platform</th><th style={{padding:'4px 8px'}}>Width</th><th style={{padding:'4px 8px'}}>Height</th></tr></thead>
          <tbody>{filtered.map((s,i)=><tr key={i}><td style={{padding:'4px 8px'}}>{s.Platform}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{s.Width}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{s.Height}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">Recommended image sizes for major platforms.</p>
    </div>
  )
}
