import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'
export default function SwotAnalyzer() {
  const [data, setData] = useState({s:'',w:'',o:'',t:''})
  const labels = {s:'Strengths',w:'Weaknesses',o:'Opportunities',t:'Threats'}
  const colors = {s:'#c6f6d5',w:'#fed7d7',o:'#bee3f8',t:'#fefcbf'}
  const text = Object.entries(labels).map(([k,l]) => l+':\n'+(data[k]||'None')).join('\n\n')
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {Object.entries(labels).map(([k,l]) => (
          <div key={k} style={{background:colors[k],borderRadius:8,padding:8}}>
            <Field label={l}><textarea rows={3} value={data[k]} onChange={e=>setData({...data,[k]:e.target.value})} placeholder={'List '+l.toLowerCase()+'...'} /></Field>
          </div>
        ))}
      </div>
      <div className="actions"><CopyBtn text={text} /></div>
      <p className="hint">Fill all four quadrants for a complete analysis.</p>
    </div>
  )
}
