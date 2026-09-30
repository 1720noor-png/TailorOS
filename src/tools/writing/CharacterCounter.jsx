import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
export default function CharacterCounter() {
  const [text, setText] = useState('')
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0)
  const lines = text.split('\n').length
  return (
    <div>
      <Field label="Text"><textarea rows={6} value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste text..." /></Field>
      <div className="out" role="status">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:8,textAlign:'center'}}>
          {[['Characters',chars],['No Spaces',charsNoSpace],['Words',words],['Sentences',sentences],['Paragraphs',paragraphs],['Lines',lines]].map(([l,v]) => (
            <div key={l} style={{padding:8,background:'var(--bg2,#f7fafc)',borderRadius:8}}>
              <p style={{fontSize:'1.5rem',fontWeight:'bold'}}>{v}</p>
              <p style={{fontSize:'.8rem',color:'#888'}}>{l}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="hint">Real-time character, word, and sentence counts.</p>
    </div>
  )
}
