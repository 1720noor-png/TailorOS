import { useState } from 'react'
import { Field } from '../../components/ui.jsx'
const KEYS=[{"Key":"C Major / A minor","Sharps":0,"Flats":0,"Notes":"C D E F G A B"},{"Key":"G Major / E minor","Sharps":1,"Flats":0,"Notes":"G A B C D E F#"},{"Key":"D Major / B minor","Sharps":2,"Flats":0,"Notes":"D E F# G A B C#"},{"Key":"A Major / F# minor","Sharps":3,"Flats":0,"Notes":"A B C# D E F# G#"},{"Key":"F Major / D minor","Sharps":0,"Flats":1,"Notes":"F G A Bb C D E"},{"Key":"Bb Major / G minor","Sharps":0,"Flats":2,"Notes":"Bb C D Eb F G A"},{"Key":"Eb Major / C minor","Sharps":0,"Flats":3,"Notes":"Eb F G Ab Bb C D"}]
export default function KeySignatureRef() {
  const [q, setQ] = useState('')
  const f = KEYS.filter(k => !q.trim() || k.Key.toLowerCase().includes(q.toLowerCase()) || k.Notes.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <Field label="Search Key"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="G Major" /></Field>
      <div className="out" role="status">
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.9rem'}}>
          <thead><tr><th style={{textAlign:'left',padding:'4px 8px'}}>Key</th><th style={{padding:'4px 8px'}}>♯</th><th style={{padding:'4px 8px'}}>♭</th><th style={{padding:'4px 8px'}}>Notes</th></tr></thead>
          <tbody>{f.map((k,i) => <tr key={i}><td style={{padding:'4px 8px'}}>{k.Key}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{k.Sharps||'-'}</td><td style={{padding:'4px 8px',textAlign:'center'}}>{k.Flats||'-'}</td><td style={{padding:'4px 8px'}}>{k.Notes}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">Common key signatures and their notes.</p>
    </div>
  )
}
